import { CacheType, ClientEvents, ColorResolvable, Interaction, SlashCommandBuilder } from 'discord.js';

declare global {
    var __rootname: string;
}

export type Listener<K extends keyof ClientEvents> = {
    handle(...args: ClientEvents[K]): Promise<any>;
}

export type Command = {
    define: (builder: SlashCommandBuilder) => any;
    handle: (interaction: Interaction<CacheType>) => Promise<any>;
}

export type Substat = {
    parse: string[];
    canonical: string;
    base: number;
    step: number;
    precision: number;
    weight: number;
}

export type Score = {
    name: string;
    threshold: number;
    color: ColorResolvable;
}