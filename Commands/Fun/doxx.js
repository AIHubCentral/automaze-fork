const Chance = require("chance");
const chance = new Chance;
const { EmbedBuilder } = require("discord.js")

module.exports = {
    name: 'doxx',
    category: 'Fun',
    description: 'NOT ACTUAL DOXXING. creates random ip and house address',
    aliases: [],
    syntax: `doxx`,
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: async (client, message, args, prefix) => {
        const embed = new EmbedBuilder()
            .setColor('Red')
            .setTitle('DEPRECATED')
            .setDescription(`Use \`/doxx\``)
            .setFooter({'text': 'Note: -doxx will be removed soon'});
        await message.channel.send({embeds: [embed]});
    }
}