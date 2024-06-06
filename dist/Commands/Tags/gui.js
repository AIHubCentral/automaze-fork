"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generalUtilities_1 = require("../../Utils/generalUtilities");
const GUI = {
    name: 'gui',
    category: 'Tags',
    description: 'yeah i still use rvc easy gui',
    aliases: [],
    syntax: 'gui',
    async run(client, message) {
        const { botUtils } = client;
        const botResponse = {};
        const randomNumber = botUtils.getRandomNumber(0, 10);
        const mentionedUser = message?.mentions.members?.first();
        if (randomNumber !== 0) {
            botResponse.content = 'https://cdn.discordapp.com/attachments/1122285248844144733/1203460490475343953/caption.gif?ex=65d12cec&is=65beb7ec&hm=bd2fb8d010006dd7c6e3c1c67d3ae846fd1478e1a3124c544c31b43086fe54aa&';
            return message.reply(botResponse);
        }
        const selectedMessage = 'Yeah, I still use RVC Easy GUI.';
        botResponse.content = selectedMessage;
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
exports.default = GUI;
