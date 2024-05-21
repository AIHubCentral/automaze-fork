"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const discordUtilities_1 = require("../../Utils/discordUtilities");
const SendColabGuides = {
    category: 'Tags',
    type: 'context-menu',
    data: new discord_js_1.ContextMenuCommandBuilder()
        .setName('Send Colab links')
        .setType(discord_js_1.ApplicationCommandType.User),
    async execute(interaction) {
        const { client, targetUser } = interaction;
        if (targetUser.bot)
            return await interaction.reply({ content: 'That user is a bot.', ephemeral: true });
        const { botData } = client;
        const embeds = [];
        const embedData = botData.embeds.colab.en;
        embedData.embeds?.forEach(content => {
            embeds.push((0, discordUtilities_1.createEmbed)(content));
        });
        const botResponse = { embeds: embeds };
        if (embedData.mentionMessage) {
            botResponse.content = embedData.mentionMessage.replace('$user', targetUser.toString());
        }
        await interaction.reply(botResponse);
    },
};
exports.default = SendColabGuides;
