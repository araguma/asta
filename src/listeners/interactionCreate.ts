import { Command, Listener } from '@/types';
import { join } from 'node:path';

export default {
    handle: async (interaction) => {
        if(!interaction.isCommand()) return;

        try {
            const dir = join(__rootname, 'commands');
            const command = require(join(dir, interaction.commandName)).default as Command;
            command.handle(interaction);
        } catch(error) {
            console.error(error);
            await interaction.reply({
                content: 'An error occured while executing this command!',
                ephemeral: true,
            });
        }
    }
} satisfies Listener<'interactionCreate'>;