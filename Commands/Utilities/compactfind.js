const { EmbedBuilder } = require(`discord.js`);

module.exports = {
    name: 'compactfind',
    category: 'Utilities',
    description: 'Find posts in #voice-models forum, but return a compact embed to avoid flood',
    aliases: ['cfind'],
    syntax: `compactfind <query>`,
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: async (client, message, args, prefix) => {
        // which channel send to user
        const targetChannel = message.guild.channels.cache.get(client.discordIDs.Forum.VoiceModel);
        const botReply = await message.reply(`This command is currently unavailable. Please visit the ${targetChannel} channel if you wish to search for a model.`);

        // delete the messages after 30 seconds
        const messageTimeoutSeconds = 30;
        setTimeout(async() => {
            await message.delete();
            await botReply.delete();
        }, messageTimeoutSeconds * 1000);
    }
}