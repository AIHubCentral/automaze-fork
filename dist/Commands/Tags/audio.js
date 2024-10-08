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
        const { botCache, logger } = client;
        const resources = await (0, botUtilities_1.getResourceData)('audio', botCache, logger);
        if (resources.length === 0) {
            await message.reply({ content: 'Currently unavailable.' });
            return;
        }
        let content = [
            {
                title: '📚 Audio Guides & Tools',
                description: [(0, botUtilities_1.resourcesToUnorderedListAlt)(resources)],
                footer: 'More commands: -colab, -uvr, -karafan, -overtrain, -help',
            },
        ];
        const sender = new botUtilities_1.TagResponseSender(client);
        sender.setEmbeds(content);
        sender.config(message);
        await sender.send();
    },
};
exports.default = Audio;
