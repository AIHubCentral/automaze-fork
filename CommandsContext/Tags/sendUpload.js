const { ApplicationCommandType, ContextMenuCommandBuilder } = require("discord.js");

module.exports = {
    category: `Tags`,
    type: `context-menu`,
    data: new ContextMenuCommandBuilder()
        .setName('Send upload guides')
        .setType(ApplicationCommandType.User)
    ,
    async execute(interaction) {
        const { client, targetUser } = interaction;
        if (targetUser.bot) return await interaction.reply({ content: 'That user is a bot.', ephemeral: true });

        const { botData, botUtils, botConfigs } = client;

        const embedData = botData.embeds.upload;
        embeds = botUtils.createEmbeds([embedData], botUtils.getAvailableColors(botConfigs));
        interaction.reply({ content: `Suggestion for ${targetUser}`, embeds: embeds });
    }
}
