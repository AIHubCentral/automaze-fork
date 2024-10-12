import { bold, channelMention, Colors, EmbedBuilder, SlashCommandBuilder, unorderedList } from 'discord.js';
import ExtendedClient from '../../Core/extendedClient';
import slashCommandData from '../../../JSON/slashCommandData.json';
import { SlashCommand } from '../../Interfaces/Command';

import i18next from 'i18next';
import { delay } from '../../Utils/generalUtilities';
import { getDisplayName } from '../../Utils/discordUtilities';

const commandData = slashCommandData.faq;

const Faq: SlashCommand = {
    category: 'Info',
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName(commandData.name)
        .setDescription(commandData.description)
        .setDescriptionLocalizations(commandData.descriptionLocalizations)
        .addStringOption((option) =>
            option
                .setName(commandData.options.topic.name)
                .setNameLocalizations(commandData.options.topic.nameLocalizations)
                .setDescription(commandData.options.topic.description)
                .setDescriptionLocalizations(commandData.options.topic.descriptionLocalizations)
                .setAutocomplete(true)
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName(commandData.options.language.name)
                .setNameLocalizations(commandData.options.language.nameLocalizations)
                .setDescription(commandData.options.language.description)
                .setDescriptionLocalizations(commandData.options.language.descriptionLocalizations)
                .addChoices(commandData.options.language.choices)
                .setRequired(false)
        )
        .addBooleanOption((option) =>
            option
                .setName(commandData.options.private.name)
                .setNameLocalizations(commandData.options.private.nameLocalizations)
                .setDescription(commandData.options.private.description)
                .setDescriptionLocalizations(commandData.options.private.descriptionLocalizations)
                .setRequired(false)
        ),
    async autocomplete(interaction) {
        const topic = interaction.options.getString('topic', true);
        const allTopics = i18next.t('faq.topics', { returnObjects: true });
        const suggestions = Object.keys(allTopics).filter((topicItem) =>
            topicItem.toLowerCase().includes(topic.toLowerCase().trim())
        );
        await interaction.respond(suggestions.map((suggestion) => ({ name: suggestion, value: suggestion })));
    },
    async execute(interaction) {
        const topic = interaction.options.getString('topic', true);
        const language = interaction.options.getString('language') || '';
        const ephemeral = interaction.options.getBoolean('private') || false;

        if (language !== '' && language !== 'en') {
            return await interaction.reply({
                content: i18next.t('faq.translation_not_available', { lng: language }),
                ephemeral: true,
            });
        }

        const client = interaction.client as ExtendedClient;
        const { logger } = client;

        const logData = {
            guildId: interaction.guildId || '',
            channelId: interaction.channelId,
            commandParams: {
                topic,
                language,
                ephemeral,
            },
        };

        // TODO: get the language from the user locale if it's an empty string

        const response = i18next.t(`faq.topics.${topic}`, { lng: language });

        if (response.startsWith('faq.')) {
            await interaction.deferReply({ ephemeral: ephemeral });
            await delay(3_000);

            const displayName = await getDisplayName(interaction.user, interaction.guild);

            const textResponse = i18next.t('faq.unknown.message', {
                user: bold(displayName),
                lng: language,
            });

            const embedTitle = i18next.t('faq.unknown.embedData.title', {
                lng: language,
            });

            const channelIds = client.discordIDs.Channel;

            const embedDescription = i18next.t('faq.unknown.embedData.description', {
                lng: language,
                returnObjects: true,
                okadaChannel: channelMention(channelIds.HelpWOkada),
                helpChannel: channelMention(channelIds.HelpRVC),
                helpAiArtChannel: channelMention(channelIds.HelpAiArt),
            }) as Array<string>;

            await interaction.editReply({
                content: textResponse + ' 😭' + '\n',
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`✍ ${embedTitle}`)
                        .setColor(Colors.DarkAqua)
                        .setDescription(unorderedList(embedDescription)),
                ],
            });

            logger.warn("Couldn't find topic", logData);

            return;
        }

        await interaction.reply({
            embeds: [new EmbedBuilder().setDescription(response).setColor(Colors.Blurple)],
            ephemeral,
        });

        logger.info('FAQ sent by slash command', logData);
    },
};

export default Faq;
