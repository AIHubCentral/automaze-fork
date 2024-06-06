"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const botUtilities_1 = require("../../Utils/botUtilities");
const HFStatus = {
    name: 'hfstatus',
    category: 'Tags',
    description: 'Where to check hugginface status',
    aliases: ['hfstatus'],
    syntax: 'hfstatus [member]',
    async run(client, message) {
        const { botData } = client;
        if (!botData.embeds.hfstatus.en.embeds) {
            client.logger.error(`Missing embed data for -${this.name}`);
            return;
        }
        const sender = new botUtilities_1.TagResponseSender(client);
        sender.setEmbeds(botData.embeds.hfstatus.en.embeds);
        sender.config(message);
        await sender.send();
    },
};
exports.default = HFStatus;
