import path from 'node:path';
import { exec } from 'node:child_process';

import {
    codeBlock,
    Collection,
    heading,
    HeadingLevel,
    inlineCode,
    SlashCommandBuilder,
    GuildBasedChannel,
    TextChannel,
    EmbedBuilder,
    Colors,
    bold,
} from 'discord.js';
import pm2 from 'pm2';

import { SlashCommand } from '../../Interfaces/Command';
import ExtendedClient from '../../Core/extendedClient';
import { getChannelById, getGuildById } from '../../Utils/discordUtilities';
import { delay } from '../../Utils/generalUtilities';
import { promisify } from 'node:util';

const Reload: SlashCommand = {
    category: 'Utilities',
    cooldown: 15,
    data: new SlashCommandBuilder()
        .setName('reload')
        .setDescription('Reloads bot data')
        .addSubcommand((subcommand) =>
            subcommand
                .setName('command')
                .setDescription('Reloads specific commands')
                .addStringOption((option) =>
                    option.setName('name').setDescription('Name for the command').setRequired(true)
                )
                .addStringOption((option) =>
                    option.setName('category').setDescription('The command category').setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('cooldowns')
                .setDescription('Reset cooldowns')
                .addStringOption((option) =>
                    option.setName('user_id').setDescription('Resets the cooldowns for a specific user')
                )
        )
        .addSubcommand((subcommand) => subcommand.setName('embeds').setDescription('Reloads embed data'))
        .addSubcommand((subcommand) => subcommand.setName('bot').setDescription('Restart the bot'))
        .addSubcommand((subcommand) =>
            subcommand.setName('repo').setDescription('Pulls the latest change from GitHub repo')
        ),
    async execute(interaction) {
        const client = interaction.client as ExtendedClient;
        const { botConfigs, logger } = client;

        const devServerGuild = await getGuildById(botConfigs.devServerId, client);

        let botDebugChannel: GuildBasedChannel | null = null;

        if (devServerGuild) {
            botDebugChannel = await getChannelById(botConfigs.debugChannelId, devServerGuild);
        }

        const baseDir = process.cwd();

        if (interaction.options.getSubcommand() === 'command') {
            const commandName = interaction.options.getString('name', true);
            const commandCategory = interaction.options.getString('category', true);

            const command = client.slashCommands.get(commandName);

            if (!command) {
                return interaction.reply(`There's no command with name ${inlineCode(commandName)}.`);
            }

            const commandPath = path.join(
                baseDir,
                'dist',
                'CommandsSlash',
                commandCategory,
                command.data.name + '.js'
            );

            delete require.cache[require.resolve(commandPath)];

            try {
                client.slashCommands.delete(command.data.name);

                // eslint-disable-next-line @typescript-eslint/no-require-imports
                const newCommand = require(commandPath);

                client.slashCommands.set(newCommand.default.data.name, newCommand);
                await interaction.reply(`Command ${inlineCode(newCommand.default.data.name)} was reloaded!`);
            } catch (error) {
                logger.error(error);
                await interaction.reply(
                    `There was an error while reloading a command ${inlineCode(command.data.name)}:\n${codeBlock('json', (error as Error).message)}`
                );
            }
        } else if (interaction.options.getSubcommand() === 'cooldowns') {
            const targetUserId = interaction.options.getString('user_id');

            const responseBuilder: string[] = [heading('Result', HeadingLevel.Three)];

            if (targetUserId) {
                client.cooldowns.reactions.delete(targetUserId);
                responseBuilder.push(`- Reaction cooldown reseted for ${targetUserId}`);

                client.cooldowns.slashCommands.delete(targetUserId);
                responseBuilder.push(`- Slash commands cooldown reseted for ${targetUserId}`);

                client.cooldowns.banana.delete(targetUserId);
                responseBuilder.push(`- Banan cooldown reseted for ${targetUserId}`);
            } else {
                client.cooldowns.reactions = new Collection();
                responseBuilder.push('- Reseted reaction cooldowns for every user');

                client.cooldowns.slashCommands = new Collection();
                responseBuilder.push('- Reseted slash commands cooldowns for every user');

                client.cooldowns.banan = new Collection();
                responseBuilder.push('- Reseted banan cooldowns for every user');
            }

            return await interaction.reply({ content: responseBuilder.join('\n'), ephemeral: true });
        } else if (interaction.options.getSubcommand() === 'embeds') {
            const embedsJsonPath = path.join(baseDir, 'JSON', 'embeds.json');
            delete require.cache[require.resolve(embedsJsonPath)];

            // eslint-disable-next-line @typescript-eslint/no-require-imports
            client.botData.embeds = require(embedsJsonPath);

            return await interaction.reply({ content: 'Embeds restored to default.', ephemeral: true });
        } else if (interaction.options.getSubcommand() === 'bot') {
            await interaction.deferReply();
            const botResponse = { content: 'Failed', ephemeral: true };

            try {
                await new Promise<void>((resolve, reject) => {
                    pm2.connect((err) => {
                        if (err) {
                            logger.error(err);
                            interaction.editReply(botResponse);
                            reject(err);
                        } else {
                            logger.info('Connected to PM2');
                            resolve();
                        }
                    });
                });

                botResponse.content = '🔃 Restarting bot...';
                interaction.editReply(botResponse);

                if (client.botConfigs.general.sendLogs && botDebugChannel) {
                    await (botDebugChannel as TextChannel).send(botResponse.content);
                }

                // close DB connection
                await client.knexInstance.destroy();
                await delay(2_000);

                await new Promise<void>((resolve, reject) => {
                    pm2.restart('automaze-bot', (error) => {
                        pm2.disconnect();
                        if (error) {
                            logger.error(error);
                            reject(error);
                        } else {
                            resolve();
                        }
                    });
                });
            } catch (error) {
                logger.error(error);
                await interaction.editReply(botResponse);
            }
        } else if (interaction.options.getSubcommand() === 'repo') {
            await interaction.deferReply();

            const responseEmbed = new EmbedBuilder()
                .setTitle('❌ Failed')
                .setColor(Colors.Red)
                .setDescription('Failed to update.');

            const execPromise = promisify(exec);

            try {
                const { stdout, stderr } = await execPromise('git pull origin main');
                responseEmbed
                    .setTitle('✅ Success')
                    .setColor(Colors.Green)
                    .setDescription(
                        [
                            `${bold('stdout:')} ${codeBlock('json', stdout)}`,
                            `${bold('stderr:')} ${codeBlock('json', stderr)}`,
                        ].join('\n')
                    );

                await interaction.editReply({ embeds: [responseEmbed] });

                if (client.botConfigs.general.sendLogs && botDebugChannel) {
                    await (botDebugChannel as TextChannel).send({ embeds: [responseEmbed] });
                }
            } catch (error) {
                logger.error(error);
                await interaction.editReply({ embeds: [responseEmbed] });
            }
        }
    },
};

export default Reload;
