module.exports = {
    name: 'koreanguides',
    category: 'Tags',
    description: 'RVC 가이드 한국어 번역본 (KJAV 譯) 가이드 링크',
    aliases: ['kr_guides', 'kr_g'],
    syntax: `koreanguides`,
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: async (client, message, args, prefix) => {
        const embed = client.botUtils.createEmbed(client.botData.embeds.rvc.kr);

        if (message.mentions.members.first()) {
            return message.channel.send({content: `*Suggestions for ${message.mentions.members.first()}*`, embeds: [embed]});
        }

        message.channel.send({embeds: [embed]});
    }
}