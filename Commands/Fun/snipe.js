const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'snipe',
    category: 'Fun',
    description: 'Returns the last deleted message in current or specified channel',
    aliases: [],
    syntax: `snipe [channel]`,
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: async(client, message, args, prefix) => {
        const responses = client.botResponses.responses.snipe;
        const selectedResponse = responses[Math.floor(Math.random() * responses.length)];
        return await message.reply(selectedResponse);
    }
}