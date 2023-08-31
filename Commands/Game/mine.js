const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'mine',
    category: 'Game',
    description: 'so we back into the mine',
    aliases: [],
    syntax: 'mine',
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