const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'unequip',
    category: 'Game',
    description: 'Unequip equippables such as armors',
    aliases: ['ueq'],
    syntax: `unequip <item>`,
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