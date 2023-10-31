const { ApplicationCommandType, ContextMenuCommandBuilder } = require("discord.js");

module.exports = {
    category: `Tags`,
    type: `context-menu`,
    data: new ContextMenuCommandBuilder()
        .setName('Send RVC guides')
        .setType(ApplicationCommandType.User)
    ,
    async execute(interaction) {
        const { client, targetUser } = interaction;
        if (targetUser.bot) return await interaction.reply({ content: 'That user is a bot.', ephemeral: true });

        const { botData, botUtils, botConfigs } = client;

        let embedData = botData.embeds.rvc.main;
        embeds = botUtils.createEmbeds([embedData], botUtils.getAvailableColors(botConfigs));
        let messageContent = 'Here are some useful resources to help you learn how to make ai covers';
        interaction.reply({ content: `Hey, ${targetUser}!\n\n👇 ${messageContent}`, embeds: embeds });
    }
}
