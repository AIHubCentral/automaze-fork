module.exports = {
    name: 'japaneseguides',
    category: 'Tags',
    description: '和訳版RVCガイド (KJAV 訳 SUSHI 校)',
    aliases: ['jp_guides', 'jp_g'],
    syntax: `japaneseguides`,
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: async (client, message, args, prefix) => {
        const embed = client.botUtils.createEmbed(client.botData.embeds.rvc.jp);

        if (message.mentions.members.first()) {
            return message.channel.send({content: `*Tag suggestion for ${message.mentions.members.first()}*`, embeds: [embed]});
        }

        message.channel.send({embeds: [embed]});
    }
}