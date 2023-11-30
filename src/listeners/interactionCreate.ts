import { Command, Listener } from '@/types';
import { join } from 'node:path';

export default {
    handle: async (interaction) => {
        if(!interaction.isCommand()) return;

        try {
            const dir = join(__rootname, 'commands');
            const command = require(join(dir, interaction.commandName)).default as Command;
            await interaction.deferReply();
            await command.handle(interaction);
        } catch(error) {
            console.error(error);
            if((await interaction.fetchReply()).content.length === 0)
                await interaction.editReply('An error occurred while executing this command');
        }
    }
} satisfies Listener<'interactionCreate'>;