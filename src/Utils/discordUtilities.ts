import { ColorResolvable, Colors, EmbedBuilder } from "discord.js";
import { EmbedData } from "../Interfaces/BotData";
import IBotConfigs from "../Interfaces/BotConfigs";

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
    const embeds = contents.map(item => {
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