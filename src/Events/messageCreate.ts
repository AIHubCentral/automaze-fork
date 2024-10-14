import {
    bold,
    channelMention,
    ChannelType,
    Collection,
    Colors,
    EmbedBuilder,
    inlineCode,
    Message,
    PublicThreadChannel,
    TextChannel,
} from 'discord.js';
import IEventData from '../Interfaces/Events';
import ExtendedClient from '../Core/extendedClient';
import { EmbedData } from '../Interfaces/BotData';
import { createEmbed, getDisplayName } from '../Utils/discordUtilities';
import { tokenizer } from '../Database/nlpClassifier';
import {
    containsKeyword,
    containsQuestionPattern,
    getFaqKeywords,
    isAskingForAssistance,
} from '../Utils/botUtilities';
import { delay } from '../Utils/generalUtilities';
import winston from 'winston';

function handlePrefixCommand(prefix: string, message: Message, client: ExtendedClient): void {
    const commandArguments = message.content.slice(prefix.length).trim().split(/ +/);

    const commandName = commandArguments.shift()?.toLowerCase();
    if (!commandName) return;

    client.logger.debug('prefix command', {
        input: `${prefix}${commandName}`,
        args: commandArguments,
    });

    // Use the command alias if there's any, if there's none use the real command name instead
    const command =
        client.commands.get(commandName) ||
        client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));
    if (!command) return;

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

async function handleBotMentioned(prefix: string, message: Message, client: ExtendedClient): Promise<void> {
    const mention: string = '<@' + client.user?.id + '>';
    if (!message.content.includes(mention)) return;

    const embedData: EmbedData = {
        title: "Wassup I'm Automaze!",
        color: client.botConfigs.colors.theme.primary,
        description: [],
    };

    embedData.description?.push(`\n- My prefix in this server is \`${prefix}\``);
    embedData.description?.push(
        "- Interested in how I'm built? [I'm actually open source!](https://github.com/DeprecatedTable/automaze)"
    );
    embedData.description?.push('- Forgot a specific command? Try `/help` or `-help`');

    const embed = createEmbed(embedData);
    await message.reply({ embeds: [embed] });

    client.logger.info('Bot mentioned', {
        more: {
            guildId: message.guild?.id,
            channelId: message.channel.id,
        },
    });
}

async function handleFaqQuestions(
    userId: string,
    message: Message,
    repliedUsers: Collection<string, number>,
    logger: winston.Logger
): Promise<void> {
    const userInput = message.content.toLowerCase().trim();
    const tokens = tokenizer.tokenize(userInput);
    const keywords = getFaqKeywords();

    const matchedKeyword = containsKeyword(tokens, keywords);

    if (matchedKeyword && containsQuestionPattern(userInput)) {
        // check if already replied to user
        if (repliedUsers.has(userId)) return;

        const messageChannel = message.channel as TextChannel;
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
            await delay(50 * response.length);
            await message.reply({ content: response, allowedMentions: { repliedUser: true } });

            repliedUsers.set(userId, Date.now());

            logger.info('Sent FAQ reply', {
                guildId: messageChannel.guildId,
                channelId: messageChannel.id,
                channelName: messageChannel.name,
                keyword: matchedKeyword,
            });
        }
    }
}

const messageCreateEvent: IEventData = {
    name: 'messageCreate',
    once: false,
    async run(client, message: Message) {
        if (message.author.bot) return;

        // handle prefix commands first
        const prefix = client.prefix;

        if (message.content.startsWith(prefix)) {
            handlePrefixCommand(prefix, message, client);
        } else {
            await handleBotMentioned(prefix, message, client);

            // tries to answer FAQs
            if (client.botConfigs.general.automatedReplies) {
                handleFaqQuestions(message.author.id, message, client.repliedUsers, client.logger);

                // send !howtoask if user is asking for assistance
                const helpChannels: string[] = [
                    client.discordIDs.Channel.HelpRVC,
                    client.discordIDs.Channel.HelpWOkada,
                    client.discordIDs.Channel.HelpAiArt,
                    client.discordIDs.Channel.Verified,
                ];

                if (
                    helpChannels.includes(message.channelId) &&
                    isAskingForAssistance(message.content.toLowerCase()) &&
                    message.attachments.size === 0
                ) {
                    const startTime = Date.now();

                    // check if already replied to user
                    if (client.repliedUsers.has(message.author.id)) return;

                    const currentChannel = message.channel as TextChannel;
                    const displayName = await getDisplayName(message.author, message.guild);

                    await currentChannel.sendTyping();
                    await delay(2_000);

                    const embed = new EmbedBuilder()
                        .setColor(Colors.White)
                        .setDescription(
                            [
                                `Hey, **${displayName}**! Please use the command ${inlineCode('!howtoask')} to increase your chance of getting help by structuring your question in a way others can understand better. Also make sure you're asking in the right help channel:`,
                                `- ${bold('General RVC help')}: ${channelMention(client.discordIDs.Channel.HelpRVC)}`,
                                `- ${bold('W-Okada / Realtime RVC')}: ${channelMention(client.discordIDs.Channel.HelpWOkada)}`,
                                `- ${bold('AI image related')}: ${channelMention(client.discordIDs.Channel.HelpAiArt)}`,
                            ].join('\n')
                        );

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
            if (message.channel.type !== ChannelType.PublicThread) return;

            const messageChannel = <PublicThreadChannel>message.channel;

            if (messageChannel.parentId != client.discordIDs.Forum.RequestModel.ID) return;
            if (messageChannel.ownerId !== message.author.id) return;

            const messageLowercase = message.content.toLowerCase();

            if (messageLowercase.includes('taken')) {
                await message.reply('**Tip**: You can use the `-close` command to lock this post.');
            }
        }
    },
};

export default messageCreateEvent;
