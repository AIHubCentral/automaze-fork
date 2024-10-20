"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const discordUtilities_1 = require("../Utils/discordUtilities");
const nlpClassifier_1 = require("../Database/nlpClassifier");
const botUtilities_1 = require("../Utils/botUtilities");
const generalUtilities_1 = require("../Utils/generalUtilities");
const i18n_1 = __importDefault(require("../i18n"));
const natural_1 = __importDefault(require("natural"));
const stemmer = natural_1.default.PorterStemmer;
const messageCreateEvent = {
    name: 'messageCreate',
    once: false,
    async run(client, message) {
        if (message.author.bot)
            return;
        // handle prefix commands first
        const prefix = client.prefix;
        if (message.content.startsWith(prefix)) {
            handlePrefixCommand(prefix, message, client);
        }
        else {
            await handleBotMentioned(prefix, message, client);
            // tries to answer FAQs
            if (client.botConfigs.general.automatedReplies) {
                handleFaqQuestions(message.author.id, message, client.repliedUsers, client.logger);
                // send !howtoask if user is asking for assistance
                const helpChannels = [
                    client.discordIDs.Channel.HelpRVC,
                    client.discordIDs.Channel.HelpWOkada,
                    client.discordIDs.Channel.HelpAiArt,
                    client.discordIDs.Channel.Verified,
                ];
                if (helpChannels.includes(message.channelId) &&
                    (0, botUtilities_1.isAskingForAssistance)(message.content.toLowerCase()) &&
                    message.attachments.size === 0) {
                    const startTime = Date.now();
                    // check if already replied to user
                    if (client.repliedUsers.has(message.author.id))
                        return;
                    const currentChannel = message.channel;
                    const displayName = await (0, discordUtilities_1.getDisplayName)(message.author, message.guild);
                    await currentChannel.sendTyping();
                    await (0, generalUtilities_1.delay)(2_000);
                    const embed = new discord_js_1.EmbedBuilder()
                        .setColor(discord_js_1.Colors.White)
                        .setDescription([
                        `Hey, **${displayName}**! Please use the command ${(0, discord_js_1.inlineCode)('!howtoask')} to increase your chance of getting help by structuring your question in a way others can understand better. Also make sure you're asking in the right help channel:`,
                        `- ${(0, discord_js_1.bold)('General RVC help')}: ${(0, discord_js_1.channelMention)(client.discordIDs.Channel.HelpRVC)}`,
                        `- ${(0, discord_js_1.bold)('W-Okada / Realtime RVC')}: ${(0, discord_js_1.channelMention)(client.discordIDs.Channel.HelpWOkada)}`,
                        `- ${(0, discord_js_1.bold)('AI image related')}: ${(0, discord_js_1.channelMention)(client.discordIDs.Channel.HelpAiArt)}`,
                    ].join('\n'));
                    await message.reply({
                        embeds: [embed],
                        allowedMentions: { repliedUser: true },
                    });
                    client.repliedUsers.set(message.author.id, Date.now());
                    client.logger.info('Sent !howtoask reply', {
                        guildId: currentChannel.guildId,
                        channelId: currentChannel.id,
                        channelName: currentChannel.name,
                        keyword: message.content,
                        executionTime: (Date.now() - startTime) / 1_000,
                    });
                }
            }
            // triggered on comission channel
            if (message.channel.type !== discord_js_1.ChannelType.PublicThread)
                return;
            const messageChannel = message.channel;
            if (messageChannel.parentId != client.discordIDs.Forum.RequestModel.ID)
                return;
            if (messageChannel.ownerId !== message.author.id)
                return;
            const messageLowercase = message.content.toLowerCase();
            if (messageLowercase.includes('taken')) {
                await message.reply('**Tip**: You can use the `/close` command to lock this post.');
            }
        }
    },
};
exports.default = messageCreateEvent;
// helper methods
function handlePrefixCommand(prefix, message, client) {
    const commandArguments = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = commandArguments.shift()?.toLowerCase();
    if (!commandName)
        return;
    client.logger.debug('prefix command', {
        input: `${prefix}${commandName}`,
        args: commandArguments,
    });
    // Use the command alias if there's any, if there's none use the real command name instead
    const command = client.commands.get(commandName) ||
        client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));
    if (!command)
        return;
    client.logger.info('Executing prefix command', {
        more: {
            commandName: commandName,
            guildId: message.guild?.id,
            channelId: message.channel.id,
            type: 'prefix',
        },
    });
    command.run(client, message, commandArguments, prefix);
}
async function handleBotMentioned(prefix, message, client) {
    const mention = '<@' + client.user?.id + '>';
    if (!message.content.includes(mention))
        return;
    const embedData = {
        title: "Wassup I'm Automaze!",
        color: client.botConfigs.colors.theme.primary,
        description: [
            `\n➡ My prefix in this server is ${(0, discord_js_1.inlineCode)(prefix)}`,
            `➡ Forgot a specific command? Use ${(0, discord_js_1.inlineCode)('/help')}`,
        ],
    };
    // legacy repo https://github.com/DeprecatedTable/automaze
    const currentChannel = message.channel;
    await currentChannel.sendTyping();
    await (0, generalUtilities_1.delay)(2_000);
    await message.reply({ embeds: [(0, discordUtilities_1.createEmbed)(embedData)], allowedMentions: { repliedUser: true } });
    client.logger.info('Bot mentioned', {
        more: {
            guildId: message.guild?.id,
            channelId: currentChannel.id,
            channelName: currentChannel.name,
        },
    });
}
async function handleFaqQuestions(userId, message, repliedUsers, logger) {
    const userInput = message.content.toLowerCase().trim();
    const tokens = nlpClassifier_1.tokenizer.tokenize(userInput);
    const keywords = (0, botUtilities_1.getFaqKeywords)();
    const matchedKeyword = (0, botUtilities_1.containsKeyword)(tokens, keywords);
    if (matchedKeyword && (0, botUtilities_1.containsQuestionPattern)(userInput)) {
        // check if already replied to user
        if (repliedUsers.has(userId))
            return;
        const messageChannel = message.channel;
        const stemmedKeyword = stemmer.stem(matchedKeyword);
        console.log(stemmedKeyword);
        const responseData = i18n_1.default.t(`faq.topics.${stemmedKeyword}`, {
            returnObjects: true,
        });
        const processedTranslation = (0, generalUtilities_1.processTranslation)(responseData);
        const embed = new discord_js_1.EmbedBuilder().setColor(discord_js_1.Colors.LightGrey);
        if (typeof processedTranslation === 'string') {
            embed.setDescription(processedTranslation);
        }
        else {
            if (processedTranslation.title) {
                embed.setTitle(processedTranslation.title);
            }
            if (processedTranslation.description) {
                embed.setDescription(processedTranslation.description.join('\n'));
            }
            if (processedTranslation.footer) {
                embed.setFooter({ text: processedTranslation.footer });
            }
        }
        await messageChannel.sendTyping();
        await (0, generalUtilities_1.delay)(3_000);
        await message.reply({ embeds: [embed], allowedMentions: { repliedUser: true } });
        repliedUsers.set(userId, Date.now());
        logger.info('Sent FAQ reply', {
            guildId: messageChannel.guildId,
            channelId: messageChannel.id,
            channelName: messageChannel.name,
            keyword: matchedKeyword,
        });
    }
}
