const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'hangman',
    category: 'Game',
    description: 'Bet an amount of bitcoins and play a game of hangman',
    aliases: [],
    syntax: `hangman <money>`,
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