"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const i18n_1 = __importDefault(require("../../i18n"));
const botUtilities_1 = require("../../Utils/botUtilities");
const discordUtilities_1 = require("../../Utils/discordUtilities");
const Karafan = {
    name: 'karafan',
    description: 'KaraFan audio separation tool',
    aliases: [],
    async run(client, message) {
        const content = i18n_1.default.t('tags.karafan', {
            returnObjects: true,
        });
        const embeds = [(0, discordUtilities_1.createEmbed)(content.embed)];
        const sender = new botUtilities_1.TagResponseSender(client);
        sender.setEmbeds(embeds);
        sender.setButtons(content.buttons);
        sender.config(message);
        await sender.send();
    },
};
exports.default = Karafan;
