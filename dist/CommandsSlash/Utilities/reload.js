"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = __importDefault(require("node:path"));
const node_child_process_1 = require("node:child_process");
const discord_js_1 = require("discord.js");
const pm2_1 = __importDefault(require("pm2"));
const discordUtilities_1 = require("../../Utils/discordUtilities");
const generalUtilities_1 = require("../../Utils/generalUtilities");
const node_util_1 = require("node:util");
const Reload = {
    category: 'Utilities',
    cooldown: 15,
    data: new discord_js_1.SlashCommandBuilder()
        .setName('reload')
        .setDescription('Reloads bot data')
        .addSubcommand((subcommand) => subcommand
        .setName('command')
        .setDescription('Reloads specific commands')
        .addStringOption((option) => option.setName('name').setDescription('Name for the command').setRequired(true))
        .addStringOption((option) => option.setName('category').setDescription('The command category').setRequired(true)))
        .addSubcommand((subcommand) => subcommand
        .setName('cooldowns')
        .setDescription('Reset cooldowns')
        .addStringOption((option) => option.setName('user_id').setDescription('Resets the cooldowns for a specific user')))
        .addSubcommand((subcommand) => subcommand.setName('embeds').setDescription('Reloads embed data'))
        .addSubcommand((subcommand) => subcommand.setName('bot').setDescription('Restart the bot'))
        .addSubcommand((subcommand) => subcommand.setName('repo').setDescription('Pulls the latest change from GitHub repo')),
    async execute(interaction) {
        const client = interaction.client;
        const { botConfigs, logger } = client;
        const devServerGuild = await (0, discordUtilities_1.getGuildById)(botConfigs.devServerId, client);
        let botDebugChannel = null;
        if (devServerGuild) {
            botDebugChannel = await (0, discordUtilities_1.getChannelById)(botConfigs.debugChannelId, devServerGuild);
        }
        const baseDir = process.cwd();
        if (interaction.options.getSubcommand() === 'command') {
            const commandName = interaction.options.getString('name', true);
            const commandCategory = interaction.options.getString('category', true);
            const command = client.slashCommands.get(commandName);
            if (!command) {
                return interaction.reply(`There's no command with name ${(0, discord_js_1.inlineCode)(commandName)}.`);
            }
            const commandPath = node_path_1.default.join(baseDir, 'dist', 'CommandsSlash', commandCategory, command.data.name + '.js');
            delete require.cache[require.resolve(commandPath)];
            try {
                client.slashCommands.delete(command.data.name);
                // eslint-disable-next-line @typescript-eslint/no-require-imports
                const newCommand = require(commandPath);
                client.slashCommands.set(newCommand.default.data.name, newCommand);
                await interaction.reply(`Command ${(0, discord_js_1.inlineCode)(newCommand.default.data.name)} was reloaded!`);
            }
            catch (error) {
                logger.error(error);
                await interaction.reply(`There was an error while reloading a command ${(0, discord_js_1.inlineCode)(command.data.name)}:\n${(0, discord_js_1.codeBlock)('json', error.message)}`);
            }
        }
        else if (interaction.options.getSubcommand() === 'cooldowns') {
            const targetUserId = interaction.options.getString('user_id');
            const responseBuilder = [(0, discord_js_1.heading)('Result', discord_js_1.HeadingLevel.Three)];
            if (targetUserId) {
                client.cooldowns.reactions.delete(targetUserId);
                responseBuilder.push(`- Reaction cooldown reseted for ${targetUserId}`);
                client.cooldowns.slashCommands.delete(targetUserId);
                responseBuilder.push(`- Slash commands cooldown reseted for ${targetUserId}`);
                client.cooldowns.banana.delete(targetUserId);
                responseBuilder.push(`- Banan cooldown reseted for ${targetUserId}`);
            }
            else {
                client.cooldowns.reactions = new discord_js_1.Collection();
                responseBuilder.push('- Reseted reaction cooldowns for every user');
                client.cooldowns.slashCommands = new discord_js_1.Collection();
                responseBuilder.push('- Reseted slash commands cooldowns for every user');
                client.cooldowns.banan = new discord_js_1.Collection();
                responseBuilder.push('- Reseted banan cooldowns for every user');
            }
            return await interaction.reply({ content: responseBuilder.join('\n'), ephemeral: true });
        }
        else if (interaction.options.getSubcommand() === 'embeds') {
            const embedsJsonPath = node_path_1.default.join(baseDir, 'JSON', 'embeds.json');
            delete require.cache[require.resolve(embedsJsonPath)];
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            client.botData.embeds = require(embedsJsonPath);
            return await interaction.reply({ content: 'Embeds restored to default.', ephemeral: true });
        }
        else if (interaction.options.getSubcommand() === 'bot') {
            await interaction.deferReply();
            const botResponse = { content: 'Failed', ephemeral: true };
            try {
                await new Promise((resolve, reject) => {
                    pm2_1.default.connect((err) => {
                        if (err) {
                            logger.error(err);
                            interaction.editReply(botResponse);
                            reject(err);
                        }
                        else {
                            logger.info('Connected to PM2');
                            resolve();
                        }
                    });
                });
                botResponse.content = '🔃 Restarting bot...';
                interaction.editReply(botResponse);
                if (client.botConfigs.general.sendLogs && botDebugChannel) {
                    await botDebugChannel.send(botResponse.content);
                }
                // close DB connection
                await client.knexInstance.destroy();
                await (0, generalUtilities_1.delay)(2_000);
                await new Promise((resolve, reject) => {
                    logger.info('Restarting bot...');
                    pm2_1.default.restart('automaze-bot', (error) => {
                        pm2_1.default.disconnect();
                        if (error) {
                            logger.error(error);
                            reject(error);
                        }
                        else {
                            resolve();
                        }
                    });
                });
            }
            catch (error) {
                logger.error(error);
                await interaction.editReply(botResponse);
            }
        }
        else if (interaction.options.getSubcommand() === 'repo') {
            await interaction.deferReply();
            const responseEmbed = new discord_js_1.EmbedBuilder()
                .setTitle('❌ Failed')
                .setColor(discord_js_1.Colors.Red)
                .setDescription('Failed to update.');
            const execPromise = (0, node_util_1.promisify)(node_child_process_1.exec);
            try {
                const { stdout, stderr } = await execPromise('git pull origin main');
                responseEmbed
                    .setTitle('✅ Success')
                    .setColor(discord_js_1.Colors.Green)
                    .setDescription([
                    `${(0, discord_js_1.bold)('stdout:')} ${(0, discord_js_1.codeBlock)('json', stdout)}`,
                    `${(0, discord_js_1.bold)('stderr:')} ${(0, discord_js_1.codeBlock)('json', stderr)}`,
                ].join('\n'));
                await interaction.editReply({ embeds: [responseEmbed] });
                if (client.botConfigs.general.sendLogs && botDebugChannel) {
                    await botDebugChannel.send({ embeds: [responseEmbed] });
                }
            }
            catch (error) {
                logger.error(error);
                await interaction.editReply({ embeds: [responseEmbed] });
            }
        }
    },
};
exports.default = Reload;
