"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const discordUtilities_1 = require("../../Utils/discordUtilities");
const SendUploadGuides = {
    category: 'Tags',
    type: 'context-menu',
    data: new discord_js_1.ContextMenuCommandBuilder()
        .setName('Send upload guides')
        .setType(discord_js_1.ApplicationCommandType.User),
    async execute(interaction) {
        const { targetUser } = interaction;
        if (targetUser.bot)
            return await interaction.reply({ content: 'That user is a bot.', ephemeral: true });
        const client = interaction.client;
        const { botData, botConfigs } = client;
        const guides = botData.embeds.upload.en;
        if (!guides.embeds)
            return await interaction.reply({ content: 'This guide is not available anymore.', ephemeral: true });
        await interaction.reply({ embeds: (0, discordUtilities_1.createEmbeds)(guides.embeds, (0, discordUtilities_1.getAvailableColors)(botConfigs)) });
    },
};
exports.default = SendUploadGuides;
