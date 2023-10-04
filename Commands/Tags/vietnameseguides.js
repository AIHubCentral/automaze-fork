module.exports = {
    name: 'vietnameseguides',
    category: 'Tags',
    description: 'Hướng dẫn RVC trong tiếng Việt dịch bởi FungusDesu',
    aliases: ['vn_guides', 'vn_g'],
    syntax: `vietnameseguides <member>`,
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: async (client, message, args, prefix) => {
        const embed = client.botUtils.createEmbed(client.botData.embeds.rvc.vn);

        if (message.mentions.members.first()) {
            return message.channel.send({content: `*Gợi ý nhãn cho ${message.mentions.members.first()}*`, embeds: [embed]});
        }

        message.channel.send({embeds: [embed]});
    }
}