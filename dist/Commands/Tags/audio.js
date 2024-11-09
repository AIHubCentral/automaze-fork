"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const i18next_1 = __importDefault(require("i18next"));
const botUtilities_1 = require("../../Utils/botUtilities");
const discordUtilities_1 = require("../../Utils/discordUtilities");
const Audio = {
    name: 'audio',
    description: 'Guides on how to isolate audio for making datasets',
    aliases: ['dataset'],
    async run(client, message) {
        const { botCache, logger } = client;
        const resources = await (0, botUtilities_1.getResourceData)('audio', botCache, logger);
        const language = (0, botUtilities_1.getLanguageByChannelId)(message.channelId);
        if (resources.length === 0) {
            await message.reply({ content: i18next_1.default.t('general.not_available', { lng: language }) });
            return;
        }
        let selectedTheme = null;
        const settings = client.botCache.get('main_settings');
        if (!settings) {
            selectedTheme = discordUtilities_1.ColorThemes.Default;
        }
        else {
            selectedTheme = settings.theme;
        }
        const embed = (0, discordUtilities_1.createThemedEmbed)({
            title: `${i18next_1.default.t('common.emojis.book')} ${i18next_1.default.t('tags.audio.embed.title', { lng: language })}`,
            description: (0, botUtilities_1.resourcesToUnorderedListAlt)(resources, language),
            footer: {
                text: i18next_1.default.t('tags.audio.embed.footer', { lng: language }),
            },
        }, selectedTheme, 'primary');
        const sender = new botUtilities_1.TagResponseSender(client);
        sender.setEmbeds([embed]);
        sender.config(message);
        await sender.send();
    },
};
exports.default = Audio;
