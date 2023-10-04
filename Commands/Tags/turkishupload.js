module.exports = {
    name: 'tr_upload',
    category: 'Tags',
    description: 'Turkish guide on how to upload to `huggingface.co`',
    aliases: ['tr_yükleme'],
    syntax: `tr_upload [member]`,
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: (client, message, args, prefix) => {
        const embed = client.botUtils.createEmbed(client.botData.embeds.upload.tr);

        if (message.mentions.members.first()) {
            return message.channel.send({content: `*Tag suggestion for ${message.mentions.members.first()}*`, embeds: [embed]});
        }

        message.channel.send({embeds: [embed]});
    }
}