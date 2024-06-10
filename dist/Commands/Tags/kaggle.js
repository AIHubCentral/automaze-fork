"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const botUtilities_1 = require("../../Utils/botUtilities");
const Kaggle = {
    name: 'kaggle',
    category: 'Tags',
    description: 'Links to kaggle notebooks',
    aliases: [],
    syntax: 'kaggle [member]',
    async run(client, message) {
        const { botData } = client;
        const content = botData.embeds.kaggle.en.embeds;
        if (!content) {
            client.logger.error(`Missing embed data for -${this.name}`);
            return;
        }
        const sender = new botUtilities_1.TagResponseSender(client);
        sender.setEmbeds(content);
        sender.config(message);
        await sender.send();
    },
};
exports.default = Kaggle;
