const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js");
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const delay = require('node:timers/promises').setTimeout;

module.exports = {
    category: `Utilities`,
    type: `slash`,
    data: new SlashCommandBuilder()
        .setName('debug')
        .setDescription('Bot debug')
        .addStringOption(option => 
            option
                .setName('channel_id')
                .setDescription('Channel ID')
        )
        .addStringOption(option => 
            option
                .setName('guild_id')
                .setDescription('Guild ID')
        )
    ,
    async execute(interaction) {
        // usable on dev server only
        const { client } = interaction;
        const userId = interaction.user.id;
        const botResponse = { content: 'You are not allowed to use this command.' };

        await interaction.deferReply({ ephemeral: true });

        if (!client.botAdminIds.includes(userId)) return interaction.editReply(botResponse);

        const { botData, botUtils } = client;

        const channelId = interaction.options.getString('channel_id');
        const guildId = interaction.options.getString('guild_id') ?? client.discordIDs.Guild;

        botResponse.content = [
            `New models since bot is online: ${botData.voiceModelsCounter}`
        ];

        botResponse.content = botResponse.content.join('\n');

        await interaction.editReply(botResponse);
    }
}