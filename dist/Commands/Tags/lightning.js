"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const botUtilities_1 = require("../../Utils/botUtilities");
const Lightning = {
    name: 'light',
    category: 'Tags',
    description: 'Links to relevant lightning.ai stuff!',
    aliases: ['lightning', 'lightningai'],
    syntax: 'lightning [member]',
    async run(client, message) {
        const { botCache, logger } = client;
        const resources = await (0, botUtilities_1.getResourceData)("lightning_ai", botCache, logger);
        if (resources.length === 0) {
            await message.reply({ content: "⚡" });
            return;
        }
        let content = [{
                title: "⚡ Lightning AI",
                color: "b45aff",
                description: [(0, botUtilities_1.resourcesToUnorderedList)(resources)],
                footer: "More commands: -colabs, -kaggle, -hf, -realtime, -rvc, -help"
            }];
        const sender = new botUtilities_1.TagResponseSender(client);
        sender.setEmbeds(content);
        sender.config(message);
        await sender.send();
    },
};
exports.default = Lightning;
