"use strict";
const { BotResponseBuilder, TagResponseSender } = require('../../utils');
module.exports = {
    name: 'audio',
    category: 'Tags',
    description: 'Guides on how to isolate audio for making datasets',
    aliases: ['dataset'],
    syntax: 'audio [member]',
    run: async (client, message) => {
        const { botData, botConfigs } = client;
        const botResponse = new BotResponseBuilder();
        botResponse.addEmbeds(botData.embeds.guides.audio.en, botConfigs);
        const sender = new TagResponseSender();
        sender.setConfigs(botConfigs);
        sender.setResponse(botResponse);
        sender.setTargetMessage(message);
        sender.setTargetUser(message.mentions.members.first());
        await sender.send();
    },
};
