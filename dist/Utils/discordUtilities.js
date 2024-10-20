"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscordErrorCodes = void 0;
exports.createEmbed = createEmbed;
exports.createEmbeds = createEmbeds;
exports.getAvailableColors = getAvailableColors;
exports.getGuildById = getGuildById;
exports.getChannelById = getChannelById;
exports.getDisplayName = getDisplayName;
exports.handleDiscordError = handleDiscordError;
exports.createStringOption = createStringOption;
exports.createButtons = createButtons;
const discord_js_1 = require("discord.js");
function createEmbed(data, color) {
    /**
     * Creates a discord embed from an object passed as `data` argument
     */
    const embed = new discord_js_1.EmbedBuilder();
    // if the color not provided as an argument, try to use from data
    if (!color) {
        color = data.color;
    }
    embed.setColor(color ?? discord_js_1.Colors.Yellow);
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
function createEmbeds(contents, colors) {
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
function getAvailableColors(configs) {
    return Object.values(configs.colors.theme);
}
/**
 * Retrieves a guild by its ID from the client's cache or fetches it if not found.
 *
 * @param {string} guildId - The ID of the guild to retrieve.
 * @param {ExtendedClient} client - The client instance to use for fetching the guild.
 * @returns {Promise<Guild | undefined>} - A promise that resolves to the guild if found, otherwise undefined.
 */
async function getGuildById(guildId, client) {
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
async function getChannelById(channelId, guild) {
    // Attempt to get the channel from the cache
    let channel = guild.channels.cache.get(channelId) ?? null;
    if (!channel) {
        // Fetch the channel from the API if not found in the cache
        channel = await guild.channels.fetch(channelId);
    }
    return channel;
}
/**
 * Get the display name of a Discord user.
 * @param user - The Discord User object.
 * @param guild - The Discord Guild object.
 * @returns The display name of the user or username if displau name not available.
 */
async function getDisplayName(user, guild) {
    if (!guild)
        return user.username;
    try {
        const member = await guild.members.fetch(user.id);
        return member.displayName;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    }
    catch (error) {
        // Fallback to username if member is not found
        return user.username;
    }
}
var DiscordErrorCodes;
(function (DiscordErrorCodes) {
    DiscordErrorCodes[DiscordErrorCodes["MissingAccess"] = 50001] = "MissingAccess";
    DiscordErrorCodes[DiscordErrorCodes["MissingPermissions"] = 50013] = "MissingPermissions";
    DiscordErrorCodes[DiscordErrorCodes["InvalidFormBody"] = 50035] = "InvalidFormBody";
    DiscordErrorCodes[DiscordErrorCodes["CannotUseThisSticker"] = 50081] = "CannotUseThisSticker";
    DiscordErrorCodes[DiscordErrorCodes["UnknownChannel"] = 10003] = "UnknownChannel";
    DiscordErrorCodes[DiscordErrorCodes["UnknownMessage"] = 10008] = "UnknownMessage";
    DiscordErrorCodes[DiscordErrorCodes["UnknownRole"] = 10011] = "UnknownRole";
    DiscordErrorCodes[DiscordErrorCodes["UnknownMember"] = 10007] = "UnknownMember";
    DiscordErrorCodes[DiscordErrorCodes["CannotSendEmptyMessage"] = 50006] = "CannotSendEmptyMessage";
    DiscordErrorCodes[DiscordErrorCodes["InvalidToken"] = 40001] = "InvalidToken";
    DiscordErrorCodes[DiscordErrorCodes["RateLimited"] = 429] = "RateLimited";
})(DiscordErrorCodes || (exports.DiscordErrorCodes = DiscordErrorCodes = {}));
function handleDiscordError(logger, error) {
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
function createStringOption(optionData) {
    const option = new discord_js_1.SlashCommandStringOption()
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
function createButtons(buttons) {
    return new discord_js_1.ActionRowBuilder().addComponents(buttons.map((btn) => {
        const button = new discord_js_1.ButtonBuilder().setLabel(btn.label).setURL(btn.url).setStyle(discord_js_1.ButtonStyle.Link);
        if (btn.emoji) {
            button.setEmoji(btn.emoji);
        }
        return button;
    }));
}
