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
            const channel = await (0, discordUtilities_1.getChannelById)(channelId, guild);
            embedContent.push(`\n${(0, discord_js_1.bold)('Channel')}:`);
            embedContent.push((0, discord_js_1.blockQuote)(`Name: ${channel?.name}`));
            embedContent.push((0, discord_js_1.blockQuote)(`Channel ID: ${channelId}`));
            embedContent.push((0, discord_js_1.blockQuote)(`Channel Type: ${channel?.type}`));
            const isThread = channel?.type === discord_js_1.ChannelType.PublicThread;
            embedContent.push((0, discord_js_1.blockQuote)(`Is thread: ${isThread}`));
            if (isThread) {
                embedContent.push(`\n${(0, discord_js_1.bold)('Thread')}:`);
                embedContent.push((0, discord_js_1.blockQuote)(`Locked: ${channel.locked}`));
                embedContent.push((0, discord_js_1.blockQuote)(`Message count: ${channel.messageCount}`));
                embedContent.push((0, discord_js_1.blockQuote)(`Archived: ${channel.archived}`));
                embedContent.push((0, discord_js_1.blockQuote)(`autoArchiveDuration: ${channel.autoArchiveDuration}`));
                embedContent.push((0, discord_js_1.blockQuote)(`archiveTimestamp: ${channel.archiveTimestamp}`));
                embedContent.push((0, discord_js_1.blockQuote)(`Owner ID: ${channel.ownerId}`));
                embedContent.push((0, discord_js_1.blockQuote)(`Parent ID: ${channel.parentId}`));
            }
        }
        botResponse.content = embedContent.join('\n');
        await interaction.editReply(botResponse);
    },
};
exports.default = Debug;
