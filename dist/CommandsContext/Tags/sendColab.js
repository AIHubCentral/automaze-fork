"use strict";
const { ApplicationCommandType, ContextMenuCommandBuilder, EmbedBuilder } = require('discord.js');
module.exports = {
    category: 'Tags',
    type: 'context-menu',
    data: new ContextMenuCommandBuilder()
        .setName('Send Colab links')
        .setType(ApplicationCommandType.User),
    async execute(interaction) {
        const { client, targetUser } = interaction;
        if (targetUser.bot)
            return await interaction.reply({ content: 'That user is a bot.', ephemeral: true });
        const { botData } = client;
        const embeds = [];
        const embedData = botData.embeds.colab.en;
        embedData.embeds.forEach(content => {
            const currentEmbed = new EmbedBuilder()
                .setTitle(content.title)
                .setDescription(content.description.join('\n'))
                .setColor(content.color ?? 'Yellow');
            embeds.push(currentEmbed);
        });
        const botResponse = { embeds: embeds };
        botResponse.content = embedData.mentionMessage.replace('$user', targetUser);
        await interaction.reply(botResponse);
    },
};
