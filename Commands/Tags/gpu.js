module.exports = {
    name: 'gpu',
    category: 'Tags',
    description: 'Guides of what to do when your colab is unable to connect to a GPU',
    aliases: [],
    syntax: `gpu [member]`,
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: (client, message, args, prefix) => {
        const embed = client.botUtils.createEmbed(client.botData.embeds.gpu.en);

        if (message.mentions.members.first()) {
            return message.channel.send({content: `*Tag suggestion for ${message.mentions.members.first()}*`, embeds: [embed]});
        }

        message.channel.send({embeds: [embed]});
    }
}