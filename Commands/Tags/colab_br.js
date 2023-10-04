const { EmbedBuilder } = require("discord.js")

module.exports = {
    name: 'colab_br',
    category: 'Tags',
    description: 'Links de colabs traduzidos para português',
    aliases: ['colabs_br', 'br_colabs', 'br_colab'],
    syntax: `colab_br [member]`,
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: (client, message, args, prefix) => {
        const embed = client.botUtils.createEmbed(client.botData.embeds.colab.pt);

        if (message.mentions.members.first()) {
            return message.channel.send({content: `*Sugestões para ${message.mentions.members.first()}*`, embeds: [embed]});
        }

        message.channel.send({embeds: [embed]});
    }
}