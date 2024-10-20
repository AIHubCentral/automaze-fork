import {
    channelLink,
    Colors,
    EmbedBuilder,
    GuildMember,
    SlashCommandBuilder,
    ThreadChannel,
    RESTJSONErrorCodes,
    DiscordAPIError,
    ChannelType,
} from 'discord.js';
import { SlashCommand } from '../../Interfaces/Command';
import slashCommandData from '../../../JSON/slashCommandData.json';
import ExtendedClient from '../../Core/extendedClient';
import i18next from '../../i18n';
import { EmbedData } from '../../Interfaces/BotData';

const commandData = slashCommandData.close;

const Close: SlashCommand = {
    category: 'General',
    data: new SlashCommandBuilder()
        .setName(commandData.name)
        .setDescription(commandData.description)
        .setDescriptionLocalizations(commandData.descriptionLocalizations),
    async execute(interaction) {
        const client = interaction.client as ExtendedClient;
        const language = interaction.locale;

        const logData = {
            guildId: interaction.guildId,
            channelId: interaction.channelId,
            channelLink: channelLink(interaction.channelId),
            commandName: interaction.commandName,
        };

        try {
            const thread = interaction.channel as ThreadChannel;

            if (!thread || !thread.isThread()) {
                client.logger.warn('tried closing a non thread channel', logData);
                return interaction.reply({
                    content: i18next.t('close.invalid_channel', { lng: language }),
                    ephemeral: true,
                });
            }

            const allowedChannels = [
                client.discordIDs.Forum.RequestModel.ID,
                client.discordIDs.Forum.VoiceModel,
            ];

            if (!allowedChannels.includes(thread.parentId!)) {
                client.logger.warn('tried closing a thread that is not allowed to close', logData);
                return await interaction.reply({
                    content: i18next.t('close.invalid_channel', { lng: language }),
                    ephemeral: true,
                });
            }

            const member = interaction.member as GuildMember;

            // Check if the user is the thread author or has any allowed staff role
            const allowedRoles = [client.discordIDs.Roles.Admin, client.discordIDs.Roles.Mod];
            const isAuthor = thread.ownerId === member.user.id;
            const hasStaffRole = allowedRoles.some((roleId) => member.roles.cache.has(roleId));

            if (!isAuthor && !hasStaffRole) {
                client.logger.warn('user tried closing a thread of another user', logData);
                return await interaction.reply({
                    content: i18next.t('close.not_author', { lng: language }),
                    ephemeral: true,
                });
            }

            // Ensure the thread is not already locked
            if (thread.locked) {
                client.logger.warn('tried closing an already locked thread', logData);
                return await interaction.reply({
                    content: i18next.t('close.already_locked', { lng: language }),
                    ephemeral: true,
                });
            }

            // Lock the thread and add the 'done' tag
            await lockAndTagThread(thread, client.discordIDs.Forum.RequestModel.Tags.Done);

            // Determine if the user is the thread author or staff and respond accordingly
            if (isAuthor) {
                const embedData = i18next.t('close.success.closed_by_author', {
                    returnObjects: true,
                }) as EmbedData;
                const embed = new EmbedBuilder().setColor(Colors.Green);

                if (embedData.title) {
                    embed.setTitle(`🔒 ${embedData.title}`);
                }

                if (embedData.description) {
                    embed.setDescription(embedData.description.join('\n'));
                }

                await interaction.reply({ embeds: [embed] });
            } else if (hasStaffRole) {
                const embedData = i18next.t('close.success.closed_by_staff', {
                    returnObjects: true,
                }) as EmbedData;
                const embed = new EmbedBuilder().setColor(Colors.Green);

                if (embedData.title) {
                    embed.setTitle(`🔒 ${embedData.title}`);
                }

                if (embedData.description) {
                    embed.setDescription(embedData.description.join('\n'));
                }

                await interaction.reply({
                    content: i18next.t('close.success_message', { lng: language }),
                    ephemeral: true,
                });
                await thread.send({ embeds: [embed] });
            }

            client.logger.info('thread locked successfully', logData);
        } catch (error) {
            if (error instanceof DiscordAPIError) {
                switch (error.code) {
                    case RESTJSONErrorCodes.UnknownChannel:
                        client.logger.error('The specified channel does not exist.', logData);
                        await interaction.reply({
                            content: i18next.t('close.invalid_channel', { lng: language }),
                            ephemeral: true,
                        });
                        break;
                    case RESTJSONErrorCodes.MissingPermissions:
                        client.logger.error(
                            'The bot does not have permission to perform this action.',
                            logData
                        );
                        await interaction.reply({
                            content: i18next.t('close.failure', { lng: language }),
                            ephemeral: true,
                        });
                        break;
                    default:
                        client.logger.error(`Discord API error: ${error.message}`, logData);
                        await interaction.reply({
                            content: i18next.t('close.failure', { lng: language }),
                            ephemeral: true,
                        });
                        break;
                }
            } else {
                client.logger.error(
                    `Error closing thread: ${error instanceof Error ? error.message : String(error)}`,
                    logData
                );
                await interaction.reply({
                    content: i18next.t('close.failure', { lng: language }),
                    ephemeral: true,
                });
            }
        }
    },
};

export default Close;

/**
 * Locks a thread, sets its auto-archive duration to 1 hour, and adds a tag.
 *
 * @param {ThreadChannel} thread - The thread channel to be modified.
 * @param {string} tagId - The tag to add to the thread.
 * @returns {Promise<void>} - A promise that resolves once the thread is updated.
 * @throws {Error} - Throws an error if the provided channel is not a thread.
 */
export async function lockAndTagThread(thread: ThreadChannel, tagId: string): Promise<void> {
    // Ensure the channel is a thread
    if (thread.type !== ChannelType.PublicThread && thread.type !== ChannelType.PrivateThread) {
        throw new Error('Provided channel is not a thread.');
    }

    await thread.setLocked(true);

    // Set the auto-archive duration to 1 hour (60 minutes)
    await thread.setAutoArchiveDuration(60);

    const appliedTags = thread.appliedTags;

    // don't add the tag if it's aready there
    if (appliedTags.includes(tagId)) return;

    appliedTags.push(tagId);
    await thread.setAppliedTags(appliedTags);
}
