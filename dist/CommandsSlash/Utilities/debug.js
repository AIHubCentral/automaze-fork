"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const discordUtilities_1 = require("../../Utils/discordUtilities");
const Debug = {
    category: 'Utilities',
    data: new discord_js_1.SlashCommandBuilder()
        .setName('debug')
        .setDescription('Bot debug')
        .addStringOption((option) => option
        .setName('options')
        .setDescription('Choose an option')
        .setRequired(true)
        .addChoices({ name: 'emojis', value: 'emojis' }, { name: 'stickers', value: 'stickers' }, { name: 'channelInfo', value: 'channel_info' }, { name: 'voiceModels', value: 'voice_models' }))
        .addStringOption((option) => option.setName('channel_id').setDescription('Channel ID'))
        .addStringOption((option) => option.setName('guild_id').setDescription('Guild ID')),
    async execute(interaction) {
        const client = interaction.client;
        const userId = interaction.user.id;
        if (!client.botAdminIds.includes(userId)) {
            return interaction.reply("You're not allowed to use this command.");
        }
        const selectedOption = interaction.options.getString('options');
        const guildId = interaction.options.getString('guild_id') ?? client.discordIDs.Guild;
        const botResponse = {};
        const embedContent = [];
        await interaction.deferReply({ ephemeral: true });
        const guild = await (0, discordUtilities_1.getGuildById)(guildId, client);
        if (!guild) {
            return interaction.editReply(`Failed to fetch guild: ${guildId}`);
        }
        embedContent.push((0, discord_js_1.bold)('Guild:'));
        embedContent.push(`Name: ${guild.name}`);
        if (selectedOption === 'emojis') {
            const guildEmojis = Array.from(guild.emojis.cache.values());
            embedContent.push(`\n${(0, discord_js_1.bold)('Guild Emojis')}:`);
            const buffer = Buffer.from(JSON.stringify(guildEmojis, null, 4), 'utf-8');
            const attachment = new discord_js_1.AttachmentBuilder(buffer, { name: 'emojis.json' });
            botResponse.files = [attachment];
        }
        else if (selectedOption === 'stickers') {
            const guildStickers = Array.from(guild.stickers.cache.values());
            embedContent.push(`\n${(0, discord_js_1.bold)('Guild Stickers')}:`);
            const buffer = Buffer.from(JSON.stringify(guildStickers, null, 4), 'utf-8');
            const attachment = new discord_js_1.AttachmentBuilder(buffer, { name: 'stickers.json' });
            botResponse.files = [attachment];
        }
        else if (selectedOption === 'channel_info') {
            const channelId = interaction.options.getString('channel_id') ?? '';
            if (channelId === '') {
                await interaction.editReply({ content: 'Missing channel ID' });
                return;
            }
            const channel = await (0, discordUtilities_1.getChannelById)(channelId, guild);
            if (!channel) {
                await interaction.editReply({
                    content: `Couldn'\t find channel with ID ${(0, discord_js_1.inlineCode)(channelId)}`,
                });
                return;
            }
            const isThread = channel.type === discord_js_1.ChannelType.PublicThread;
            const currentChannel = isThread ? channel : channel;
            const embed = new discord_js_1.EmbedBuilder()
                .setTitle(`🪲 Channel Info (${guild.name})`)
                .setColor(discord_js_1.Colors.Greyple);
            let embedDescription = [
                (0, discord_js_1.heading)((0, discord_js_1.bold)('Channel'), discord_js_1.HeadingLevel.Two),
                (0, discord_js_1.unorderedList)([
                    `Name: ${(0, discord_js_1.inlineCode)(currentChannel.name)}`,
                    `ID: ${(0, discord_js_1.inlineCode)(currentChannel.id)}`,
                    `Type: ${(0, discord_js_1.inlineCode)(String(currentChannel.type))}`,
                    `Is Thread: ${(0, discord_js_1.inlineCode)(String(isThread))}`,
                ]),
            ];
            if (currentChannel.type === discord_js_1.ChannelType.PublicThread) {
                embedDescription = [
                    ...embedDescription,
                    (0, discord_js_1.heading)((0, discord_js_1.bold)('Thread'), discord_js_1.HeadingLevel.Three),
                    (0, discord_js_1.unorderedList)([
                        `Locked: ${(0, discord_js_1.inlineCode)(String(currentChannel.locked))}`,
                        `Message count: ${(0, discord_js_1.inlineCode)(String(currentChannel.messageCount))}`,
                        `Archived: ${(0, discord_js_1.inlineCode)(String(currentChannel.archived))}`,
                        `autoArchiveDuration: ${(0, discord_js_1.inlineCode)(String(currentChannel.autoArchiveDuration))}`,
                        `archiveTimestamp: ${(0, discord_js_1.inlineCode)(String(currentChannel.archiveTimestamp))}`,
                        `Owner ID: ${(0, discord_js_1.inlineCode)(String(currentChannel.ownerId))}`,
                        `Parent ID: ${(0, discord_js_1.inlineCode)(String(channel.parentId))}`,
                    ]),
                ];
            }
            embed.setDescription(embedDescription.join('\n'));
            await interaction.editReply({ embeds: [embed] });
            return;
        }
        botResponse.content = embedContent.join('\n');
        await interaction.editReply(botResponse);
    },
};
exports.default = Debug;
