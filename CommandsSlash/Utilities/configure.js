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
    }
}