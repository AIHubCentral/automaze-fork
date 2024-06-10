"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const botUtilities_1 = require("../../Utils/botUtilities");
const HF = {
    name: 'hf',
    category: 'Tags',
    description: 'Links to all working huggingface spaces',
    aliases: ['spaces', 'hugginface'],
    syntax: 'hf [member]',
    async run(client, message) {
        const { botData } = client;
        const content = botData.embeds.hf.en.embeds;
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
exports.default = HF;
