module.exports = {
    name: 'spanishguides',
    category: 'Tags',
    description: 'Guías en español.',
    aliases: ['es_guides', 'es_g'],
    syntax: `es_g [member]`,
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: async (client, message, args, prefix) => {
        const embed = client.botUtils.createEmbed(client.botData.embeds.rvc.es);

        if (message.mentions.members.first()) {
            return message.channel.send({content: `*Sugerencia para ${message.mentions.members.first()}*`, embeds: [embed]});
        }

        message.channel.send({embeds: [embed]});
    }
}