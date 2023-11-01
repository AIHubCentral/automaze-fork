const { SlashCommandBuilder, ActivityType, Collection } = require('discord.js');
const { exec } = require('node:child_process');
const path = require('node:path');
const delay = require('node:timers/promises').setTimeout;
const pm2 = require('pm2');

module.exports = {
    category: `Utilities`,
    cooldown: 30,
    type: `slash`,
    data: new SlashCommandBuilder()
        .setName('reload')
        .setDescription('Reloads bot data')
        .addSubcommand(subcommand =>
            subcommand
                .setName('command')
                .setDescription('Reloads specific commands')
                .addStringOption(option =>
                    option
                        .setName('name')
                        .setDescription('Name for the command')
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option
                        .setName('category')
                        .setDescription('The command category')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('cooldowns')
                .setDescription('Reset cooldowns')
                .addStringOption(option =>
                    option
                        .setName('user_id')
                        .setDescription('Resets the cooldowns for a specific user')
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('embeds')
                .setDescription('Reloads embed data')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('bot')
                .setDescription('Restart the bot')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('repo')
                .setDescription('Pulls the latest change from GitHub repo')
        )
    ,
    async execute(interaction) {
        const { client } = interaction;
        const { botConfigs } = client;

        const devServerGuild = client.guilds.cache.get(botConfigs.devServerId);
        const botDebugChannel = devServerGuild.channels.cache.get(botConfigs.debugChannelId);

        const baseDir = process.cwd();

        if (interaction.options.getSubcommand() === 'command') {
            let commandName = interaction.options.getString('name');
            const commandCategory = interaction.options.getString('category');

            const command = interaction.client.slashCommands.get(commandName);

            if (!command) {
                return interaction.reply(`There's no command with name \`${commandName}\`.`);
            }

            const commandPath = path.join(baseDir, 'CommandsSlash', commandCategory, command.data.name + '.js');

            delete require.cache[require.resolve(commandPath)];

            try {
                interaction.client.slashCommands.delete(command.data.name);
                const newCommand = require(commandPath);
                interaction.client.slashCommands.set(newCommand.data.name, newCommand);
                await interaction.reply(`Command \`${newCommand.data.name}\` was reloaded!`);
            } catch (error) {
                console.error(error);
                await interaction.reply(`There was an error while reloading a command \`${command.data.name}\`:\n\`${error.message}\``);
            }
        }
        else if (interaction.options.getSubcommand() === 'cooldowns') {
            const targetUserId = interaction.options.getString('user_id');
            const botResponse = { content: ['### Result'], ephemeral: true };
            if (targetUserId) {
                client.cooldowns.reactions.delete(targetUserId);
                botResponse.content.push(`- Reaction cooldown reseted for ${targetUserId}`);

                client.cooldowns.slashCommands.delete(targetUserId);
                botResponse.content.push(`- Slash commands cooldown reseted for ${targetUserId}`);

                client.cooldowns.banana.delete(targetUserId);
                botResponse.content.push(`- Banan cooldown reseted for ${targetUserId}`);
            } else {
                client.cooldowns.reactions = new Collection();
                botResponse.content.push('- Reseted reaction cooldowns for every user');

                client.cooldowns.slashCommands = new Collection();
                botResponse.content.push('- Reseted slash commands cooldowns for every user');

                client.cooldowns.banan = new Collection();
                botResponse.content.push('- Reseted banan cooldowns for every user');
            }
            botResponse.content = botResponse.content.join('\n');
            return await interaction.reply(botResponse);
        }
        else if (interaction.options.getSubcommand() === 'embeds') {
            const embedsJsonPath = path.join(baseDir, 'JSON', 'embeds.json');
            delete require.cache[require.resolve(embedsJsonPath)];
            client.botData.embeds = require(embedsJsonPath);
            return await interaction.reply({ content: 'Embeds restored to default.', ephemeral: true });
        }
        else if (interaction.options.getSubcommand() === 'bot') {
            await interaction.deferReply();
            const botResponse = { content: 'Failed', ephemeral: true };

            pm2.connect(async function (err) {
                if (err) {
                    console.error(err);
                    interaction.editReply(botResponse);
                    process.exit(2);
                }
                botResponse.content = '🔃 Restarting bot...';
                interaction.editReply(botResponse);

                if (client.botConfigs.general.sendLogs) {
                    await botDebugChannel.send(botResponse.content);
                }

                // close DB connection
                await client.knexInstance.destroy();
                await delay(2000);

                pm2.restart('Automaze', (error, apps) => {
                    pm2.disconnect();
                    if (error) { throw error }
                });
            });
        }
        else if (interaction.options.getSubcommand() === 'repo') {
            await interaction.deferReply();
            const botResponse = { content: 'Failed', ephemeral: true };

            exec('git pull origin main', async (error, stdout, stderr) => {
                if (error) {
                    botResponse.content = err;
                    await interaction.editReply(botResponse);
                    return;
                }

                console.log('stdout:', stdout);
                console.log('sterr:', stderr);
                botResponse.content = '✅ Bot updated!';
                interaction.editReply(botResponse);

                if (client.botConfigs.general.sendLogs) {
                    await botDebugChannel.send(botResponse.content);
                }
            });
        }
    }
}
