"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const botUtilities_1 = require("../../Utils/botUtilities");
const Colab = {
    name: 'colab',
    category: 'Tags',
    description: 'Links to all working colabs/spaces',
    aliases: ['colabs', 'disconnected', 'train', 'training'],
    syntax: 'colab [member]',
    async run(client, message) {
        const { botCache, botData, logger } = client;
        const resources = await (0, botUtilities_1.getResourceData)("colab", botCache, logger);
        let content = [];
        if (resources.length > 0) {
            content.push({
                title: "☁️ Google Colabs",
                color: "f9ab00",
                description: [(0, botUtilities_1.resourcesToUnorderedList)(resources)],
            });
        }
        let noticeEmbeds = botData.embeds.colab_notice.en.embeds;
        if (noticeEmbeds) {
            for (const embed of noticeEmbeds) {
                content.push(embed);
            }
        }
        const sender = new botUtilities_1.TagResponseSender(client);
        sender.setEmbeds(content);
        sender.config(message);
        await sender.send();
    },
};
exports.default = Colab;
