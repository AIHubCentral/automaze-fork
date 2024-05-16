"use strict";
const { LanguageResponseSender } = require('../../utils');
module.exports = {
    name: 'upload',
    category: 'Tags',
    description: 'How to upload to `huggingface.co`',
    aliases: ['huggingface', 'hf'],
    syntax: 'upload [member]',
    run: async (client, message) => {
        const { botData, botConfigs, discordIDs } = client;
        const sender = new LanguageResponseSender(botConfigs, discordIDs.Channel);
        sender.setTargetMessage(message);
        sender.setContent(botData.embeds.guides.upload);
        sender.setTargetUser(message.mentions.members.first());
        await sender.send();
    },
};
