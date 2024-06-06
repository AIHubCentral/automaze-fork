"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const botUtilities_1 = require("../../Utils/botUtilities");
const Upload = {
    name: 'upload',
    category: 'Tags',
    description: 'How to upload to `huggingface.co`',
    aliases: ['huggingface', 'hf'],
    syntax: 'upload [member]',
    async run(client, message) {
        const { botData } = client;
        const content = botData.embeds.upload.en;
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
exports.default = Upload;
