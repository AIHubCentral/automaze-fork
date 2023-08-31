const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'scour',
    category: 'Game',
    description: 'Scour through AI Hub and find something',
    aliases: [],
    syntax: 'scour',
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