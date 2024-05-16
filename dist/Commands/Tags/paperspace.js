"use strict";
const { BotResponseBuilder, TagResponseSender } = require('../../utils');
module.exports = {
    name: 'paperspace',
    category: 'Tags',
    description: 'Paperspace tutorial by LollenApe',
    aliases: [],
    syntax: 'paperspace [member]',
    run: async (client, message) => {
        const { botConfigs, botData } = client;
        const selectedGuide = botData.embeds.guides.paperspace['en'];
        const botResponse = new BotResponseBuilder();
        botResponse.addEmbeds(selectedGuide.embeds, botConfigs);
        botResponse.addButtons(selectedGuide.buttons);
        const sender = new TagResponseSender();
        sender.setConfigs(botConfigs);
        sender.setTargetUser(message.mentions.members.first());
        sender.setResponse(botResponse);
        sender.setTargetMessage(message);
        await sender.send();
    },
};
