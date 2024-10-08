import { ChannelType, Message, PublicThreadChannel, TextChannel, ThreadChannel } from 'discord.js';
import IEventData from '../Interfaces/Events';
import ExtendedClient from '../Core/extendedClient';
import { EmbedData } from '../Interfaces/BotData';
import { createEmbed } from '../Utils/discordUtilities';

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
