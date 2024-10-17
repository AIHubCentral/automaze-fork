import {
    ApplicationCommandType,
    ContextMenuCommandType,
    channelMention,
    Colors,
    ContextMenuCommandBuilder,
    EmbedBuilder,
    unorderedList,
    userMention,
} from 'discord.js';
import { ContextCommand } from '../../Interfaces/Command';
import ExtendedClient from '../../Core/extendedClient';
import i18next from 'i18next';

const SendHelp: ContextCommand = {
    category: 'Tags',
    data: new ContextMenuCommandBuilder()
        .setName('Send help')
        .setType(ApplicationCommandType.User as ContextMenuCommandType),
    async execute(interaction) {
        const { targetUser } = interaction;
        if (targetUser.bot)
            return await interaction.reply({ content: 'That user is a bot.', ephemeral: true });

        const client = interaction.client as ExtendedClient;

        const embedTitle = 'Things you can try';

        const channelIds = client.discordIDs.Channel;

        const embedDescription = i18next.t('faq.unknown.embedData.description', {
            returnObjects: true,
            okadaChannel: channelMention(channelIds.HelpWOkada),
            helpChannel: channelMention(channelIds.HelpRVC),
            helpAiArtChannel: channelMention(channelIds.HelpAiArt),
        }) as Array<string>;

        await interaction.reply({
            content: 'Suggestions for' + userMention(targetUser.id) + '\n',
            embeds: [
                new EmbedBuilder()
                    .setTitle(`✍ ${embedTitle}`)
                    .setColor(Colors.DarkAqua)
                    .setDescription(unorderedList(embedDescription)),
            ],
        });
    },
};

export default SendHelp;
