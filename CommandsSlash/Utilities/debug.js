const { SlashCommandBuilder, AttachmentBuilder, ChannelType } = require("discord.js");
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const delay = require('node:timers/promises').setTimeout;
const fs = require('node:fs');

module.exports = {
    category: `Utilities`,
    type: `slash`,
    data: new SlashCommandBuilder()
        .setName('debug')
        .setDescription('Bot debug')
        .addStringOption(option =>
            option
                .setName('options')
                .setDescription('Choose an option')
                .setRequired(true)
                .addChoices(
                    { name: 'emojis', value: 'emojis' },
                    { name: 'stickers', value: 'stickers' },
                    { name: 'channelInfo', value: 'channel_info' },
                    { name: 'voiceModels', value: 'voice_models' },
                )
        )
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

        botResponse.content = [];

        const { botData, botUtils } = client;

        const selectedOption = interaction.options.getString('options');

        const guildId = interaction.options.getString('guild_id') ?? client.discordIDs.Guild;
        let guild = client.guilds.cache.get(guildId);

        if (!guild) {
            console.log('Guild not found in cache...Fetching');
            guild = await client.guilds.fetch(guildId);
        }

        botResponse.content.push('**Guild:**');
        botResponse.content.push(`Name: ${guild.name}`);

        if (selectedOption === 'emojis') {
            const emojiManager = guild.emojis;
            const emojiData = [];

            botResponse.content.push('\n**Guild Emojis**:');

            emojiManager.cache.forEach(emoji => {
                emojiData.push(emoji);
            });

            const buffer = Buffer.from(JSON.stringify(emojiData, null, 4), 'utf-8');
            const attachment = new AttachmentBuilder(buffer, { name: 'emojis.json' });

            botResponse.content = ['Getting emojis...'];
            botResponse.files = [attachment];
        }
        else if (selectedOption === 'stickers') {
            const stickerManager = guild.stickers;
            const stickerData = [];

            botResponse.content.push('\n**Guild Stickers**:');

            stickerManager.cache.forEach(sticker => {
                stickerData.push(sticker);
            });

            const buffer = Buffer.from(JSON.stringify(stickerData, null, 4), 'utf-8');
            const attachment = new AttachmentBuilder(buffer, { name: 'stickers.json' });

            botResponse.content = ['Getting stickers...'];
            botResponse.files = [attachment];
        }
        else if (selectedOption === 'channel_info') {
            const channelId = interaction.options.getString('channel_id');
            let channel = guild.channels.cache.get(channelId);

            if (!channel) {
                channel = await guild.channels.fetch(channelId);
            }

            botResponse.content.push('\n**Channel:**');
            botResponse.content.push(`> Name: ${channel.name}`)
            botResponse.content.push(`> ID: ${channelId}`);
            botResponse.content.push(`> Type: ${channel.type}`);

            const isThread = channel.type === ChannelType.PublicThread;        
            botResponse.content.push(`> Is thread: ${isThread}`);

            if (isThread) {
                botResponse.content.push(`\n**Thread**:`);
                botResponse.content.push(`> Locked: ${channel.locked}`);
                botResponse.content.push(`> Message count: ${channel.messageCount}`);
                botResponse.content.push(`> Archived: ${channel.archived}`);
                botResponse.content.push(`> autoArchiveDuration: ${channel.autoArchiveDuration}`);
                botResponse.content.push(`> archiveTimestamp: ${channel.archiveTimestamp}`);
                botResponse.content.push(`> Owner ID: ${channel.ownerId}`);
                botResponse.content.push(`> Parent ID: ${channel.parentId}`);

                if (channel.appliedTags.length) {
                    botResponse.content.push(`> Applied tags:`);
                    for (const tag of channel.appliedTags) {
                        botResponse.content.push(`> ${tag}`);
                    }
                }
            }
        }

        botResponse.content = botResponse.content.join('\n');

        await interaction.editReply(botResponse);
    }
}