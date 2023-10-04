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
        const embed = client.botUtils.createEmbed(client.botData.embeds.audio.en);

        if (message.mentions.members.first()) {
            return message.channel.send({content: `*Tag suggestion for ${message.mentions.members.first()}*`, embeds: [embed]});
        }

        message.channel.send({embeds: [embed]});
    }
}