module.exports = {
    name: 'colab',
    category: 'Tags',
    description: 'Links to inference and training colabs made by kalo',
    aliases: ['colabs'],
    syntax: `colab [member]`,
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: (client, message, args, prefix) => {
        const embed = client.botUtils.createEmbed(client.botData.embeds.colab.en);

        if (message.mentions.members.first()) {
            return message.channel.send({content: `*Colab suggestions for ${message.mentions.members.first()}*`, embeds: [embed]});
        }

        message.channel.send({embeds: [embed]});
    }
}