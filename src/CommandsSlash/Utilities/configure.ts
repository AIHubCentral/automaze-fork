import {
    SlashCommandBuilder,
    ActivityType,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    ActionRowBuilder,
    ComponentType,
    EmbedBuilder,
    heading,
    HeadingLevel,
    codeBlock,
    ChatInputCommandInteraction,
    PresenceStatusData,
    InteractionReplyOptions,
    inlineCode,
    unorderedList,
    Colors,
    userMention,
    bold,
} from 'discord.js';

import { delay } from '../../Utils/generalUtilities';
import { SlashCommand } from '../../Interfaces/Command';
import ExtendedClient from '../../Core/extendedClient';
import IBotConfigs from '../../Interfaces/BotConfigs';
import { getThemes } from '../../Utils/botUtilities';
import CollaboratorService, { ICollaborator } from '../../Services/collaboratorService';
import knexInstance from '../../db';

const Configure: SlashCommand = {
    category: 'Utilities',
    cooldown: 15,
    data: new SlashCommandBuilder()
        .setName('configure')
        .setDescription('Configure bot settings')
        .addSubcommand((subcommand) =>
            subcommand
                .setName('comission')
                .setDescription('Configure bot behavior in paid model requests')
                .addBooleanOption((option) =>
                    option
                        .setName('bot_responses')
                        .setDescription('Whether the bot should send messages')
                        .setRequired(true)
                )
                .addBooleanOption((option) =>
                    option
                        .setName('delete_messages')
                        .setDescription(
                            'Whether the bot should delete messages from users that doesnt have appropriate roles'
                        )
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) => subcommand.setName('theme').setDescription('Configure color theme'))
        .addSubcommand((subcommand) =>
            subcommand
                .setName('status')
                .setDescription('Configure bot status')
                .addStringOption((option) =>
                    option
                        .setName('statuses')
                        .setDescription('Choose a status')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Online', value: 'online' },
                            { name: 'Idle', value: 'idle' },
                            { name: 'Do Not Disturb', value: 'dnd' },
                            { name: 'Invisible', value: 'invisible' }
                        )
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('activity')
                .setDescription('Configure bot activity')
                .addStringOption((option) =>
                    option
                        .setName('activity_type')
                        .setDescription('Choose an activity')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Watching', value: 'watching' },
                            { name: 'Listening', value: 'listening' },
                            { name: 'Reset', value: 'reset' }
                        )
                )
                .addStringOption((option) =>
                    option.setName('activity_name').setDescription('Choose a name for the activity')
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('general')
                .setDescription('General bot configs')
                .addBooleanOption((option) =>
                    option.setName('bot_reactions').setDescription('Whether the bot should add reactions')
                )
                .addBooleanOption((option) =>
                    option
                        .setName('send_logs')
                        .setDescription('Whether the bot should send logs to development server')
                )
                .addBooleanOption((option) =>
                    option
                        .setName('automated_replies')
                        .setDescription('Whether the bot should send replies to detected questions')
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('cooldown_immune')
                .setDescription('Makes a user immune to cooldowns')
                .addStringOption((option) =>
                    option.setName('user_id').setDescription('The target user').setRequired(true)
                )
                .addBooleanOption((option) =>
                    option
                        .setName('immune')
                        .setDescription('Whether this user is immune to cooldowns')
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('automated_messages')
                .setDescription('Send automate messages')
                .addBooleanOption((option) =>
                    option
                        .setName('send_messages')
                        .setDescription('If the bot should send automated messages')
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('debug_guild')
                .setDescription('Guild to send debug logs')
                .addStringOption((option) => option.setName('guild_id').setDescription('The guild ID'))
                .addStringOption((option) =>
                    option.setName('channel_id').setDescription('Channel to send the logs')
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('logs')
                .setDescription('Configure logs')
                .addStringOption((option) =>
                    option
                        .setName('category')
                        .setDescription('Which log to configure')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Emojis', value: 'emojis' },
                            { name: 'Stickers', value: 'stickers' },
                            { name: 'Models', value: 'models' },
                            { name: 'ModelRequests', value: 'modelRequests' }
                        )
                )
                .addBooleanOption((option) =>
                    option.setName('enabled').setDescription('Enable or disable this log')
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('collaborators')
                .setDescription('Configure who can edit bot links')
                .addStringOption((option) =>
                    option
                        .setName('task')
                        .setDescription('Add or remove a collaborator')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Add', value: 'add' },
                            { name: 'Remove', value: 'remove' },
                            { name: 'List', value: 'showAll' }
                        )
                )
                .addStringOption((option) =>
                    option.setName('discord_id').setDescription('Discord ID of the user').setRequired(true)
                )
                .addStringOption((option) =>
                    option.setName('discord_username').setDescription('Discord username').setRequired(true)
                )
                .addStringOption((option) =>
                    option
                        .setName('discord_displayname')
                        .setDescription('Discord display name')
                        .setRequired(false)
                )
        ),
    async execute(interaction) {
        const client = interaction.client as ExtendedClient;
        const { botConfigs } = client;

        if (interaction.options.getSubcommand() === 'comission') {
            await configureCommision(interaction, botConfigs);
        } else if (interaction.options.getSubcommand() === 'theme') {
            await configureTheme(interaction, botConfigs);
        } else if (interaction.options.getSubcommand() === 'status') {
            await configureStatus(interaction);
        } else if (interaction.options.getSubcommand() === 'activity') {
            await configureActivity(interaction);
        } else if (interaction.options.getSubcommand() === 'general') {
            await configureGeneral(interaction);
        } else if (interaction.options.getSubcommand() === 'cooldown_immune') {
            await configureCooldownImmunity(interaction);
        } else if (interaction.options.getSubcommand() === 'automated_messages') {
            await configureAutomatedMessages(interaction);
        } else if (interaction.options.getSubcommand() === 'debug_guild') {
            await configureDebugGuild(interaction);
        } else if (interaction.options.getSubcommand() === 'logs') {
            await configureLogs(interaction);
        } else if (interaction.options.getSubcommand() === 'collaborators') {
            const service = new CollaboratorService(knexInstance);
            await configureCollaborators(interaction, service);
        }
    },
};

export default Configure;

async function configureCommision(
    interaction: ChatInputCommandInteraction,
    configs: IBotConfigs
): Promise<void> {
    const sendMessages = interaction.options.getBoolean('bot_responses') ?? false;
    const deleteMessages = interaction.options.getBoolean('delete_messages') ?? false;

    configs.commissions.sendMessages = sendMessages;
    configs.commissions.deleteMessages = deleteMessages;

    const responseLines = [
        heading('Bot Configured', HeadingLevel.Three),
        codeBlock('js', JSON.stringify({ sendMessages, deleteMessages }, null, 4)),
    ];

    await interaction.reply({ content: responseLines.join('\n'), ephemeral: true });
}

async function configureTheme(interaction: ChatInputCommandInteraction, configs: IBotConfigs): Promise<void> {
    const themeOptions = [
        {
            label: 'Default',
            description: 'Default theme',
            value: 'defaultTheme',
            emoji: '📁',
        },
        {
            label: 'Christmas',
            description: 'Christmas theme',
            value: 'xmasTheme',
            emoji: '🎄',
        },
    ];

    const selectMenu = new StringSelectMenuBuilder()
        .setCustomId(interaction.id)
        .setPlaceholder('Select the desired theme')
        .addOptions(
            themeOptions.map((theme) =>
                new StringSelectMenuOptionBuilder()
                    .setLabel(theme.label)
                    .setDescription(theme.description)
                    .setValue(theme.value)
                    .setEmoji(theme.emoji)
            )
        );

    const actionRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu);

    const botReply = await interaction.reply({ components: [actionRow] });

    const collector = botReply.createMessageComponentCollector({
        componentType: ComponentType.StringSelect,
        filter: (i) => i.user.id === interaction.user.id && i.customId === interaction.id,
        time: 60_000,
    });

    collector.on('collect', (i) => {
        const themeName = i.values[0];
        const themes = getThemes();
        configs.colors.theme = themes[themeName];
        i.reply(`Theme changed to ** ${themeName}**.`);
    });

    collector.on('end', async () => {
        await botReply.delete();
    });
}

async function configureStatus(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.deferReply({ ephemeral: true });
    const selectedStatus = interaction.options.getString('statuses') ?? 'online';
    interaction.client.user.setStatus(selectedStatus as PresenceStatusData);
    await delay(5000);
    await interaction.editReply({ content: `Status: ${selectedStatus} ` });
}

async function configureActivity(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.deferReply({ ephemeral: true });
    const activityTypeInput: string | null = interaction.options.getString('activity_type');
    const activityName: string = interaction.options.getString('activity_name') ?? 'AI HUB';

    let activityType: ActivityType | undefined = undefined;

    if (activityTypeInput === 'reset') {
        interaction.client.user.setPresence({});
        await delay(3000);
        await interaction.editReply({ content: 'Activity reseted' });
    } else {
        switch (activityTypeInput) {
            case 'watching':
                activityType = ActivityType.Watching;
                break;
            case 'listening':
                activityType = ActivityType.Listening;
                break;
        }
        interaction.client.user.setActivity({
            name: activityName,
            type: activityType,
        });
        await delay(3000);
        await interaction.editReply({ content: 'Activity updated!' });
    }
}

async function configureGeneral(interaction: ChatInputCommandInteraction): Promise<void> {
    const botReactions = interaction.options.getBoolean('bot_reactions');
    const sendLogs = interaction.options.getBoolean('send_logs');
    const automatedReplies = interaction.options.getBoolean('automated_replies');

    const client = interaction.client as ExtendedClient;

    if (botReactions != null) {
        client.botConfigs.general.reactions = botReactions;
    }

    if (sendLogs != null) {
        client.botConfigs.general.sendLogs = sendLogs;
    }

    if (automatedReplies != null) {
        client.botConfigs.general.automatedReplies = automatedReplies;
    }

    const responseListing = unorderedList([
        `Reactions: ${inlineCode(String(client.botConfigs.general.reactions))}`,
        `Send logs: ${inlineCode(String(client.botConfigs.general.sendLogs))}`,
        `Automated replies: ${inlineCode(String(client.botConfigs.general.automatedReplies))}`,
    ]);

    const embed = new EmbedBuilder()
        .setTitle('General configs')
        .setDescription(responseListing)
        .setColor(Colors.Aqua)
        .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
}

async function configureCooldownImmunity(interaction: ChatInputCommandInteraction): Promise<void> {
    const userId = interaction.options.getString('user_id');
    if (!userId) return;

    const cooldownImmunity = interaction.options.getBoolean('immune') ?? false;

    const client = interaction.client as ExtendedClient;

    if (cooldownImmunity) {
        client.botData.cooldownImmuneUsers.set(userId, cooldownImmunity);
        client.cooldowns.reactions.delete(userId);
        client.cooldowns.banana.delete(userId);
        client.cooldowns.slashCommands.delete(userId);
    } else {
        client.botData.cooldownImmuneUsers.delete(userId);
    }

    const embed = new EmbedBuilder()
        .setTitle('Cooldown Immunity')
        .setDescription(
            unorderedList([
                `User: ${userMention(userId)}`,
                `Immunity: ${inlineCode(String(cooldownImmunity))}`,
            ])
        )
        .setColor(Colors.DarkAqua);

    await interaction.reply({ embeds: [embed], ephemeral: true });
}

async function configureAutomatedMessages(interaction: ChatInputCommandInteraction): Promise<void> {
    //const sendMessages = interaction.options.getBoolean('send_messages') ?? false;
    const botResponse: InteractionReplyOptions = { ephemeral: true };
    //const client = interaction.client as ExtendedClient;

    /* if (sendMessages) {
        if (client.scheduler.isRunning) {
            botResponse.content = 'Scheduler is already running.';
        } else {
            botResponse.content = 'Scheduler started.';
            client.scheduler.start();
        }
    } else {
        botResponse.content = 'Scheduler stopped.';
        client.scheduler.stop();
    } */

    botResponse.content = 'Unavailable';

    await interaction.reply(botResponse);
}

async function configureDebugGuild(interaction: ChatInputCommandInteraction): Promise<void> {
    const guildId = interaction.options.getString('guild_id');
    const channelId = interaction.options.getString('channel_id');

    const client = interaction.client as ExtendedClient;
    client.botConfigs.debugGuild.id = guildId ?? '';
    client.botConfigs.debugGuild.channelId = channelId ?? '';

    const embed = new EmbedBuilder()
        .setTitle('Debug Guild')
        .setColor(Colors.DarkBlue)
        .setDescription(
            unorderedList([
                `${bold('Guild ID')}: ${inlineCode(client.botConfigs.debugGuild.id)}`,
                `${bold('Channel ID')}: ${inlineCode(client.botConfigs.debugGuild.channelId)}`,
            ])
        );

    await interaction.reply({ embeds: [embed] });
}

async function configureLogs(interaction: ChatInputCommandInteraction): Promise<void> {
    const logsCategory = interaction.options.getString('category');
    const logEnabled = interaction.options.getBoolean('enabled');

    const client = interaction.client as ExtendedClient;

    if (logEnabled != null) {
        client.botConfigs.logs[logsCategory!] = logEnabled;
    }

    const embedDescription = [];

    for (const key in client.botConfigs.logs) {
        embedDescription.push(`- ${key}: \`${client.botConfigs.logs[key]}\``);
    }

    const embed = new EmbedBuilder()
        .setTitle('Logs configuration')
        .setDescription(embedDescription.join('\n'))
        .setColor(Colors.DarkButNotBlack);

    await interaction.reply({
        embeds: [embed],
        ephemeral: true,
    });
}

async function configureCollaborators(
    interaction: ChatInputCommandInteraction,
    service: CollaboratorService
): Promise<void> {
    const taskName = interaction.options.getString('task', true);
    const userDiscordId = interaction.options.getString('discord_id', true);
    const username = interaction.options.getString('discord_username', true);
    const displayName = interaction.options.getString('discord_displayname') ?? '';

    const embedColor = taskName === 'remove' ? Colors.DarkOrange : Colors.DarkGreen;

    const embed = new EmbedBuilder().setTitle('Collaborators').setColor(embedColor);

    const collaborator: ICollaborator = {
        id: userDiscordId,
        username,
        displayName,
    };

    if (taskName === 'add') {
        const id = await service.create(collaborator);

        if (id === -1) {
            embed.setDescription('Failed to insert collaborator');
            embed.setColor(Colors.Red);
        } else {
            embed.setDescription(`Added collaborator with id: ${id}`);
        }
    } else if (taskName === 'remove') {
        const fetchedCollaborator = await service.find(collaborator.id);

        if (!fetchedCollaborator) {
            await interaction.reply({
                content: `Couldn't find collaborator with ID ${collaborator.id}`,
                ephemeral: true,
            });
            return;
        }

        const affectedRows = await service.delete(collaborator.id);

        if (affectedRows === 1) {
            embed.setTitle('🗑 Removed collaborator');
            embed.setColor(Colors.Green);

            const descriptionLines = [
                `${bold('ID')} ${inlineCode(fetchedCollaborator.id)}`,
                `${bold('username')} ${inlineCode(fetchedCollaborator.username)}`,
            ];

            if (fetchedCollaborator.displayName) {
                descriptionLines.push(`${bold('display')} ${inlineCode(fetchedCollaborator.displayName)}`);
            }

            embed.setDescription(unorderedList(descriptionLines));
        } else {
            embed.setDescription(`Failed to remove collaborator with id: ${collaborator.id}`);
            embed.setColor(Colors.Red);
        }
    } else {
        const result = await service.findAll();

        if (result.data.length === 0) {
            embed.setDescription('> No collaborator found');
            embed.setColor(Colors.Orange);
        } else {
            const descriptionLines: string[] = [];

            result.data.forEach((collaborator) => {
                descriptionLines.push(
                    `${inlineCode(collaborator.id)}: ${collaborator.username} (${collaborator.displayName || 'No display name'})`
                );
            });
            embed.setDescription(unorderedList(descriptionLines));
        }
    }

    await interaction.reply({ embeds: [embed] });
}
