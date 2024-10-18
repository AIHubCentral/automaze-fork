"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const i18n_1 = __importDefault(require("../../i18n"));
const botUtilities_1 = require("../../Utils/botUtilities");
const Paperspace = {
    name: 'paperspace',
    description: 'Paperspace tutorial by LollenApe',
    aliases: [],
    async run(client, message) {
        const content = i18n_1.default.t('tags.paperspace', { returnObjects: true });
        const sender = new botUtilities_1.TagResponseSender(client);
        sender.setEmbeds([content.embed]);
        sender.config(message);
        await sender.send();
    },
};
exports.default = Paperspace;
