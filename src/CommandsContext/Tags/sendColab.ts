import { ApplicationCommandType, ContextMenuCommandBuilder, EmbedBuilder, InteractionReplyOptions } from 'discord.js';
import { ContextCommand } from '../../Interfaces/Command';
import ExtendedClient from '../../Core/extendedClient';
import { createEmbed } from '../../Utils/discordUtilities';

const SendColabGuides: ContextCommand = {
    category: 'Tags',
    type: 'context-menu',
    data: new ContextMenuCommandBuilder()
        .setName('Send Colab links')
        .setType(ApplicationCommandType.User),
    async execute(interaction) {
        const { client, targetUser } = interaction;

        if (targetUser.bot) return await interaction.reply({ content: 'That user is a bot.', ephemeral: true });

        const { botData } = client as ExtendedClient;

        const embeds: EmbedBuilder[] = [];

        const embedData = botData.embeds.colab.en;

        embedData.embeds?.forEach(content => {
            embeds.push(createEmbed(content));
        });

        const botResponse: InteractionReplyOptions = { embeds: embeds };

        if (embedData.mentionMessage) {
            botResponse.content = embedData.mentionMessage.replace('$user', targetUser.toString());
        }

        await interaction.reply(botResponse);
    },
};

export default SendColabGuides;