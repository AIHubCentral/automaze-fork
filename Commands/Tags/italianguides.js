module.exports = {
    name: 'italianguides',
    category: 'Tags',
    description: 'Guide alle Colab e altre cose importanti riguardanti RVC in italiano',
    aliases: ['it_guides', 'it_g'],
    syntax: `italianguides <member>`,
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: async (client, message, args, prefix) => {
        const embed = client.botUtils.createEmbed(client.botData.embeds.rvc.it);

        if (message.mentions.members.first()) {
            return message.channel.send({content: `*Link suggeriti per ${message.mentions.members.first()}*`, embeds: [embed]});
        }

        message.channel.send({embeds: [embed]});
    }
}