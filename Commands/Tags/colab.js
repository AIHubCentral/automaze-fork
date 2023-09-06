const { EmbedBuilder } = require("discord.js")

module.exports = {
    name: 'colab',
    category: 'Tags',
    description: 'Links to inference and training colabs made by kalo',
    aliases: [],
    syntax: `colab [member]`,
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: (client, message, args, prefix) => {
        const embedDescription = [];
        embedDescription.push(`## • Applio Colab 🍏 (NEWEST)\nhttps://colab.research.google.com/drive/157pUQep6txJOYModYFqvz_5OJajeh7Ii`);
        embedDescription.push(`### • RVC v2 Easy GUI Colab (outdated)\nhttps://colab.research.google.com/drive/1Gj6UTf2gicndUW_tVheVhTXIIYpFTYc7?usp=sharing`);

        const embed = new EmbedBuilder()
            .setTitle(`Google Colabs`)
            .setDescription(embedDescription.join('\n'))
            .setColor(`Yellow`);

        if (message.mentions.members.first()) {
            return void message.channel.send({content: `*Tag suggestion for ${message.mentions.members.first()}*`, embeds: [embed]});
        }

        message.channel.send({embeds: [embed]});
    }
}