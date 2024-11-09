"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const i18n_1 = __importDefault(require("../../i18n"));
const botUtilities_1 = require("../../Utils/botUtilities");
const discordUtilities_1 = require("../../Utils/discordUtilities");
const Local = {
    name: 'local',
    description: 'Links to all working local forks',
    aliases: ['applio', 'mangio', 'studio', 'links'],
    async run(client, message) {
        const { botCache, logger } = client;
        const resources = await (0, botUtilities_1.getResourceData)('local', botCache, logger);
        const language = (0, botUtilities_1.getLanguageByChannelId)(message.channelId);
        if (resources.length === 0) {
            await message.reply({ content: i18n_1.default.t('general.not_available', { lng: language }) });
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
            title: `${i18n_1.default.t('common.emojis.laptop')} ${i18n_1.default.t('tags.local.embed.title')}`,
            description: (0, botUtilities_1.resourcesToUnorderedList)(resources, language),
            footer: { text: i18n_1.default.t('tags.local.embed.footer', { lng: language }) },
        }, selectedTheme, 'primary');
        const sender = new botUtilities_1.TagResponseSender(client);
        sender.setEmbeds([embed]);
        sender.config(message);
        await sender.send();
    },
};
exports.default = Local;
