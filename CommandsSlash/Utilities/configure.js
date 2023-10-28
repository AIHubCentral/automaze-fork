const { SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    category: `Utilities`,
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

            await interaction.reply({ content: botResponse, ephemeral: true })
        }
    }
}