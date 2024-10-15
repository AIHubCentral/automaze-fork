import {
    SlashCommandBuilder,
    AttachmentBuilder,
    ChannelType,
    bold,
    InteractionEditReplyOptions,
    inlineCode,
    EmbedBuilder,
    Colors,
    unorderedList,
    TextChannel,
    ThreadChannel,
    heading,
    HeadingLevel,
} from 'discord.js';
import { SlashCommand } from '../../Interfaces/Command';
import { getChannelById, getGuildById } from '../../Utils/discordUtilities';
import ExtendedClient from '../../Core/extendedClient';

const Debug: SlashCommand = {
    category: 'Utilities',
    data: new SlashCommandBuilder()
        .setName('debug')
        .setDescription('Bot debug')
        .addStringOption((option) =>
            option
                .setName('options')
                .setDescription('Choose an option')
                .setRequired(true)
                .addChoices(
                    { name: 'emojis', value: 'emojis' },
                    { name: 'stickers', value: 'stickers' },
                    { name: 'channelInfo', value: 'channel_info' },
                    { name: 'voiceModels', value: 'voice_models' }
                )
        )
        .addStringOption((option) => option.setName('channel_id').setDescription('Channel ID'))
        .addStringOption((option) => option.setName('guild_id').setDescription('Guild ID')),
    async execute(interaction) {
        const client = interaction.client as ExtendedClient;
        const userId = interaction.user.id;

        if (!client.botAdminIds.includes(userId)) {
            return interaction.reply("You're not allowed to use this command.");
        }

        const selectedOption = interaction.options.getString('options');
        const guildId = interaction.options.getString('guild_id') ?? client.discordIDs.Guild;
        const botResponse: InteractionEditReplyOptions = {};
        const embedContent: string[] = [];

        await interaction.deferReply({ ephemeral: true });

        const guild = await getGuildById(guildId, client);
        if (!guild) {
            return interaction.editReply(`Failed to fetch guild: ${guildId}`);
        }

        embedContent.push(bold('Guild:'));
        embedContent.push(`Name: ${guild.name}`);

        if (selectedOption === 'emojis') {
            const guildEmojis = Array.from(guild.emojis.cache.values());
            embedContent.push(`\n${bold('Guild Emojis')}:`);

            const buffer = Buffer.from(JSON.stringify(guildEmojis, null, 4), 'utf-8');
            const attachment = new AttachmentBuilder(buffer, { name: 'emojis.json' });

            botResponse.files = [attachment];
        } else if (selectedOption === 'stickers') {
            const guildStickers = Array.from(guild.stickers.cache.values());
            embedContent.push(`\n${bold('Guild Stickers')}:`);

            const buffer = Buffer.from(JSON.stringify(guildStickers, null, 4), 'utf-8');
            const attachment = new AttachmentBuilder(buffer, { name: 'stickers.json' });

            botResponse.files = [attachment];
        } else if (selectedOption === 'channel_info') {
            const channelId = interaction.options.getString('channel_id') ?? '';

            if (channelId === '') {
                await interaction.editReply({ content: 'Missing channel ID' });
                return;
            }

            const channel = await getChannelById(channelId, guild);

            if (!channel) {
                await interaction.editReply({
                    content: `Couldn'\t find channel with ID ${inlineCode(channelId)}`,
                });
                return;
            }

            const isThread = channel.type === ChannelType.PublicThread;
            const currentChannel = isThread ? (channel as ThreadChannel) : (channel as TextChannel);

            const embed = new EmbedBuilder()
                .setTitle(`🪲 Channel Info (${guild.name})`)
                .setColor(Colors.Greyple);

            let embedDescription = [
                heading(bold('Channel'), HeadingLevel.Two),
                unorderedList([
                    `Name: ${inlineCode(currentChannel.name)}`,
                    `ID: ${inlineCode(currentChannel.id)}`,
                    `Type: ${inlineCode(String(currentChannel.type))}`,
                    `Is Thread: ${inlineCode(String(isThread))}`,
                ]),
            ];

            if (currentChannel.type === ChannelType.PublicThread) {
                embedDescription = [
                    ...embedDescription,
                    heading(bold('Thread'), HeadingLevel.Three),
                    unorderedList([
                        `Locked: ${inlineCode(String(currentChannel.locked))}`,
                        `Message count: ${inlineCode(String(currentChannel.messageCount))}`,
                        `Archived: ${inlineCode(String(currentChannel.archived))}`,
                        `autoArchiveDuration: ${inlineCode(String(currentChannel.autoArchiveDuration))}`,
                        `archiveTimestamp: ${inlineCode(String(currentChannel.archiveTimestamp))}`,
                        `Owner ID: ${inlineCode(String(currentChannel.ownerId))}`,
                        `Parent ID: ${inlineCode(String(channel.parentId))}`,
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

export default Debug;
