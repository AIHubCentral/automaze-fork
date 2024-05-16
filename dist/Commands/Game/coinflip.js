"use strict";
module.exports = {
    name: 'coinflip',
    category: 'Game',
    description: 'Toss a coin',
    aliases: ['lancia'],
    syntax: 'coinflip',
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
     * @param {String} prefix
     */
    run: async (client, message, args, prefix) => {
        const { botUtils, botResponses } = client;
        let botResponse = { content: botUtils.getRandomFromArray(botResponses.responses.coinflip.en) };
        if (message.content.startsWith('-lancia')) {
            botResponse.content = botUtils.getRandomFromArray(botResponses.responses.coinflip.it);
            if (args.includes(botResponse.content.toLowerCase())) {
                botResponse.content = '\n🎉 Grande!';
            }
        }
        else {
            if (args.includes(botResponse.content.toLowerCase())) {
                botResponse.content = '\n🎉 Congrats!';
            }
        }
        await message.reply(botResponse);
    }
};
