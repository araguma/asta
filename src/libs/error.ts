import { CacheType, Interaction } from 'discord.js';

export default async function error(interaction: Interaction<CacheType>, options: {
    reply: string;
    error: string;
    debug?: any[];
}) {
    if(interaction.isRepliable())
        await interaction.editReply(options.reply);
    if(options.debug)
        console.debug(...options.debug);
    throw new Error(options.error);
}