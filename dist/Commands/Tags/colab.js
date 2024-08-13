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
        const { botData } = client;
        const content = botData.embeds.colab.en.embeds;
        if (!content) {
            client.logger.error(`Missing embed data for -${this.name}`);
            return;
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
