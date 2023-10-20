module.exports = {
    name: 'colab',
    category: 'Tags',
    description: 'Links to inference and training colabs made by kalo',
    aliases: ['colabs', 'disconnected', 'train', 'training'],
    syntax: `colab [member]`,
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: (client, message, args, prefix) => {
        const embeds = [
            client.botUtils.createEmbed(client.botData.embeds.colab.en.rvc),
            client.botUtils.createEmbed(client.botData.embeds.colab.en.uvr)
        ];

        if (message.mentions.members.first()) {
            return message.channel.send({content: `*Colab suggestions for ${message.mentions.members.first()}*`, embeds: embeds});
        }

        message.channel.send({content:'## Google Colabs', embeds: embeds});
    }
}