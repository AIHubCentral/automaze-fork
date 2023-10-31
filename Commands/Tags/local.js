module.exports = {
    name: 'local',
    category: 'Tags',
    description: 'Links to all working local forks',
    aliases: ['applio', 'mangio', 'studio', 'links'],
    syntax: `local [member]`,
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: (client, message, args, prefix) => {
        const { createEmbed } = client.botUtils;
        const { theme } = client.botConfigs.colors;

        const embeds = [
            createEmbed(client.botData.embeds.local.en.content, theme.primary),
        ];

        const guidesChannel = message.guild.channels.cache.get(client.discordIDs.Forum.Guides) ?? '"❔┋guides"';
        const helpChannel = message.guild.channels.cache.get(client.discordIDs.Channel.HelpRVC) ?? '"help-rvc"';

        const moreEmbedData = client.botData.embeds.local.en.message;

        moreEmbedData.description[0] = moreEmbedData.description[0]
            .replace('$antasma', '[Antasma](https://discordapp.com/users/1037338320960761998)')
            .replace('$fazemasta', '[Faze Masta](https://discordapp.com/users/622856015444049937)')
            .replace('$guides', guidesChannel)
            .replace('$helpRVC', helpChannel);

        embeds.push(createEmbed(moreEmbedData, theme.secondary));

        if (message.mentions.members.first()) {
            return message.channel.send({content: `Suggestions for ${message.mentions.members.first()}`, embeds: embeds});
        }

        message.channel.send({ embeds: embeds });
    }
}