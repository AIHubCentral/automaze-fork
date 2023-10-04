module.exports = {
    name: 'turkishguides',
    category: 'Tags',
    description: 'AI Lab, Türkçe dil destekli sunucu ve 300\'den fazla Türkçe model',
    aliases: ['tr_guides', 'tr_g'],
    syntax: `turkishguides [member]`,
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: async (client, message, args, prefix) => {
        const embed = client.botUtils.createEmbed(client.botData.embeds.rvc.tr);

        if (message.mentions.members.first()) {
            return message.channel.send({content: `*Suggestions for ${message.mentions.members.first()}*`, embeds: [embed]});
        }

        message.channel.send({embeds: [embed]});
    }
}