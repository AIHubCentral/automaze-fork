import {
    ApplicationCommandType,
    ColorResolvable,
    ContextMenuCommandBuilder,
    EmbedBuilder,
    InteractionReplyOptions,
} from 'discord.js';
import { ContextCommand } from '../../Interfaces/Command';
import ExtendedClient from '../../Core/extendedClient';
import { createEmbed } from '../../Utils/discordUtilities';
import { getResourceData, resourcesToUnorderedList } from '../../Utils/botUtilities';

const SendColabGuides: ContextCommand = {
    category: 'Tags',
    data: new ContextMenuCommandBuilder().setName('Send Colab links').setType(ApplicationCommandType.User),
    async execute(interaction) {
        const { targetUser } = interaction;
        if (targetUser.bot)
            return await interaction.reply({ content: 'That user is a bot.', ephemeral: true });

        const client = interaction.client as ExtendedClient;
        const { botCache, botData, logger } = client;

        const resources = await getResourceData('colab', botCache, logger);

        const embeds: EmbedBuilder[] = [];

        if (resources.length > 0) {
            embeds.push(
                createEmbed({
                    title: '☁️ Google Colabs',
                    color: 'f9ab00' as ColorResolvable,
                    description: [resourcesToUnorderedList(resources)],
                })
            );
        }

        let noticeEmbeds = botData.embeds.colab_notice.en.embeds;

        if (noticeEmbeds) {
            for (const embed of noticeEmbeds) {
                embeds.push(createEmbed(embed));
            }
        }

        const botResponse: InteractionReplyOptions = {
            content: `Colab suggestions for ${targetUser.toString()}`,
            embeds: embeds,
        };

        await interaction.reply(botResponse);
    },
};

export default SendColabGuides;
