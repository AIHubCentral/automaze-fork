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
        const { botCache, logger } = client;
        const resources = await (0, botUtilities_1.getResourceData)('hf', botCache, logger);
        let content = [];
        if (resources.length > 0) {
            content.push({
                title: '<:huggingface:1179800228946268270> Hugginface Spaces',
                color: 'ffcc4d',
                description: [(0, botUtilities_1.resourcesToUnorderedList)(resources)],
                footer: 'More commands: -audio, - colabs, -kaggle, -local, -overtraining, -realtime, -rvc, -help',
            });
        }
        const sender = new botUtilities_1.TagResponseSender(client);
        sender.setEmbeds(content);
        sender.config(message);
        await sender.send();
    },
};
exports.default = HF;
