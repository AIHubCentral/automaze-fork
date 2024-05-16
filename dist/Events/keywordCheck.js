"use strict";
/* eslint-disable indent */
const { ChannelType } = require('discord.js');
const { getChannelById } = require('../utils.js');
const delay = require('node:timers/promises').setTimeout;
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
module.exports = {
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
        const prefix = client.prefix;
        if (message.content.startsWith(prefix))
            return;
        // e_boorgir reaction ignores cooldown
        if (message.content.includes(':e_boorgir:')) {
            return await message.react('<:e_boorgir:1159654275069255750>');
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
                let randomNumber = 0;
                let shouldProceed = true;
                if (item.frequency) {
                    if (item.frequency === 'rare') {
                        randomNumber = client.botUtils.getRandomNumber(0, 100);
                    }
                    else if (item.frequency === 'sometimes') {
                        randomNumber = client.botUtils.getRandomNumber(0, 10);
                    }
                    else if (item.frequency === 'often') {
                        randomNumber = client.botUtils.getRandomNumber(0, 2);
                    }
                    shouldProceed = randomNumber === 0;
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
                            guildId: message.guild.id,
                        };
                        switch (item.kind) {
                            case 'sticker':
                                botResponse.stickers = [item.stickerId];
                                await delay(3000);
                                try {
                                    client.logger.info(`Attempting to add sticker ${item.stickerId}`, messageInfo);
                                    await message.reply(botResponse);
                                }
                                catch (error) {
                                    if (client.botConfigs.logs.stickers) {
                                        const logData = {
                                            'error': error,
                                            'more': {
                                                'messageLink': `https://discordapp.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`,
                                                'stickerId': item.stickerId,
                                            },
                                        };
                                        client.logger.error('Failed to add sticker', logData);
                                    }
                                }
                                break;
                            case 'text':
                                botResponse.content = client.botUtils.getRandomFromArray(item.responses);
                                await message.channel.sendTyping();
                                await delay(botResponse.content.length * 350);
                                client.logger.info(`Sendind text: ${botResponse.content}`, messageInfo);
                                await message.reply(botResponse);
                                break;
                            default:
                                for (const emoji of item.emojis) {
                                    await message.react(emoji);
                                    await delay(2000);
                                    reactionCounter++;
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
                    'error': error,
                    'more': {
                        'messageLink': `https://discordapp.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`,
                    },
                };
                client.logger.error('Failed to add reaction', logData);
            }
        }
    },
};
