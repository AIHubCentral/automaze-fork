import {
    ColorResolvable,
    Colors,
    EmbedBuilder,
    Guild,
    GuildBasedChannel,
    User,
    DiscordAPIError,
    ApplicationCommandStringOptionData,
    SlashCommandStringOption,
    TextChannel,
} from 'discord.js';
import IBotConfigs from '../Interfaces/BotConfigs';
import ExtendedClient from '../Core/extendedClient';
import { EmbedData } from '../Interfaces/BotData';
import winston from 'winston';

export function createEmbed(data: EmbedData, color?: ColorResolvable): EmbedBuilder {
    /**
     * Creates a discord embed from an object passed as `data` argument
     */
    const embed = new EmbedBuilder();

    // if the color not provided as an argument, try to use from data
    if (!color) {
        color = data.color as ColorResolvable;
    }

    embed.setColor(color ?? Colors.Yellow);

    if (data.title) {
        embed.setTitle(data.title);
    }

    if (data.description) {
        embed.setDescription(data.description.join('\n'));
    }

    if (data.fields) {
        embed.setFields(data.fields);
    }

    if (data.image) {
        embed.setImage(data.image);
    }

    if (data.thumbnail) {
        embed.setThumbnail(data.thumbnail);
    }

    if (data.footer) {
        embed.setFooter({ text: data.footer });
    }

    if (data.timestamp) {
        embed.setTimestamp();
    }

    return embed;
}

export function createEmbeds(contents: EmbedData[], colors: ColorResolvable[]): EmbedBuilder[] {
    /* create embeds from an array of objects and assign colors */
    let colorIndex = 0;
    const embeds = contents.map((item) => {
        if (colorIndex >= colors.length) {
            // goes back to the start of the array after reaching the end
            colorIndex = 0;
        }
        const selectedColor = item.color ?? colors[colorIndex++];
        return createEmbed(item, selectedColor);
    });
    return embeds;
}

export function getAvailableColors(configs: IBotConfigs): ColorResolvable[] {
    return Object.values(configs.colors.theme);
}

/**
 * Retrieves a guild by its ID from the client's cache or fetches it if not found.
 *
 * @param {string} guildId - The ID of the guild to retrieve.
 * @param {ExtendedClient} client - The client instance to use for fetching the guild.
 * @returns {Promise<Guild | undefined>} - A promise that resolves to the guild if found, otherwise undefined.
 */
export async function getGuildById(guildId: string, client: ExtendedClient): Promise<Guild | undefined> {
    let guild = client.guilds.cache.get(guildId);

    if (!guild) {
        // Log a debug message if the guild is not found in the cache
        client.logger.debug(`Guild ${guildId} not found in cache...Fetching`);
        // Fetch the guild from the API
        guild = await client.guilds.fetch(guildId);
    }

    return guild;
}

/**
 * Retrieves a channel by its ID from the guild's cache or fetches it if not found.
 *
 * @param {string} channelId - The ID of the channel to retrieve.
 * @param {Guild} guild - The guild instance to use for fetching the channel.
 * @returns {Promise<GuildBasedChannel | null>} - A promise that resolves to the channel if found, otherwise null.
 */
export async function getChannelById(channelId: string, guild: Guild): Promise<GuildBasedChannel | null> {
    // Attempt to get the channel from the cache
    let channel = guild.channels.cache.get(channelId) ?? null;

    if (!channel) {
        // Fetch the channel from the API if not found in the cache
        channel = await guild.channels.fetch(channelId);
    }

    return channel as GuildBasedChannel;
}

/**
 * Get the display name of a Discord user.
 * @param user - The Discord User object.
 * @param guild - The Discord Guild object.
 * @returns The display name of the user or username if displau name not available.
 */
export async function getDisplayName(user: User, guild: Guild | null): Promise<string> {
    if (!guild) return user.username;

    try {
        const member = await guild.members.fetch(user.id);
        return member.displayName;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        // Fallback to username if member is not found
        return user.username;
    }
}

export enum DiscordErrorCodes {
    MissingAccess = 50001,
    MissingPermissions = 50013,
    InvalidFormBody = 50035,
    CannotUseThisSticker = 50081,
    UnknownChannel = 10003,
    UnknownMessage = 10008,
    UnknownRole = 10011,
    UnknownMember = 10007,
    CannotSendEmptyMessage = 50006,
    InvalidToken = 40001,
    RateLimited = 429,
}

export function handleDiscordError(logger: winston.Logger, error: DiscordAPIError) {
    switch (error.code) {
        case DiscordErrorCodes.MissingAccess:
            logger.error('Missing access to resource', error);
            break;
        case DiscordErrorCodes.MissingPermissions:
            logger.error('Missing permissions to perform the action', error);
            break;
        case DiscordErrorCodes.InvalidFormBody:
            logger.error('Invalid form body: Check if all fields are correct', error);
            break;
        case DiscordErrorCodes.UnknownChannel:
            logger.error('Unknown channel: The channel might have been deleted', error);
            break;
        case DiscordErrorCodes.RateLimited:
            logger.error('Rate limit exceeded. Slow down requests', error);
            break;
        default:
            logger.error(`An unexpected error occurred: ${error.message}`, error);
    }
}

export function createStringOption(optionData: ApplicationCommandStringOptionData) {
    const option = new SlashCommandStringOption()
        .setName(optionData.name)
        .setDescription(optionData.description);

    if (optionData.nameLocalizations) {
        option.setNameLocalizations(optionData.nameLocalizations);
    }

    if (optionData.descriptionLocalizations) {
        option.setDescriptionLocalizations(optionData.descriptionLocalizations);
    }

    if (optionData.choices) {
        option.setChoices(...optionData.choices);
    }

    if (optionData.required) {
        option.setRequired(optionData.required);
    }

    return option;
}
