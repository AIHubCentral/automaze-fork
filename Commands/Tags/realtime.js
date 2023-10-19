module.exports = {
    name: 'realtime',
    category: 'Tags',
    description: 'RVC real-time conversion guide',
    aliases: ['rt'],
    syntax: `realtime [member]`,
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: (client, message, args, prefix) => {
        const embed = client.botUtils.createEmbed(client.botData.embeds.realtime.en, client.botConfigs.colors.theme.primary);

        if (message.mentions.members.first()) {
            return message.channel.send({content: `*Tag suggestion for ${message.mentions.members.first()}*`, embeds: [embed]});
        }

        message.channel.send({embeds: [embed]});
    }
}