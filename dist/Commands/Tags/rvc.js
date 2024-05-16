"use strict";
/* eslint-disable indent */
const { LanguageResponseSender } = require('../../utils');
module.exports = {
    name: 'rvc',
    category: 'Tags',
    description: 'Retrieval-based Voice Conversion Documentation (a.k.a How to Make AI Cover)',
    aliases: ['guide', 'guides', 'docs', 'doc', 'documentation'],
    syntax: 'rvc [member]',
    run: async (client, message) => {
        const { botData, botConfigs, discordIDs } = client;
        const sender = new LanguageResponseSender(botConfigs, discordIDs.Channel);
        sender.setTargetMessage(message);
        sender.setContent(botData.embeds.guides.rvc);
        sender.setTargetUser(message.mentions.members.first());
        await sender.send();
    },
};
