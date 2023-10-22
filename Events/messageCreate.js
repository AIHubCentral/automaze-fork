module.exports = {
    name: "messageCreate",
    once: false,
    async run(client, message, _) {
        if (message.author.bot) return;

        // handle prefix commands first
        const prefix = client.prefix.ensure(message.guild.id, '-');

        if (message.content.startsWith(prefix)) {
            const args = message.content.slice(prefix.length).trim().split(/ +/);

            // Use the command alias if there's any, if there's none use the real command name instead
            const commandName = args.shift().toLowerCase();
            const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

            if (command) {
                command.run(client, message, args, prefix);
            }
        }
        else {
            const messageLowercase = message.content.toLowerCase();

            // triggered only if bot is mentioned
            if (message.content.includes('<@' + client.user.id + '>')) {
                const devServerGuildId = '1136971905354711193';

                const embedData = {
                    color: client.botConfigs.colors.theme.primary,
                    description: []
                };

                embedData.description.push('## Wassup I\'m Automaze!');
                embedData.description.push(`\n- My prefix in this server is \`${prefix}\` (customizable with \`${prefix}prefix\`)`);

                // only show how many guilds the bot is present if in the development server
                if (message.guild.id == devServerGuildId) {
                    embedData.description.push(`- Currently I'm present in ${client.guilds.cache.size} servers.`);
                }

                embedData.description.push('- Interested in how I\'m built? [I\'m actually open source!](https://github.com/DeprecatedTable/automaze)');
                embedData.description.push('- Feeling a tad bit generous? [Buy me a coffee!](https://ko-fi.com/fungusdesu)');

                const embed = client.botUtils.createEmbed(embedData);
                await message.reply({ embeds: [embed] });

                return;
            }

            // these are always triggered
            if (client.botConfigs.general.reactions) {
                if (messageLowercase.includes('antasma')) {
                    await message.react('🌟');
                }

                if (messageLowercase.includes('charlotte')) {
                    await message.react('🎸');
                }

                if (messageLowercase.includes('kalomazing')) {
                    await message.react('<:mrkrabs:1159761327632416818>');
                }

                if (messageLowercase.includes('zeero weeb')) {
                    await message.react('<:lfg:1159355870119993496>');
                }

                if (messageLowercase.includes('maki ligon')) {
                    await message.react('<:FL:1159653069743726664>');
                }

                if (messageLowercase.includes('lusbert ') && messageLowercase.includes('moment')) {
                    await message.react('<:lusbertmoment:1159804751924432906>');
                }

                if (messageLowercase.includes('litsa') && messageLowercase.includes('dancer')) {
                    await message.react('<:dog:1165681954524500078>');
                }

                if (messageLowercase.includes('cth') || messageLowercase.includes('yui')) {
                    await message.react('💻');
                }

                if (messageLowercase.includes(' a win')) {
                    await message.react('<:TextW:1159654826771230741>');
                }

                if (messageLowercase.includes(' a loose')) {
                    await message.react('<:TextL:1159654780445130944>');
                }
            }

            // verified chat only
            if (message.channel.id === client.discordIDs.Channel.Verified) {

                if (client.botConfigs.general.randomResponses) {
                    const random = client.botUtils.getRandomNumber(0, 1000);
                    if (random === 69) {
                        if (!messageLowercase.includes('?') && messageLowercase.length > 5) {
                            const responses = client.botResponses.responses.verifiedChat;
                            const selectedIndex = Math.floor(Math.random() * responses.length);
                            const botResponse = responses[selectedIndex];
                            await message.reply(botResponse);
                        }
                    }
                }
            }
        }
    }
}
