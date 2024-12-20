"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const botUtilities_1 = require("../../Utils/botUtilities");
const i18n_1 = __importDefault(require("../../i18n"));
const discordUtilities_1 = require("../../Utils/discordUtilities");
const Kaggle = {
    name: 'kaggle',
    description: 'Links to kaggle notebooks',
    aliases: [],
    async run(client, message) {
        const { botCache, logger } = client;
        const resources = await (0, botUtilities_1.getResourceData)('kaggle', botCache, logger);
        const language = (0, botUtilities_1.getLanguageByChannelId)(message.channelId);
        if (resources.length === 0) {
            await message.reply({ content: i18n_1.default.t('general.not_available', { lng: language }) });
            return;
        }
        const content = [
            {
                title: i18n_1.default.t('tags.kaggle.embed.title', { lng: language }),
                color: discord_js_1.Colors.DarkBlue,
                description: [
                    (0, botUtilities_1.resourcesToUnorderedList)(resources, language),
                    i18n_1.default.t('tags.kaggle.guide', { lng: language }),
                    i18n_1.default.t('tags.kaggle.notice', { lng: language }),
                ],
                footer: i18n_1.default.t('tags.kaggle.embed.footer', { lng: language }),
            },
        ];
        const embeds = content.map((item) => (0, discordUtilities_1.createEmbed)(item, item.color));
        const sender = new botUtilities_1.TagResponseSender(client);
        sender.setEmbeds(embeds);
        sender.config(message);
        await sender.send();
    },
};
exports.default = Kaggle;
