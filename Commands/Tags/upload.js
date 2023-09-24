const { EmbedBuilder } = require("discord.js")

module.exports = {
    name: 'upload',
    category: 'Tags',
    description: 'How to upload to `huggingface.co`',
    aliases: ['huggingface', 'hf'],
    syntax: `upload [member]`,
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: (client, message, args, prefix) => {
        const embedDescription = [];
        embedDescription.push(`## • Posting models to AI Hub by FDG\nhttps://rentry.org/fdg_guide_new`);

        const embed = new EmbedBuilder()
            .setTitle(`huggingface.co upload Guides`)
            .setDescription(embedDescription.join('\n'))
            .setColor(`Yellow`);

        if (message.mentions.members.first()) {
            return void message.channel.send({content: `*Tag suggestion for ${message.mentions.members.first()}*`, embeds: [embed]});
        }

        message.channel.send({embeds: [embed]});
    }
}