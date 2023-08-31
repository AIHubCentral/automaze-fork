const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'buy',
    category: 'Game',
    description: 'Buy an item from the merchants',
    aliases: [],
    syntax: `buy <item> [amount]`,
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: async (client, message, args, prefix) => {
        const embed = new EmbedBuilder()
            .setColor('Orange')
            .setDescription(`This command is temporarily unavailable, stay tuned!`);
        await message.channel.send({embeds: [embed]});
    }
}