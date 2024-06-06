"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const botUtilities_1 = require("../../Utils/botUtilities");
const UVR = {
    name: 'uvr',
    category: 'Tags',
    description: 'Ultimate Vocal Remover',
    aliases: [],
    syntax: 'uvr [member]',
    async run(client, message) {
        const { botData } = client;
        const content = botData.embeds.uvr.en;
        if (!content.embeds || !content.buttons) {
            client.logger.error(`Missing embed data for -${this.name}`);
            return;
        }
        const sender = new botUtilities_1.TagResponseSender(client);
        sender.setEmbeds(content.embeds);
        sender.setButtons(content.buttons);
        sender.config(message);
        await sender.send();
    },
};
exports.default = UVR;
