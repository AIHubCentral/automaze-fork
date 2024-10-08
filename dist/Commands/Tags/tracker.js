"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const botUtilities_1 = require("../../Utils/botUtilities");
const Tracker = {
    name: 'tracker',
    category: 'Tags',
    description: 'RVC real time tracker in spreadsheet',
    aliases: ['ss', 'spreadsheet'],
    syntax: `tracker [member]`,
    async run(client, message) {
        const { botData } = client;
        const content = botData.embeds.tracker.en;
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
exports.default = Tracker;
