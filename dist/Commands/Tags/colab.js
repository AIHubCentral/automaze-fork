"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const botUtilities_1 = require("../../Utils/botUtilities");
const i18next_1 = __importDefault(require("i18next"));
const Colab = {
    name: 'colab',
    description: 'Links to all working colabs/spaces',
    aliases: ['colabs', 'disconnected', 'train', 'training'],
    async run(client, message) {
        const { botCache, logger } = client;
        const resources = await (0, botUtilities_1.getResourceData)('colab', botCache, logger);
        const language = (0, botUtilities_1.getLanguageByChannelId)(message.channelId);
        if (resources.length === 0) {
            await message.reply({ content: i18next_1.default.t('general.not_available', { lng: language }) });
            return;
        }
        const content = [
            {
                title: i18next_1.default.t('tags.colab.embed.title', { lng: language }),
                color: 'f9ab00',
                description: [(0, botUtilities_1.resourcesToUnorderedList)(resources, language)],
            },
            {
                title: i18next_1.default.t('tags.colab.notice.embed.title', { lng: language }),
                description: [i18next_1.default.t('tags.colab.notice.embed.description', { lng: language })],
                footer: i18next_1.default.t('tags.colab.embed.footer', { lng: language }),
            },
        ];
        const sender = new botUtilities_1.TagResponseSender(client);
        sender.setEmbeds(content);
        sender.config(message);
        await sender.send();
    },
};
exports.default = Colab;
