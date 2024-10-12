"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const discordUtilities_1 = require("../Utils/discordUtilities");
const nlpClassifier_1 = require("../Database/nlpClassifier");
const botUtilities_1 = require("../Utils/botUtilities");
const generalUtilities_1 = require("../Utils/generalUtilities");
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
        description: [],
    };
    embedData.description?.push(`\n- My prefix in this server is \`${prefix}\``);
    embedData.description?.push("- Interested in how I'm built? [I'm actually open source!](https://github.com/DeprecatedTable/automaze)");
    embedData.description?.push('- Forgot a specific command? Try `/help` or `-help`');
    const embed = (0, discordUtilities_1.createEmbed)(embedData);
    await message.reply({ embeds: [embed] });
    client.logger.info('Bot mentioned', {
        more: {
            guildId: message.guild?.id,
            channelId: message.channel.id,
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
        let response = null;
        switch (matchedKeyword) {
            case 'epoch':
            case 'epochs':
                response =
                    'Epoch is the number of iterations performed to complete one full cycle of the dataset during training. You can learn more about it in the [Applio Docs](https://docs.applio.org/faq)';
                break;
            case 'dataset':
            case 'datasets':
                response = `Datasets are a set of audio files compressed into a .zip file, used by RVC for voice training. You can learn more about it in the [Applio Docs](https://docs.applio.org/faq)`;
                break;
            case 'model':
            case 'models':
                response =
                    'A model is the result of training on a dataset. You can learn more about it in the [Applio Docs](https://docs.applio.org/faq)';
                break;
            case 'inference':
                response =
                    'Inference is the process where an audio is transformed by the voice model. You can learn more about it in the [Applio Docs](https://docs.applio.org/faq)';
                break;
            case 'overtraining':
                response =
                    'A solid way to detect overtraining is checking if the **TensorBoard** graph starts rising and never comes back down, leading to robotic, muffled output with poor articulation. You can learn more about it in the [Applio Docs](https://docs.applio.org/getting-started/tensorboard)';
                break;
        }
        if (response != null) {
            messageChannel.sendTyping();
            await (0, generalUtilities_1.delay)(50 * response.length);
            await message.reply({ content: response, allowedMentions: { repliedUser: true } });
            repliedUsers.set(userId, Date.now());
            logger.info('Sent FAQ reply', {
                guildId: messageChannel.guildId,
                channelId: messageChannel.id,
                keyword: matchedKeyword,
            });
        }
    }
}
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
                await message.reply('**Tip**: You can use the `-close` command to lock this post.');
            }
        }
    },
};
exports.default = messageCreateEvent;
