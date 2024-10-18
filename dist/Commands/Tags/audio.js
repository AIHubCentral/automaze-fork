"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const i18next_1 = __importDefault(require("i18next"));
const botUtilities_1 = require("../../Utils/botUtilities");
const Audio = {
    name: 'audio',
    description: 'Guides on how to isolate audio for making datasets',
    aliases: ['dataset'],
    async run(client, message) {
        const { botCache, logger } = client;
        const resources = await (0, botUtilities_1.getResourceData)('audio', botCache, logger);
        if (resources.length === 0) {
            await message.reply({ content: i18next_1.default.t('general.not_available') });
            return;
        }
        const content = [
            {
                title: i18next_1.default.t('tags.audio.embed.title'),
                description: [(0, botUtilities_1.resourcesToUnorderedListAlt)(resources)],
                footer: i18next_1.default.t('tags.audio.embed.footer'),
            },
        ];
        const sender = new botUtilities_1.TagResponseSender(client);
        sender.setEmbeds(content);
        sender.config(message);
        await sender.send();
    },
};
exports.default = Audio;
