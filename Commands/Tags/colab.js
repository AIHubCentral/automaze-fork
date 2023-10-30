module.exports = {
    name: 'colab',
    category: 'Tags',
    description: 'Links to inference and training colabs made by kalo',
    aliases: ['colabs', 'disconnected', 'train', 'training', 'spaces', 'hf', 'hugginface'],
    syntax: `colab [member]`,
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
            createEmbed(client.botData.embeds.colab.en.main.content, theme.primary),
        ];

        const guidesChannel = message.guild.channels.cache.get(client.discordIDs.Forum.Guides) ?? '"❔┋guides"';
        const helpChannel = message.guild.channels.cache.get(client.discordIDs.Channel.HelpRVC) ?? '"help-rvc" channel';

        const moreEmbedData = client.botData.embeds.colab.en.main.message;

        moreEmbedData.description[0] = moreEmbedData.description[0]
            .replace('$antasma', '[Antasma](https://discordapp.com/users/1037338320960761998)')
            .replace('$fazemasta', '[Faze Masta](https://discordapp.com/users/622856015444049937)')
            .replace('$guides', guidesChannel)
            .replace('$helpRVC', helpChannel);

        embeds.push(createEmbed(moreEmbedData, theme.secondary));

        if (message.mentions.members.first()) {
            return message.channel.send({content: `*Colab suggestions for ${message.mentions.members.first()}*`, embeds: embeds});
        }

        message.channel.send({content:'## Google Colabs', embeds: embeds});
    }
}