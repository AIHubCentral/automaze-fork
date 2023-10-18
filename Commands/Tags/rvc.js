module.exports = {
    name: 'rvc',
    category: 'Tags',
    description: 'Retrieval-based Voice Conversions guide links made by kalo',
    aliases: ['paperspace', 'train', 'training', 'cover'],
    syntax: `rvc [member]`,
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: (client, message, args, prefix) => {

        console.log(args);

        const embeds = [
            client.botUtils.createEmbed(client.botData.embeds.rvc.en.docs),
            client.botUtils.createEmbed(client.botData.embeds.rvc.en.guides),
            client.botUtils.createEmbed(client.botData.embeds.rvc.en.translations),
        ];

        if (message.mentions.members.first()) {
            return message.channel.send({content: `Hey, ${message.mentions.members.first()}!\n\n👇 Here are some useful resources to help you learn how to make ai covers`, embeds: embeds});
        }

        message.channel.send({content: "# RVC Guides (How to Make AI Cover)", embeds: embeds});
    }
}