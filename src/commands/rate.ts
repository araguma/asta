import scores from '@/constants/scores';
import substats from '@/constants/substats';
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
                .setRequired(false)
            );
        for(const key in substats) {
            const { canonical } = substats[key as keyof typeof substats];
            builder.addStringOption((option) => option
                .setName(key)
                .setDescription(`${canonical} substat`)
                .setRequired(false)
            );
        }
    },
    handle: async interaction => {
        if(!interaction.isChatInputCommand()) return;

        const options = interaction.options;

        interaction.deferReply();
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

        const level = options.getNumber('level') ?? parseInt(text.match(/(?<=\+)\d+/)?.[0] ?? '0');
        const lines = text.split('\n').slice(-5, -1).filter((line) => line.length > 0);
        !text.includes('+') ?? lines.unshift();

        let total = 0;
        const rate = (substat: Substat, line: string) => {
            const { base, step, precision, weight } = substat;
            const enhances = Math.floor(level / 3);
            const min = floor(base, precision);
            const max = floor((base + step * 2) * (enhances + 1), precision);
            const value = parseFloat(line.match(/[^ ]*$/)?.[0] ?? '0');
            const score = handleNaN((value - min) / (max - min)) * weight;
            total += score * ((1 + enhances) / (lines.length + enhances));

            description += substat.canonical.padEnd(24);
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

        interaction.editReply({
            embeds: [ embed.setDescription(description + '```') ],
        });
    }
} satisfies Command;

function handleNaN(value: number) {
    return isNaN(value) ? 1 : value;
}

function floor(value: number, precision: number | undefined = undefined) {
    const multiplier = Math.pow(10, precision ?? 0);
    return Math.floor(value * multiplier) / multiplier;
}