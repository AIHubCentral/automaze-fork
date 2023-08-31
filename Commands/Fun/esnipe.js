const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'esnipe',
    category: 'Fun',
    description: 'Returns the last edited message in current or specified channel',
    aliases: ['editsnipe'],
    syntax: `esnipe [channel]`,
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: async(client, message, args, prefix) => {
        const embed = new EmbedBuilder()
        .setTitle(`💀 ~~i saw what you edited~~`)
        .setColor(0xFFFF00)
        .setDescription(`:calmcryandsmokin: This command is no longer available.`)
        .setFooter({text: `Note: -esnipe will be removed soon.`});
        await message.channel.send({embeds: [embed]});
    }
}