"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const i18n_1 = __importDefault(require("../../i18n"));
const botUtilities_1 = require("../../Utils/botUtilities");
const Local = {
    name: 'local',
    description: 'Links to all working local forks',
    aliases: ['applio', 'mangio', 'studio', 'links'],
    async run(client, message) {
        const { botCache, logger } = client;
        const resources = await (0, botUtilities_1.getResourceData)('local', botCache, logger);
        if (resources.length === 0) {
            await message.reply({ content: i18n_1.default.t('general.not_available') });
            return;
        }
        const content = [
            {
                title: i18n_1.default.t('tags.local.embed.title'),
                description: [(0, botUtilities_1.resourcesToUnorderedList)(resources)],
                footer: i18n_1.default.t('tags.local.embed.footer'),
            },
        ];
        const sender = new botUtilities_1.TagResponseSender(client);
        sender.setEmbeds(content);
        sender.config(message);
        await sender.send();
    },
};
exports.default = Local;
