"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const botUtilities_1 = require("../../Utils/botUtilities");
const Audio = {
    name: 'audio',
    category: 'Tags',
    description: 'Guides on how to isolate audio for making datasets',
    aliases: ['dataset'],
    syntax: 'audio [member]',
    async run(client, message) {
        const { botData } = client;
        if (!botData.embeds.audio.en.embeds) {
            client.logger.error('Missing embed data for -audio');
            return;
        }
        if (!message) {
            client.logger.error('Message was not available in -audio');
            return;
        }
        const sender = new botUtilities_1.TagResponseSender(client);
        sender.setEmbeds(botData.embeds.audio.en.embeds);
        sender.config(message);
        await sender.send();
    },
};
exports.default = Audio;
