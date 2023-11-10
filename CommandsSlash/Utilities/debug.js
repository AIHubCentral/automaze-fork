const { SlashCommandBuilder, AttachmentBuilder, ChannelType } = require("discord.js");
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

        botResponse.content = [];

        const { botData, botUtils } = client;

        const channelId = interaction.options.getString('channel_id');
        const guildId = interaction.options.getString('guild_id') ?? client.discordIDs.Guild;

        if (guildId) {
            var guild = client.guilds.cache.get(guildId);

            if (!guild) {
                guild = await client.guilds.fetch(guildId);
            }

            botResponse.content.push('**Guild:**');
            botResponse.content.push(`Name: ${guild.name}`)

            const emojiManager = guild.emojis;

            botResponse.content.push('\n**Guild Emojis**:');

            emojiManager.cache.forEach(emoji => {
                // create a string in the format <:emoji:id>
                let emojiString = `- \\<:${emoji.name}:${emoji.id}>`;
                // show the emoji if it's not animated
                if (!emoji.animated) {
                    emojiString += ` <:${emoji.name}:${emoji.id}>`;
                }
                botResponse.content.push(emojiString);
            });

            const stickerManager = guild.stickers;

            botResponse.content.push('\n**Guild Stickers**:');

            stickerManager.cache.forEach(sticker => {
                botResponse.content.push(`- ${sticker.id} - ${sticker.name}`);
            });
        }

        if (channelId && guildId) {
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

        botResponse.content.push(`\nNew models since bot is online: ${botData.voiceModelsCounter}`);

        botResponse.content = botResponse.content.join('\n');

        await interaction.editReply(botResponse);
    }
}