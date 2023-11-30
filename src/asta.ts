import { Listener } from '@/types';
import { Client, GatewayIntentBits } from 'discord.js';
import { readdirSync } from 'node:fs';
import { join, parse } from 'node:path';

if(!process.env.TOKEN) throw new Error('TOKEN not found in environment variables');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds
    ]
});

const dir = join(__rootname, 'listeners');
readdirSync(dir).forEach((path) => {
    const listener = require(join(dir, parse(path).name)).default as Listener<any>;
    client.on(parse(path).name, listener.handle);
});

client.login(process.env.TOKEN);