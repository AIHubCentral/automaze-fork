module.exports = {
    name: 'realtime',
    category: 'Tags',
    description: 'RVC real-time conversion guide',
    aliases: ['rt', 'tts'],
    syntax: `realtime [member]`,
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: (client, message, args, prefix) => {
        const targetChannelId = client.discordIDs.Channel.HelpWOkada;
        const targetChannel = message.guild.channels.cache.get(targetChannelId) ?? '"help-w-okada" channel';

        const embedData = client.botData.embeds.realtime.en;
        embedData.color = client.botConfigs.colors.theme.primary;

        // insert the link to the channel in $channel
        const lastDescriptionIndex = embedData.description.length - 1;
        const lastDescriptionText = embedData.description[lastDescriptionIndex]
        embedData.description[lastDescriptionIndex] = lastDescriptionText.replace('$channel', targetChannel);

        const embeds = [
            client.botUtils.createEmbed(embedData),
        ];

        if (message.mentions.members.first()) {
            return message.channel.send({content: `*Tag suggestion for ${message.mentions.members.first()}*`, embeds: embeds});
        }

        message.channel.send({embeds: embeds});
    }
}