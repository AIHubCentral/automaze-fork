"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.lockAndTagThread = lockAndTagThread;
const discord_js_1 = require("discord.js");
const slashCommandData_json_1 = __importDefault(require("../../../JSON/slashCommandData.json"));
const i18n_1 = __importDefault(require("../../i18n"));
const commandData = slashCommandData_json_1.default.close;
const Close = {
    category: 'General',
    data: new discord_js_1.SlashCommandBuilder()
        .setName(commandData.name)
        .setDescription(commandData.description)
        .setDescriptionLocalizations(commandData.descriptionLocalizations),
    async execute(interaction) {
        const client = interaction.client;
        const language = interaction.locale;
        const logData = {
            guildId: interaction.guildId,
            channelId: interaction.channelId,
            channelLink: (0, discord_js_1.channelLink)(interaction.channelId),
            commandName: interaction.commandName,
        };
        try {
            const thread = interaction.channel;
            if (!thread || !thread.isThread()) {
                client.logger.warn('tried closing a non thread channel', logData);
                return interaction.reply({
                    content: i18n_1.default.t('close.invalid_channel', { lng: language }),
                    ephemeral: true,
                });
            }
            const allowedChannels = [
                client.discordIDs.Forum.RequestModel.ID,
                client.discordIDs.Forum.VoiceModels,
            ];
            if (!allowedChannels.includes(thread.parentId)) {
                client.logger.warn('tried closing a thread that is not allowed to close', logData);
                return await interaction.reply({
                    content: i18n_1.default.t('close.invalid_channel', { lng: language }),
                    ephemeral: true,
                });
            }
            const member = interaction.member;
            // Check if the user is the thread author or has any allowed staff role
            const allowedRoles = [client.discordIDs.Roles.Admin, client.discordIDs.Roles.Mod];
            const isAuthor = thread.ownerId === member.user.id;
            const hasStaffRole = allowedRoles.some((roleId) => member.roles.cache.has(roleId));
            if (!isAuthor && !hasStaffRole) {
                client.logger.warn('user tried closing a thread of another user', logData);
                return await interaction.reply({
                    content: i18n_1.default.t('close.not_author', { lng: language }),
                    ephemeral: true,
                });
            }
            // Ensure the thread is not already locked
            if (thread.locked) {
                client.logger.warn('tried closing an already locked thread', logData);
                return await interaction.reply({
                    content: i18n_1.default.t('close.already_locked', { lng: language }),
                    ephemeral: true,
                });
            }
            // Lock the thread and add the 'done' tag
            await lockAndTagThread(thread, client.discordIDs.Forum.RequestModel.Tags.Done);
            // Determine if the user is the thread author or staff and respond accordingly
            if (isAuthor) {
                const embedData = i18n_1.default.t('close.success.closed_by_author', {
                    returnObjects: true,
                });
                const embed = new discord_js_1.EmbedBuilder().setColor(discord_js_1.Colors.Blue);
                if (embedData.title) {
                    embed.setTitle(`🔒 ${embedData.title}`);
                }
                if (embedData.description) {
                    embed.setDescription(embedData.description.join('\n'));
                }
                await interaction.reply({ embeds: [embed] });
            }
            else if (hasStaffRole) {
                const embedData = i18n_1.default.t('close.success.closed_by_staff', {
                    returnObjects: true,
                });
                const embed = new discord_js_1.EmbedBuilder().setColor(discord_js_1.Colors.Green);
                if (embedData.title) {
                    embed.setTitle(`🔒 ${embedData.title}`);
                }
                if (embedData.description) {
                    embed.setDescription(embedData.description.join('\n'));
                }
                await interaction.reply({
                    content: i18n_1.default.t('close.success_message', { lng: language }),
                    ephemeral: true,
                });
                await thread.send({ embeds: [embed] });
            }
            client.logger.info('thread locked successfully', logData);
        }
        catch (error) {
            if (error instanceof discord_js_1.DiscordAPIError) {
                switch (error.code) {
                    case discord_js_1.RESTJSONErrorCodes.UnknownChannel:
                        client.logger.error('The specified channel does not exist.', logData);
                        await interaction.reply({
                            content: i18n_1.default.t('close.invalid_channel', { lng: language }),
                            ephemeral: true,
                        });
                        break;
                    case discord_js_1.RESTJSONErrorCodes.MissingPermissions:
                        client.logger.error('The bot does not have permission to perform this action.', logData);
                        await interaction.reply({
                            content: i18n_1.default.t('close.failure', { lng: language }),
                            ephemeral: true,
                        });
                        break;
                    default:
                        client.logger.error(`Discord API error: ${error.message}`, logData);
                        await interaction.reply({
                            content: i18n_1.default.t('close.failure', { lng: language }),
                            ephemeral: true,
                        });
                        break;
                }
            }
            else {
                client.logger.error(`Error closing thread: ${error instanceof Error ? error.message : String(error)}`, logData);
                await interaction.reply({
                    content: i18n_1.default.t('close.failure', { lng: language }),
                    ephemeral: true,
                });
            }
        }
    },
};
exports.default = Close;
/**
 * Locks a thread, sets its auto-archive duration to 1 hour, and adds a tag.
 *
 * @param {ThreadChannel} thread - The thread channel to be modified.
 * @param {string} tagId - The tag to add to the thread.
 * @returns {Promise<void>} - A promise that resolves once the thread is updated.
 * @throws {Error} - Throws an error if the provided channel is not a thread.
 */
async function lockAndTagThread(thread, tagId) {
    // Ensure the channel is a thread
    if (thread.type !== discord_js_1.ChannelType.PublicThread && thread.type !== discord_js_1.ChannelType.PrivateThread) {
        throw new Error('Provided channel is not a thread.');
    }
    await thread.setLocked(true);
    // Set the auto-archive duration to 1 hour (60 minutes)
    await thread.setAutoArchiveDuration(60);
    const appliedTags = thread.appliedTags;
    // don't add the tag if it's aready there
    if (appliedTags.includes(tagId))
        return;
    appliedTags.push(tagId);
    await thread.setAppliedTags(appliedTags);
}
