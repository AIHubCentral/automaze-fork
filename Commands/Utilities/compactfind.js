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
        await message.reply(client.botResponses.responses.find);
    }
}