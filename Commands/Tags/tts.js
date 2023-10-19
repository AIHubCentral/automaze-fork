module.exports = {
    name: 'tts',
    category: 'Tags',
    description: 'Text-to-speech RVC conversion',
    aliases: ['texttospeech'],
    syntax: `tts [member]`,
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: (client, message, args, prefix) => {
        const embed = client.botUtils.createEmbed(client.botData.embeds.tts.en, client.botConfigs.colors.theme.primary);

        if (message.mentions.members.first()) {
            return message.channel.send({content: `*Tag suggestion for ${message.mentions.members.first()}*`, embeds: [embed]});
        }

        message.channel.send({embeds: [embed]});
    }
}