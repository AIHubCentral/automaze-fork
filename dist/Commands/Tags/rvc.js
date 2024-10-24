"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const i18n_1 = __importDefault(require("../../i18n"));
const botUtilities_1 = require("../../Utils/botUtilities");
const RVC = {
    name: 'rvc',
    description: 'Retrieval-based Voice Conversion Documentation (a.k.a How to Make AI Cover)',
    aliases: ['guide', 'guides', 'docs', 'doc', 'documentation'],
    async run(client, message) {
        const language = (0, botUtilities_1.getLanguageByChannelId)(message.channelId);
        const content = i18n_1.default.t('tags.rvc.embeds', { lng: language, returnObjects: true });
        const sender = new botUtilities_1.TagResponseSender(client);
        sender.setEmbeds(content);
        sender.config(message);
        await sender.send();
    },
};
exports.default = RVC;
