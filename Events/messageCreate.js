module.exports = {
    name: 'messageCreate',
    once: false,
    async run(client, message) {
        if (message.author.bot) return;

        // handle prefix commands first
        const prefix = client.prefix;

        if (message.content.startsWith(prefix)) {
            const args = message.content.slice(prefix.length).trim().split(/ +/);

            // Use the command alias if there's any, if there's none use the real command name instead
            const commandName = args.shift().toLowerCase();
            const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

            if (command) {
                client.logger.info(`Executing command (${commandName}) - guild:${message.guild.id};channel:${message.channel.id};type:prefix`);
                command.run(client, message, args, prefix);
            }
        }
        else {
            const messageLowercase = message.content.toLowerCase();

            // triggered only if bot is mentioned
            if (message.content.includes('<@' + client.user.id + '>')) {
                const devServerGuildId = '1136971905354711193';

                const embedData = {
                    title: 'Wassup I\'m Automaze!',
                    color: client.botConfigs.colors.theme.primary,
                    description: [],
                };

                embedData.description.push(`\n- My prefix in this server is \`${prefix}\` (customizable with \`${prefix}prefix\`)`);

                // only show how many guilds the bot is present if in the development server
                if (message.guild.id == devServerGuildId) {
                    embedData.description.push(`- Currently I'm present in ${client.guilds.cache.size} servers.`);
                }

                embedData.description.push('- Interested in how I\'m built? [I\'m actually open source!](https://github.com/DeprecatedTable/automaze)');
                // embedData.description.push('- Feeling a tad bit generous? [Buy me a coffee!](https://ko-fi.com/fungusdesu)');
                embedData.description.push('- Forgot a specific command? Try `/help` or `-help`');

                const embed = client.botUtils.createEmbed(embedData);
                await message.reply({ embeds: [embed] });

                client.logger.info('Bot mentioned', {
                    more: {
                        guildId: message.guild.id,
                        channelId: message.channel.id,
                    },
                });

                const isDebugGuildSetup = client.botConfigs.debugGuild.id && client.botConfigs.debugGuild.channelId;

                if (client.botConfigs.sendLogs && isDebugGuildSetup) {
                    const debugGuild = client.guilds.cache.get(client.botConfigs.debugGuild.id);
                    const debugChannel = debugGuild.channels.cache.get(client.botConfigs.debugGuild.channelId);
                    await debugChannel.send({ content: `Bot mentioned in channel ${message.channel.name} on guild ${message.guild.name}` });
                }

                return;
            }

            // triggered on comission channel
            if (message.channel.parentId == client.discordIDs.Forum.RequestModel.ID) {
                if (message.channel.ownerId === message.author.id && messageLowercase.includes('taken')) {
                    await message.reply('**Tip**: You can use the `-close` command to lock this post.');
                }
            }
        }
    },
};
