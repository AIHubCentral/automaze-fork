const { SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    category: 'Utilities',
    cooldown: 15,
    type: 'slash',
    data: new SlashCommandBuilder()
        .setName('send_reply')
        .setDescription('Sends a reply to a message')
        .addStringOption(option => option
            .setName('message_id')
            .setDescription('The ID of the message to reply')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('text')
            .setDescription('The text to be sent')
            .setRequired(true)
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

        const text = interaction.options.getString('text');
        const messageId = interaction.options.getString('message_id');
        const guildId = interaction.options.getString('guild_id') ?? client.discordIDs.Guild;
        const channelId = interaction.options.getString('channel_id') ?? client.discordIDs.Channel.BotSpam;

        try {
            const guild = client.guilds.cache.get(guildId);
            const channel = guild.channels.cache.get(channelId);
            const message = await channel.messages.fetch(messageId);

            if (!message || !channel) {
                return await interaction.editReply({ content: 'Failed to retrieve message or channel.' });
            }

            const botResponse = {
               content: text,
            };

            await message.reply(botResponse);
            await interaction.editReply({ content: `### Text sent:\n- Guild: ${guildId}\n- Channel: ${channelId}\n\n> Content: ${text}`});
        }
        catch(error) {
            console.log(error);
            await interaction.editReply({ content: `Failed to fetch:\n- Guild: ${guildId}\n- Channel: ${channelId}`});
        }
    }
};