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
    run: (client, message, args, prefix) => {
        const embed = new EmbedBuilder()
            .setTitle(`How do I know if my model is overtaining?`)
            .setImage(`https://media.discordapp.net/attachments/1124354352124010536/1126132264569417728/image.png`)
            .setDescription('## Realtime Overtraining Detection (ROD)\nhttps://github.com/grvyscale/RealtimeOvertrainingDetection\n\nClick on the image below to learn more about overtraining')
            .setColor(`Yellow`);

        if (message.mentions.members.first()) {
            return void message.channel.send({content: `*Tag suggestion for ${message.mentions.members.first()}*`, embeds: [embed]});
        }

        message.channel.send({embeds: [embed]});
    }
}