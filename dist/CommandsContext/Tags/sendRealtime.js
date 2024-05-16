"use strict";
const { ApplicationCommandType, ContextMenuCommandBuilder } = require("discord.js");
module.exports = {
    category: `Tags`,
    type: `context-menu`,
    data: new ContextMenuCommandBuilder()
        .setName('Send Realtime guides')
        .setType(ApplicationCommandType.User),
    async execute(interaction) {
        const { client, targetUser } = interaction;
        if (targetUser.bot)
            return await interaction.reply({ content: 'That user is a bot.', ephemeral: true });
        const { botData, botUtils, botConfigs } = client;
        const targetChannelId = client.discordIDs.Channel.HelpWOkada;
        const targetChannel = interaction.guild.channels.cache.get(targetChannelId) ?? '"help-w-okada" channel';
        const embedData = botData.embeds.realtime.en;
        // insert the link to the channel in $channel
        const lastDescriptionIndex = embedData.description.length - 1;
        const lastDescriptionText = embedData.description[lastDescriptionIndex];
        embedData.description[lastDescriptionIndex] = lastDescriptionText.replace('$channel', targetChannel);
        embeds = botUtils.createEmbeds([embedData], botUtils.getAvailableColors(botConfigs));
        interaction.reply({ content: `Suggestions for ${targetUser}`, embeds: embeds });
    }
};
