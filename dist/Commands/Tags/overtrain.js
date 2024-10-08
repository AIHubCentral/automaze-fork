"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const botUtilities_1 = require("../../Utils/botUtilities");
const Overtrain = {
    name: 'overtrain',
    category: 'Tags',
    description: 'How to tell whether your model is overtraining and what to do',
    aliases: ['overtraining', 'aod'],
    syntax: 'overtrain [member]',
    async run(client, message) {
        const { botData } = client;
        const content = botData.embeds.overtrain.en;
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
exports.default = Overtrain;
