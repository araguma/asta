import { Command, Listener } from '@/types';
import { REST, RESTPostAPIChatInputApplicationCommandsJSONBody, Routes, SlashCommandBuilder } from 'discord.js';
import { readdirSync } from 'node:fs';
import { join, parse } from 'node:path';

export default {
    handle: async (client) => {
        const rest = new REST({ version: '10' }).setToken(client.token);
        const body: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];
        const dir = join(__rootname, 'commands');
        readdirSync(dir).forEach((path) => {
            const command = require(join(dir, parse(path).name)).default as Command;
            const builder = new SlashCommandBuilder();
            command.define(builder);
            body.push(builder.toJSON());
        });
        await rest.put(Routes.applicationCommands(client.user.id), { body });
        console.log(`Successfully registered ${body.length} command(s)`);
    }
} satisfies Listener<'ready'>;