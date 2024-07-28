import { ApplicationCommandType, ContextMenuCommandBuilder, InteractionReplyOptions } from "discord.js";
import { ContextCommand } from "../../Interfaces/Command";
import ExtendedClient from "../../Core/extendedClient";
import { createEmbeds, getAvailableColors } from "../../Utils/discordUtilities";

const SendRVCGuides: ContextCommand = {
    category: 'Tags',
    data: new ContextMenuCommandBuilder()
        .setName('Send RVC guides')
        .setType(ApplicationCommandType.User)
    ,
    async execute(interaction) {
        const { targetUser } = interaction;
        if (targetUser.bot) return await interaction.reply({ content: 'That user is a bot.', ephemeral: true });

        const client = interaction.client as ExtendedClient;
        const { botData, botConfigs } = client;

        const availableColors = getAvailableColors(botConfigs);

        const guides = botData.embeds.rvc.en;

        if (!guides.embeds) return;

        let botResponse: InteractionReplyOptions = {
            content: `Hello, ${targetUser}! Here are some recommended resources for you!`,
            embeds: createEmbeds(guides.embeds, availableColors),
        };

        interaction.reply(botResponse);
    }
}

export default SendRVCGuides;