"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const discordUtilities_1 = require("../../Utils/discordUtilities");
const botUtilities_1 = require("../../Utils/botUtilities");
const SendColabGuides = {
    category: 'Tags',
    data: new discord_js_1.ContextMenuCommandBuilder()
        .setName('Send Colab links')
        .setType(discord_js_1.ApplicationCommandType.User),
    async execute(interaction) {
        const { targetUser } = interaction;
        if (targetUser.bot)
            return await interaction.reply({ content: 'That user is a bot.', ephemeral: true });
        const client = interaction.client;
        const { botCache, botData, logger } = client;
        const resources = await (0, botUtilities_1.getResourceData)('colab', botCache, logger);
        const embeds = [];
        if (resources.length > 0) {
            embeds.push((0, discordUtilities_1.createEmbed)({
                title: '☁️ Google Colabs',
                color: 'f9ab00',
                description: [(0, botUtilities_1.resourcesToUnorderedList)(resources)],
            }));
        }
        const noticeEmbeds = botData.embeds.colab_notice.en.embeds;
        if (noticeEmbeds) {
            for (const embed of noticeEmbeds) {
                embeds.push((0, discordUtilities_1.createEmbed)(embed));
            }
        }
        const botResponse = {
            content: `Colab suggestions for ${targetUser.toString()}`,
            embeds: embeds,
        };
        await interaction.reply(botResponse);
    },
};
exports.default = SendColabGuides;
