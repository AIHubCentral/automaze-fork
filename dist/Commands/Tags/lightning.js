"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const botUtilities_1 = require("../../Utils/botUtilities");
const i18n_1 = __importDefault(require("../../i18n"));
const Lightning = {
    name: 'light',
    description: 'Links to relevant lightning.ai stuff!',
    aliases: ['lightning', 'lightningai'],
    async run(client, message) {
        const { botCache, logger } = client;
        const resources = await (0, botUtilities_1.getResourceData)('lightning_ai', botCache, logger);
        if (resources.length === 0) {
            await message.reply({ content: i18n_1.default.t('general.not_available') });
            return;
        }
        const content = [
            {
                title: i18n_1.default.t('tags.lightning.embed.title'),
                color: 'b45aff',
                description: [(0, botUtilities_1.resourcesToUnorderedList)(resources)],
                footer: i18n_1.default.t('tags.lightning.embed.footer'),
            },
        ];
        const sender = new botUtilities_1.TagResponseSender(client);
        sender.setEmbeds(content);
        sender.config(message);
        await sender.send();
    },
};
exports.default = Lightning;
