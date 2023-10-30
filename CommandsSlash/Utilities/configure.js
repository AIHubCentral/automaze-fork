const { SlashCommandBuilder, ActivityType } = require('discord.js');
const delay = require('node:timers/promises').setTimeout;

module.exports = {
    category: `Utilities`,
    cooldown: 30,
    type: `slash`,
    data: new SlashCommandBuilder()
        .setName('configure')
        .setDescription('Configure bot settings')
        .addSubcommand(subcommand =>
            subcommand
                .setName('comission')
                .setDescription('Configure bot behavior in paid model requests')
                .addBooleanOption(option =>
                    option
                        .setName('bot_responses')
                        .setDescription('Whether the bot should send messages')
                        .setRequired(true)
                )
                .addBooleanOption(option =>
                    option
                        .setName('delete_messages')
                        .setDescription('Whether the bot should delete messages from users that doesnt have appropriate roles')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('colors')
                .setDescription('Configure color theme')
                .addStringOption(option =>
                    option
                        .setName('primary')
                        .setDescription('Primary color')
                )
                .addStringOption(option =>
                    option
                        .setName('secondary')
                        .setDescription('Secondary color')
                )
                .addStringOption(option =>
                    option
                        .setName('tertiary')
                        .setDescription('Tertiary color')
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('status')
                .setDescription('Configure bot status')
                .addStringOption(option =>
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
        .addSubcommand(subcommand =>
            subcommand
                .setName('activity')
                .setDescription('Configure bot activity')
                .addStringOption(option =>
                    option
                        .setName('activity_type')
                        .setDescription('Choose an activity')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Watching', value: 'watching' },
                            { name: 'Listening', value: 'listening' },
                            { name: 'Reset', value: 'reset'}
                        )
                )
                .addStringOption(option =>
                    option
                        .setName('activity_name')
                        .setDescription('Choose a name for the activity')
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('general')
                .setDescription('General bot configs')
                .addBooleanOption(option =>
                    option
                        .setName('bot_reactions')
                        .setDescription('Whether the bot should add reactions')
                )
                .addBooleanOption(option =>
                    option
                        .setName('send_logs')
                        .setDescription('Whether the bot should send logs to development server')
                )
        ),
    async execute(interaction) {
        const client = interaction.client;

        if (interaction.options.getSubcommand() === 'comission') {
            const sendMessages = interaction.options.getBoolean('bot_responses');
            const deleteMessages = interaction.options.getBoolean('delete_messages');

            client.botConfigs.commissions.sendMessages = sendMessages;
            client.botConfigs.commissions.deleteMessages = deleteMessages;

            await interaction.reply({ content: `Bot configured:\n- sendMessages: **${sendMessages}**\n- deleteMessages: **${deleteMessages}**`, ephemeral: true});
        }
        else if (interaction.options.getSubcommand() === 'colors') {
            const primaryColor = interaction.options.getString('primary');
            const secondaryColor = interaction.options.getString('secondary');
            const tertiaryColor = interaction.options.getString('tertiary');

            let output = [];
            let botResponse = 'No color was updated.';

            if (primaryColor) {
                client.botConfigs.colors.theme.primary = primaryColor;
                output.push(`- Primary color: ${primaryColor}`);
            }

            if (secondaryColor) {
                client.botConfigs.colors.theme.secondary = secondaryColor;
                output.push(`- Secondary color: ${secondaryColor}`);
            }

            if (tertiaryColor) {
                client.botConfigs.colors.theme.tertiary = tertiaryColor;
                output.push(`- Tertiary color: ${tertiaryColor}`);
            }

            if (output.length > 0) {
                botResponse = 'Colors updated:\n' + output.join('\n');
            }

            await interaction.reply({ content: botResponse, ephemeral: true });
        }
        else if (interaction.options.getSubcommand() === 'status') {
            await interaction.deferReply({ ephemeral: true });
            const selectedStatus = interaction.options.getString('statuses');
            client.user.setStatus(selectedStatus);
            await delay(5000);
            await interaction.editReply({ content: `Status: ${selectedStatus}` });
        }
        else if (interaction.options.getSubcommand() === 'activity') {
            await interaction.deferReply({ ephemeral: true });
            let activityType = interaction.options.getString('activity_type');
            const activityName = interaction.options.getString('activity_name');

            if (activityType === 'reset') {
                client.user.setPresence({});
                await delay(3000);
                await interaction.editReply({ content: `Activity reseted` })
            } else {
                switch (activityType) {
                    case 'watching':
                        activityType = ActivityType.Watching;
                        break;
                    case 'listening':
                        activityType = ActivityType.Listening;
                        break;
                }
                client.user.setActivity({
                    name: activityName ?? 'AI HUB',
                    type: activityType,
                });
                await delay(3000);
                await interaction.editReply({ content: `Activity updated!` });
            }
        }
        else if (interaction.options.getSubcommand() === 'general') {
            const botReactions = interaction.options.getBoolean('bot_reactions');
            const sendLogs = interaction.options.getBoolean('send_logs');
            const botResponse = { content: 'Nothing changed.', ephemeral: true };

            if ((botReactions == null) && (sendLogs == null)) return await interaction.reply(botResponse);

            botResponse.content = ['### General configs changed'];

            if (botReactions != null) {
                client.botConfigs.general.reactions = botReactions;
                botResponse.content.push(`- Reactions: \`${botReactions}\``);
            }

            if (sendLogs != null) {
                client.botConfigs.general.sendLogs = sendLogs;
                botResponse.content.push(`- Send logs: \`${sendLogs}\``);
            }

            botResponse.content = botResponse.content.join('\n');

            await interaction.reply(botResponse);
        }
    }
}