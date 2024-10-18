"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Overtrain = {
    name: 'overtrain',
    description: 'How to tell whether your model is overtraining and what to do',
    aliases: ['overtraining'],
    async run(client, message) {
        return await message.reply({
            content: 'Moved to `/faq` command.',
            allowedMentions: { repliedUser: true },
        });
    },
};
exports.default = Overtrain;
