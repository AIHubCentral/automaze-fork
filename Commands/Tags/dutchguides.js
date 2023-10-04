module.exports = {
    name: 'dutchguides',
    category: 'Tags',
    description: 'Uitleg voor het maken van AI-Covers in het Nederlands door Tamer',
    aliases: ['nl_guides', 'nl_g'],
    syntax: `dutchguides <member>`,
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: async (client, message, args, prefix) => {
        const embed = client.botUtils.createEmbed(client.botData.embeds.rvc.nl);

        if (message.mentions.members.first()) {
            return message.channel.send({content: `*Tag suggestie voor ${message.mentions.members.first()}*`, embeds: [embed]});
        }

        message.channel.send({embeds: [embed]});
    }
}