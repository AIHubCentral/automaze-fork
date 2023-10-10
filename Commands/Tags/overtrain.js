const { EmbedBuilder } = require("discord.js")

module.exports = {
    name: 'overtrain',
    category: 'Tags',
    description: 'How to tell whether your model is overtraining and what to do',
    aliases: ['overtraining'],
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

        const embedDescription = [];
        embedDescription.push('## All-In-One Guide on how to make a good model');
        embedDescription.push('This guide explains how the **D** and **G** files works and much more: https://rentry.org/RVC_making-models\n\nCredits: **[LUSBERT](https://discordapp.com/users/917711764571951144)** <:lusbertmoment:1159804751924432906>');
        embedDescription.push(`## Automated Overtraining Detection (AOD)\n> Will be available soon in ${targetChannel}\n\nCredits: **[grvscale](https://discordapp.com/users/590867867247837203)**`);

        const embed = new EmbedBuilder()
            .setTitle(`How do I know if my model is overtaining?`)
            //.setImage(`https://media.discordapp.net/attachments/1124354352124010536/1126132264569417728/image.png`)
            .setDescription(embedDescription.join('\n'))
            .setColor(`Yellow`);

        if (message.mentions.members.first()) {
            return message.channel.send({content: `*Tag suggestion for ${message.mentions.members.first()}*`, embeds: [embed]});
        }

        message.channel.send({embeds: [embed]});
    }
}