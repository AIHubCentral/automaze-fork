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
        const { botCache, botData, logger } = client;
        // make a copy of the original embed data
        const content = JSON.parse(JSON.stringify(botData.embeds.kaggle.en.embeds));
        if (!content) {
            client.logger.error(`Missing embed data for -${this.name}`);
            await message.reply({ content: 'Failed to retrieve data...Try again later.' });
            return;
        }
        const resources = await (0, botUtilities_1.getResourceData)("kaggle", botCache, logger);
        const embedData = {
            title: content[0].title,
            color: content[0].color,
        };
        let embedDescription = [];
        if (resources.length > 0) {
            embedDescription.push((0, botUtilities_1.resourcesToUnorderedList)(resources));
        }
        embedDescription = embedDescription.concat(content[0].description);
        embedData.description = embedDescription;
        const sender = new botUtilities_1.TagResponseSender(client);
        sender.setEmbeds([embedData]);
        sender.config(message);
        await sender.send();
    },
};
exports.default = Kaggle;
