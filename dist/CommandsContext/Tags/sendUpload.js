"use strict";
const { ApplicationCommandType, ContextMenuCommandBuilder } = require('discord.js');
const { LanguageResponseSender } = require('../../utils');
module.exports = {
    category: 'Tags',
    type: 'context-menu',
    data: new ContextMenuCommandBuilder()
        .setName('Send upload guides')
        .setType(ApplicationCommandType.User),
    async execute(interaction) {
        const { client, targetUser } = interaction;
        if (targetUser.bot)
            return await interaction.reply({ content: 'That user is a bot.', ephemeral: true });
        const { botData, botConfigs, discordIDs } = client;
        const sender = new LanguageResponseSender(botConfigs, discordIDs.Channel);
        sender.setTargetMessage(interaction);
        sender.setContent(botData.embeds.guides.upload);
        sender.setTargetUser(targetUser);
        await sender.send();
    },
};
