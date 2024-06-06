"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const botUtilities_1 = require("../../Utils/botUtilities");
const RVC = {
    name: 'rvc',
    category: 'Tags',
    description: 'Retrieval-based Voice Conversion Documentation (a.k.a How to Make AI Cover)',
    aliases: ['guide', 'guides', 'docs', 'doc', 'documentation'],
    syntax: 'rvc [member]',
    async run(client, message) {
        const { botData } = client;
        const content = botData.embeds.rvc.en;
        if (!content.embeds) {
            client.logger.error(`Missing embed data for -${this.name}`);
            return;
        }
        const sender = new botUtilities_1.TagResponseSender(client);
        sender.setEmbeds(content.embeds);
        sender.config(message);
        await sender.send();
    },
};
exports.default = RVC;
