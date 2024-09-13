"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const discordUtilities_1 = require("../Utils/discordUtilities");
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
    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if (!command)
        return;
    client.logger.info('Executing prefix command', {
        more: {
            commandName: commandName,
            guildId: message.guild?.id,
            channelId: message.channel.id,
            type: 'prefix',
        }
    });
    command.run(client, message, commandArguments, prefix);
}
async function handleBotMentioned(prefix, message, client) {
    const mention = '<@' + client.user?.id + '>';
    if (!message.content.includes(mention))
        return;
    const embedData = {
        title: 'Wassup I\'m Automaze!',
        color: client.botConfigs.colors.theme.primary,
        description: [],
    };
    embedData.description?.push(`\n- My prefix in this server is \`${prefix}\``);
    embedData.description?.push('- Interested in how I\'m built? [I\'m actually open source!](https://github.com/DeprecatedTable/automaze)');
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
