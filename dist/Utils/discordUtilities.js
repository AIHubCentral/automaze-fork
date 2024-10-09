"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEmbed = createEmbed;
exports.createEmbeds = createEmbeds;
exports.getAvailableColors = getAvailableColors;
exports.getGuildById = getGuildById;
exports.getChannelById = getChannelById;
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
