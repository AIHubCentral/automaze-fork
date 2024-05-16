"use strict";
const { ApplicationCommandType, ContextMenuCommandBuilder } = require("discord.js");
module.exports = {
    category: `Tags`,
    type: `context-menu`,
    data: new ContextMenuCommandBuilder()
        .setName('Send RVC guides')
        .setType(ApplicationCommandType.User),
    async execute(interaction) {
        const { client, targetUser } = interaction;
        const { discordIDs } = interaction.client;
        if (targetUser.bot)
            return await interaction.reply({ content: 'That user is a bot.', ephemeral: true });
        const { botData, botUtils, botConfigs } = client;
        const availableColors = botUtils.getAvailableColors(botConfigs);
        let botResponse = {};
        switch (interaction.channelId) {
            case discordIDs.Channel.Italiano:
                botResponse.content = `Ciao ${targetUser}, ecco alcune risorse utili consigliate per te`;
                botResponse.embeds = botUtils.createEmbeds(botData.embeds.guides.rvc.it, availableColors);
                break;
            default:
                botResponse.content = `Hello, ${targetUser}! Here are some recommended resources for you to learn.`;
                botResponse.embeds = botUtils.createEmbeds(botData.embeds.guides.rvc.en, availableColors);
        }
        interaction.reply(botResponse);
    }
};
