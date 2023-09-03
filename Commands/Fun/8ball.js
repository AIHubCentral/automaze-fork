const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: '8ball',
    category: 'Fun',
    description: 'Answer questions of your life',
    aliases: [`8balls`],
    syntax: `8ball`,
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
            .setDescription(`Use \`/8ball\``)
            .setFooter({'text': 'Note: -8ball will be removed soon'});
        await message.channel.send({embeds: [embed]});
    }
}