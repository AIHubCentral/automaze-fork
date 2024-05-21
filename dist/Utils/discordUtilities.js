"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAvailableColors = exports.createEmbeds = exports.createEmbed = void 0;
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
exports.createEmbed = createEmbed;
function createEmbeds(contents, colors) {
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
exports.createEmbeds = createEmbeds;
function getAvailableColors(configs) {
    return Object.values(configs.colors.theme);
}
exports.getAvailableColors = getAvailableColors;
