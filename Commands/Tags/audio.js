module.exports = {
    name: 'audio',
    category: 'Tags',
    description: 'Guides on how to isolate audio for making datasets',
    aliases: ['dataset', 'uvr'],
    syntax: `audio [member]`,
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: async(client, message, args, prefix) => {
        const embeds = [
            client.botUtils.createEmbed(client.botData.embeds.audio.en.guides),
            client.botUtils.createEmbed(client.botData.embeds.audio.en.tools)
        ]

        if (message.mentions.members.first()) {
            return message.channel.send({content: `*Tag suggestion for ${message.mentions.members.first()}*`, embeds: embeds});
        }

        message.channel.send({embeds: embeds});
    }
}