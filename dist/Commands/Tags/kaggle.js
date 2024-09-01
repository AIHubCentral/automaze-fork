"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const resourcesService_1 = __importDefault(require("../../Services/resourcesService"));
const botUtilities_1 = require("../../Utils/botUtilities");
const Kaggle = {
    name: 'kaggle',
    category: 'Tags',
    description: 'Links to kaggle notebooks',
    aliases: [],
    syntax: 'kaggle [member]',
    async run(client, message) {
        const { botData } = client;
        // make a copy of the original embed data
        const content = JSON.parse(JSON.stringify(botData.embeds.kaggle.en.embeds));
        if (!content) {
            client.logger.error(`Missing embed data for -${this.name}`);
            await message.reply({ content: 'Failed to retrieve data...Try again later.' });
            return;
        }
        const resourceService = new resourcesService_1.default(client.logger);
        const embeds = await createResponse(content, resourceService);
        const sender = new botUtilities_1.TagResponseSender(client);
        sender.setEmbeds(embeds);
        sender.config(message);
        await sender.send();
    },
};
exports.default = Kaggle;
async function createResponse(kaggleEmbeds, service) {
    const response = [];
    const embed = {
        title: '📘 Kaggle Notebooks',
        footer: kaggleEmbeds[0].footer,
    };
    const embedDescription = [];
    // try to get info from database first
    const records = await service.findByCategory('kaggle');
    if (records.length > 0) {
        embedDescription.push((0, botUtilities_1.resourcesToUnorderedList)(records));
    }
    // merge with data from json
    kaggleEmbeds[0].description?.forEach(item => embedDescription.push(item));
    // add the notice
    embedDescription.push((0, discord_js_1.quote)("Note: Kaggle limits GPU usage to 30 hours per week."));
    embed.description = embedDescription;
    response.push(embed);
    return response;
}
