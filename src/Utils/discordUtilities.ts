import { APIEmbed, ColorResolvable, Colors, EmbedBuilder, Guild, GuildBasedChannel } from 'discord.js';
import IBotConfigs from '../Interfaces/BotConfigs';
import ExtendedClient from '../Core/extendedClient';
import { EmbedData } from '../Interfaces/BotData';

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

export async function getGuildById(guildId: string, client: ExtendedClient): Promise<Guild | undefined> {
    /* attempts to get a guid from cache, fetch if not found */

    let guild = client.guilds.cache.get(guildId);

    if (!guild) {
        client.logger.debug(`Guild ${guildId} not found in cache...Fetching`);
        guild = await client.guilds.fetch(guildId);
    }

    return guild;
}

export async function getChannelById(channelId: string, guild: Guild): Promise<GuildBasedChannel | null> {
    /* attempts to get a channel from cache, fetch if not found */

    let channel = guild.channels.cache.get(channelId) ?? null;

    if (!channel) {
        channel = await guild.channels.fetch(channelId);
    }

    return channel;
}
