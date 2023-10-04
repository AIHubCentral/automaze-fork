module.exports = {
    name: 'brazilianguides',
    category: 'Tags',
    description: 'Guias traduzidos em português para iniciantes.',
    aliases: ['br_guides', 'br_g', 'br_rvc', 'rvc_br'],
    syntax: `br_g [member]`,
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: async (client, message, args, prefix) => {
        const embed = client.botUtils.createEmbed(client.botData.embeds.rvc.pt);

        if (message.mentions.members.first()) {
            return message.channel.send({content: `*Sugestões para ${message.mentions.members.first()}*`, embeds: [embed]});
        }

        message.channel.send({embeds: [embed]});
    }
}