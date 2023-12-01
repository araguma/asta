import scores from '@/constants/scores';
import substats from '@/constants/substats';
import error from '@/libs/error';
import { Command, Substat } from '@/types';
import { EmbedBuilder } from 'discord.js';
import sharp from 'sharp';
import { createWorker } from 'tesseract.js';

export default {
    define: (builder) => {
        builder
            .setName('rate')
            .setDescription('Rate a relic')
            .addAttachmentOption((option) => option
                .setName('relic')
                .setDescription('A screenshot of the relic')
                .setRequired(true)
            )
            .addNumberOption((option) => option
                .setName('level')
                .setDescription('The level of the relic')
                .setMinValue(0)
                .setMaxValue(15)
                .setRequired(false)
            );
        for(const key in substats) {
            const { canonical } = substats[key as keyof typeof substats];
            builder.addNumberOption((option) => option
                .setName(key)
                .setDescription(`${canonical} substat`)
                .setRequired(false)
            );
        }
    },
    handle: async interaction => {
        if(!interaction.isChatInputCommand()) return;

        const options = interaction.options;
        const embed = new EmbedBuilder();
        let description = '```\n';

        const url = options.getAttachment('relic')!.url;
        const buffer = await sharp(await (await fetch(url)).arrayBuffer())
            .sharpen()
            .threshold(160)
            .toBuffer();

        const worker = await createWorker('eng');
        const result = await worker.recognize(buffer);
        await worker.terminate();
        const text = result.data.text;

        const level = options.getNumber('level') ?? parseInt(text.match(/(?<=\+)\d+/)?.[0] ?? '-1');
        if(level < 0 || level > 15) await error(interaction, {
            reply: 'Unable to detect relic level, please specify it manually',
            error: 'Invalid relic level',
            debug: [ text ],
        });

        let lines = text.split('\n').filter((line) => line.length > 0);
        for(const key in substats) {
            const { parse } = substats[key as keyof typeof substats];
            const value = options.getNumber(key);
            if(value) lines.push(`${parse.join('')} ${value}`);
        }
        lines.find((line, index) => {
            if(line.includes('+'))
                lines = lines.slice(index + 2);
        });
        if(lines.length < 3) await error(interaction, {
            reply: `Missing at least ${3 - lines.length + (level >= 3 ? 1 : 0)} substat(s), please specify them manually`,
            error: 'Invalid substat count',
            debug: [ text, lines ],
        });
        if(lines.length === 3 && level >= 3) await error(interaction, {
            reply: 'Missing one substat, please specify it manually',
            error: 'Invalid substat count',
            debug: [ text, lines ],
        });
        if(lines.length > 4) await error(interaction, {
            reply: `${lines.length - 4} extra substat(s) detected, do you have extra substat arguments?`,
            error: 'Invalid substat count',
            debug: [ text, lines ],
        });

        let total = 0;
        const rate = (substat: Substat, line: string) => {
            const { canonical, base, step, precision, weight } = substat;
            const rolls = Math.floor(level / 3);
            const value = parseFloat(line.match(/[\d\.\%]*$/)?.[0] ?? '-1');
            const score = (value / floor((base + step * 2) * (rolls + 1), precision)) * weight;
            total += score * ((1 + rolls) / (4 + rolls));

            description += canonical.padEnd(24);
            description += `${value.toFixed(precision)}${precision ? '%' : ''}`.padStart(8);
            description += ` (${(score * 100).toFixed(2)}%)`;
            description += '\n';
        }
        lines.forEach((line) => {
            for(const substat of Object.values(substats))
                if(substat.parse.every((phrase) => line.toLowerCase().includes(phrase)))
                    return rate(substat, line);
        });

        scores.find((score) => {
            if(total >= score.threshold) {
                embed.setColor(score.color);
                embed.setTitle(`${score.name} - ${(total * 100).toFixed(2)}% Efficiency (+${level})`);
                return true;
            }
        });

        await interaction.editReply({
            embeds: [
                embed
                    .setDescription(description + '```'),
            ],
        });
    }
} satisfies Command;

function floor(value: number, precision: number | undefined = undefined) {
    const multiplier = Math.pow(10, precision ?? 0);
    return Math.floor(value * multiplier) / multiplier;
}