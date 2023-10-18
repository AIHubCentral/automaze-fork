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
        // remove mentions
        const filteredArgs = args.filter(str => !str.includes('@'));
        let messageTitle = 'RVC Guides (How to Make AI Cover)';
        let messageContent = 'Here are some useful resources to help you learn how to make ai covers';
        let messageBlooper = 'bruh i know how to make ai cover';
        
        // defaults to english
        let embeds = [
            client.botUtils.createEmbed(client.botData.embeds.rvc.en.docs),
            client.botUtils.createEmbed(client.botData.embeds.rvc.en.guides),
            client.botUtils.createEmbed(client.botData.embeds.rvc.en.translations),
        ];

        // get the first argument
        if (filteredArgs.length > 0) {
            switch(filteredArgs[0]) {
                case 'br':
                    embeds = [client.botUtils.createEmbed(client.botData.embeds.rvc.pt)];
                    messageTitle = 'Guias RVC (como fazer cover com IA)';
                    messageContent = 'Veja essas recomendações abaixo';
                    messageBlooper = 'Eu sei fazer covers rsrs';
                    break;
            }
        }

        if (message.mentions.members.first()) {
            // check if mentioned the bot
            if (client.user.id === message.mentions.members.first().id) {
                return message.reply(messageBlooper);
            }

            return message.channel.send({content: `Hey, ${message.mentions.members.first()}!\n\n👇 ${messageContent}`, embeds: embeds});
        }

        message.channel.send({content: `# ${messageTitle}`, embeds: embeds});
    }
}