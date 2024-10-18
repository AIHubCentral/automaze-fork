"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const botUtilities_1 = require("../../Utils/botUtilities");
const Realtime = {
    name: 'realtime',
    description: 'RVC real-time conversion guide',
    aliases: ['rt', 'tts'],
    run: async (client, message) => {
        const targetUser = message.mentions.members?.first();
        await (0, botUtilities_1.handleSendRealtimeGuides)(message, targetUser, message.author);
    },
};
exports.default = Realtime;
