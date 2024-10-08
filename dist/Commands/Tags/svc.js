"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generalUtilities_1 = require("../../Utils/generalUtilities");
const SVC = {
    name: 'svc',
    category: 'Tags',
    description: 'why do you still use svc',
    aliases: [],
    syntax: 'svc',
    async run(client, message) {
        const { botResponses } = client;
        const botResponse = {};
        const randomNumber = (0, generalUtilities_1.getRandomNumber)(0, 9);
        if (randomNumber !== 0) {
            botResponse.content =
                'https://cdn.discordapp.com/attachments/1159822429137412177/1194008385113301003/svc.gif?ex=65c13ef6&is=65aec9f6&hm=ce1f57bc316793f641c80f9b359ba9db7d1312af6918b1aed9c8468c74035bac&';
            return message.reply(botResponse);
        }
        const selectedMessage = (0, generalUtilities_1.getRandomFromArray)(botResponses.responses.svc);
        botResponse.content = selectedMessage;
        let mentionedUser = null;
        if (message.mentions.members?.size) {
            mentionedUser = message.mentions.members.first();
        }
        if (mentionedUser) {
            botResponse.content = `${mentionedUser} ${selectedMessage}`;
            // if mentioned a bot send 'how to make ai cover sticker'
            if (mentionedUser.user.bot) {
                botResponse.allowedMentions = { repliedUser: true };
                botResponse.content = '';
                botResponse.stickers = ['1159360069557813268'];
                return message.reply(botResponse);
            }
            await message.channel.sendTyping();
            await (0, generalUtilities_1.delay)(selectedMessage.length * 350);
            return message.channel.send(botResponse);
        }
        await message.channel.sendTyping();
        await (0, generalUtilities_1.delay)(selectedMessage.length * 350);
        return message.reply(botResponse);
    },
};
exports.default = SVC;
