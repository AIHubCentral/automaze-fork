const { SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    category: 'Utilities',
    cooldown: 15,
    type: 'slash',
    data: new SlashCommandBuilder()
        .setName('send_embed')
        .setDescription('Sends an embed to a guild channel')
        .addStringOption(option => option
            .setName('description')
            .setDescription('Embed description')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('title')
            .setDescription('Embed title')
        )
        .addStringOption(option => option
            .setName('color')
            .setDescription('Embed color')
        )
        .addStringOption(option => option
            .setName('guild_id')
            .setDescription('Guild ID (Defaults to guild in config)')
        )
        .addStringOption(option => option
            .setName('channel_id')
            .setDescription('Channel ID (Defaults to bot-spam)')
        )
    ,
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const client = interaction.client;

        if (!client.botAdminIds || !client.botAdminIds.includes(interaction.user.id)) {
            return await editReply.reply({ content: 'You can\'t use this command', ephemeral: true });
        }

        const description = interaction.options.getString('description');
        const title = interaction.options.getString('title');
        const color = interaction.options.getString('color') ?? client.botConfigs.colors.theme.primary;
        const guildId = interaction.options.getString('guild_id') ?? client.discordIDs.Guild;
        const channelId = interaction.options.getString('channel_id') ?? client.discordIDs.Channel.BotSpam;

        try {
            const guild = await client.guilds.fetch(guildId);
            const channel = await guild.channels.fetch(channelId);

            const embed = client.botUtils.createEmbed({
                title: title ?? 'Untitled',
                description: [description],
                color: color
            });
    
            const botResponse = {
                embeds: [embed],
            };

            await channel.send(botResponse);
            await interaction.editReply({ content: `Embed sent:\n- Guild: ${guildId}\n- Channel: ${channelId}`});
        }
        catch(error) {
            console.log(error);
            await interaction.editReply({ content: `Failed to fetch:\n- Guild: ${guildId}\n- Channel: ${channelId}`});
        }
    }
};