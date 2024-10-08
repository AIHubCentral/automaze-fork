"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generalUtilities_1 = require("../Utils/generalUtilities");
const BotChat = {
    name: 'messageCreate',
    once: false,
    async run(client, message) {
        // only proceed if feture is enabled in configs
        if (!client.botConfigs.general.chat)
            return;
        if (message.author.bot)
            return;
        // skip prefix commands
        const prefix = client.prefix;
        if (message.content.startsWith(prefix))
            return;
        const messageLowercase = message.content.toLowerCase();
        if (messageLowercase.endsWith('?')) {
            messageLowercase.replace('?', '');
        }
        const { botResponses, botUtils } = client;
        const questions = botResponses.botChat.en;
        let selectedAnswer = null;
        for (const msg of questions) {
            if (msg.prompts.includes(messageLowercase)) {
                const responseTypes = ['positive', 'negative'];
                if (botUtils.getRandomFromArray(responseTypes) === 'positive') {
                    selectedAnswer = botUtils.getRandomFromArray(msg.answers.positive);
                }
                else {
                    selectedAnswer = botUtils.getRandomFromArray(msg.answers.negative);
                }
                if (selectedAnswer.includes('$user')) {
                    selectedAnswer = selectedAnswer.replace('$user', message.author);
                }
                const answerLength = selectedAnswer.length;
                const typingDurationMs = 500;
                await message.channel.sendTyping();
                await (0, generalUtilities_1.delay)(answerLength * typingDurationMs);
                await message.reply(selectedAnswer);
                client.logger.info('Bot chat', {
                    more: {
                        channelId: message.channel.id,
                        guildId: message.guild?.id,
                        reply: selectedAnswer,
                    },
                });
            }
        }
    },
};
exports.default = BotChat;
