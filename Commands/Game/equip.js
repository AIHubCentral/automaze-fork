const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'equip',
    category: 'Game',
    description: 'Equip equippables such as armors',
    aliases: ['eq'],
    syntax: `equip <item>`,
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