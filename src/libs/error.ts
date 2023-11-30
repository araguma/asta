import { CacheType, Interaction } from 'discord.js';

export default async function error(interaction: Interaction<CacheType>, options: {
    reply: string;
    error: string;
}) {
    if(interaction.isRepliable())
        await interaction.editReply(options.reply);
    throw new Error(options.error);
}