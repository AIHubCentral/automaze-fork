module.exports = {
    name: 'overtrain',
    category: 'Tags',
    description: 'How to tell whether your model is overtraining and what to do',
    aliases: ['overtraining', 'aod'],
    syntax: `overtrain [member]`,
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: async(client, message, args, prefix) => {
        const targetChannelId = client.discordIDs.Forum.Guides;
        const targetChannel = message.guild.channels.cache.get(targetChannelId) ?? '"❔┋guides" channel';

        // old image (`https://media.discordapp.net/attachments/1124354352124010536/1126132264569417728/image.png`)

        const embedData = {
            title: 'How do I know if my model is overtaining?',
            color: client.botConfigs.colors.theme.primary,
            description: [
                '## All-In-One Guide on how to make a good model',
                'This guide explains how the **D** and **G** files works and much more: https://rentry.org/RVC_making-models\n\nCredits: **[LUSBERT](https://discordapp.com/users/917711764571951144)** <:lusbertmoment:1159804751924432906>',
                `## Automated Overtraining Detection (AOD)\n> Will be available soon in ${targetChannel}\n\nCredits: **[grvyscale](https://discordapp.com/users/590867867247837203)**`
            ]
        };

        const embed = client.botUtils.createEmbed(embedData);

        if (message.mentions.members.first()) {
            return message.channel.send({content: `Hey, ${message.mentions.members.first()}!\n\n👇 Here are some resources to help you identify if your model is overtraining`, embeds: [embed]});
        }

        message.channel.send({embeds: [embed]});
    }
}