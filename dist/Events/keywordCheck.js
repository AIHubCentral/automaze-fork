"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generalUtilities_1 = require("../Utils/generalUtilities");
const { ChannelType } = require('discord.js');
const generalUtilities_2 = require("../Utils/generalUtilities");
function isUserOnCooldown(client, userId) {
    let result = false;
    if (client.cooldowns.reactions.has(userId)) {
        client.logger.info(`${userId} is on cooldown...`);
        result = true;
        const cooldownExpiration = client.cooldowns.reactions.get(userId);
        const currentDate = new Date();
        if (currentDate.getTime() > cooldownExpiration.getTime()) {
            client.cooldowns.reactions.delete(userId);
            client.logger.info(`${userId} cooldown has expired`);
            result = false;
        }
    }
    return result;
}
function getNumberBasedOnFrequency(frequency) {
    let randomNumber = 0;
    if (frequency === 'rare') {
        randomNumber = (0, generalUtilities_1.getRandomNumber)(0, 100);
    }
    else if (frequency === 'sometimes') {
        randomNumber = (0, generalUtilities_1.getRandomNumber)(0, 10);
    }
    else if (frequency === 'often') {
        randomNumber = (0, generalUtilities_1.getRandomNumber)(0, 2);
    }
    return randomNumber;
}
const KeyWordCheck = {
    name: 'messageCreate',
    once: false,
    async run(client, message) {
        // only proceed if reactions is enabled in configs
        if (!client.botConfigs.general.reactions)
            return;
        // don't react to itself
        if (message.author.bot)
            return;
        // don't react to threads
        if (message.channel.type === ChannelType.PublicThread)
            return;
        // skip prefix commands
        if (message.content.startsWith(client.prefix))
            return;
        // e_boorgir reaction ignores cooldown
        if (message.content.includes(':e_boorgir:')) {
            await message.react('<:e_boorgir:1159654275069255750>');
            return;
        }
        if (isUserOnCooldown(client, message.author.id))
            return;
        // don't add reaction if there are attachments
        if (message.attachments.size > 0)
            return;
        const messageLowercase = message.content.toLowerCase();
        // don't react if keyword is in an url
        if (messageLowercase.includes('http'))
            return;
        try {
            let regex;
            let foundKeyword = false;
            let matchedKeywords = 0;
            // max of 20 reactions
            let reactionCounter = 0;
            for (const item of client.botData.reactionKeywords) {
                if (reactionCounter >= 20)
                    break;
                let shouldProceed = true;
                if (item.frequency) {
                    shouldProceed = getNumberBasedOnFrequency(item.frequency) === 0;
                }
                if (!shouldProceed)
                    continue;
                for (const keyword of item.keywords) {
                    // text is exact the keyword
                    if (item.exact) {
                        foundKeyword = messageLowercase === keyword;
                    }
                    else {
                        // otherwise check if text includes the keyword
                        // foundKeyword = messageLowercase.includes(keyword);
                        regex = new RegExp(`(?<!:)\\b${keyword}\\b`);
                        foundKeyword = regex.test(messageLowercase);
                    }
                    if (foundKeyword) {
                        matchedKeywords++;
                        // only needs to match one keyword
                        if (matchedKeywords > 1)
                            break;
                        // console.log('found', item);
                        const botResponse = { allowedMentions: { repliedUser: true } };
                        const messageInfo = {
                            messageId: message.id,
                            channelId: message.channel.id,
                            guildId: message.guild?.id,
                        };
                        switch (item.kind) {
                            case 'sticker':
                                botResponse.stickers = [item.stickerId];
                                await (0, generalUtilities_2.delay)(3_000);
                                try {
                                    client.logger.debug(`Attempting to add sticker ${item.stickerId}`, messageInfo);
                                    await message.reply(botResponse);
                                }
                                catch (error) {
                                    if (client.botConfigs.logs.stickers) {
                                        const logData = {
                                            error: error,
                                            more: {
                                                messageLink: `https://discordapp.com/channels/${message.guild?.id}/${message.channel.id}/${message.id}`,
                                                stickerId: item.stickerId,
                                            },
                                        };
                                        client.logger.error('Failed to add sticker', logData);
                                    }
                                }
                                break;
                            case 'text':
                                if (!item.responses)
                                    break;
                                try {
                                    botResponse.content = (0, generalUtilities_1.getRandomFromArray)(item.responses);
                                    const typingDuration = 350;
                                    await (0, generalUtilities_2.delay)(botResponse.content.length * typingDuration);
                                    await message.channel.sendTyping();
                                    client.logger.info(`Sendind text: ${botResponse.content}`, {
                                        more: messageInfo,
                                    });
                                    await message.reply(botResponse);
                                }
                                catch (error) {
                                    client.logger.error('failed to add text reaction', { more: messageInfo });
                                }
                                break;
                            default:
                                if (item.emojis) {
                                    for (const emoji of item.emojis) {
                                        await message.react(emoji);
                                        await (0, generalUtilities_2.delay)(2000);
                                        reactionCounter++;
                                    }
                                }
                        }
                    }
                }
                // console.log('End of keyword check');
            }
        }
        catch (error) {
            if (client.botConfigs.logs.emojis) {
                const logData = {
                    error: error,
                    more: {
                        messageLink: `https://discordapp.com/channels/${message.guild?.id}/${message.channel.id}/${message.id}`,
                    },
                };
                client.logger.error('Failed to add reaction', logData);
            }
        }
    },
};
exports.default = KeyWordCheck;
