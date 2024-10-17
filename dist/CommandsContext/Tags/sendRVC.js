"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const discordUtilities_1 = require("../../Utils/discordUtilities");
const SendRVCGuides = {
    category: 'Tags',
    data: new discord_js_1.ContextMenuCommandBuilder()
        .setName('Send RVC guides')
        .setType(discord_js_1.ApplicationCommandType.User),
    async execute(interaction) {
        const { targetUser } = interaction;
        if (targetUser.bot)
            return await interaction.reply({ content: 'That user is a bot.', ephemeral: true });
        const client = interaction.client;
        const { botData, botConfigs } = client;
        const availableColors = (0, discordUtilities_1.getAvailableColors)(botConfigs);
        const guides = botData.embeds.rvc.en;
        if (!guides.embeds)
            return;
        const botResponse = {
            content: `Hello, ${targetUser}! Here are some recommended resources for you!`,
            embeds: (0, discordUtilities_1.createEmbeds)(guides.embeds, availableColors),
        };
        interaction.reply(botResponse);
    },
};
exports.default = SendRVCGuides;
