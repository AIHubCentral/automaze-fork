"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const HowToAsk = {
    name: 'howtoask',
    category: 'Tags',
    description: 'How to ask for help properly.',
    aliases: ['ask', 'hta'],
    syntax: 'howtoask',
    async run(client, message) {
        await message.reply(`This command has been changed to ${(0, discord_js_1.inlineCode)('!howtoask')}`);
    },
};
exports.default = HowToAsk;
