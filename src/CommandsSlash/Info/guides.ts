import { Colors, SlashCommandBuilder } from 'discord.js';

import ExtendedClient from '../../Core/extendedClient';
import { ButtonData, EmbedData } from '../../Interfaces/BotData';
import { createButtons, createEmbed, createEmbeds, createStringOption } from '../../Utils/discordUtilities';
import { SlashCommand } from '../../Interfaces/Command';
import slashCommandData from '../../../JSON/slashCommandData.json';
import ms from 'pretty-ms';
import {
    getResourceData,
    handleSendRealtimeGuides,
    resourcesToUnorderedListAlt,
} from '../../Utils/botUtilities';
import i18next from '../../i18n';

interface Response {
    embed: EmbedData;
}

const commandData = slashCommandData.guides;

const Guides: SlashCommand = {
    category: 'Info',
    data: new SlashCommandBuilder()
        .setName(commandData.name)
        .setDescription(commandData.description)
        .setDescriptionLocalizations(commandData.descriptionLocalizations)
        .addStringOption(createStringOption(commandData.options.category))
        .addStringOption(createStringOption(commandData.options.language))
        .addBooleanOption((option) =>
            option
                .setName(commandData.options.private.name)
                .setNameLocalizations(commandData.options.private.nameLocalizations)
                .setDescription(commandData.options.private.description)
                .setDescriptionLocalizations(commandData.options.private.descriptionLocalizations)
        ),
    async execute(interaction) {
        const startTime = Date.now();

        const category = interaction.options.getString('category', true);
        const language = interaction.options.getString('language') ?? interaction.locale;
        const ephemeral = interaction.options.getBoolean('private') ?? false;

        const mainUser = interaction.user;

        const client = interaction.client as ExtendedClient;
        const { botCache, logger } = client;

        if (['pt', 'es', 'it'].includes(language)) {
            return await interaction.reply({
                content: i18next.t('general.translation_not_available', { lng: language }),
                ephemeral: true,
            });
        }

        if (category === 'audio') {
            const resources = await getResourceData('audio', botCache, logger);

            if (resources.length === 0) {
                await interaction.reply({
                    content: i18next.t('general.not_available', { lng: language }),
                    ephemeral: true,
                });
                return;
            }

            const embed = createEmbed(
                {
                    title: i18next.t('tags.audio.embed.title', { lng: language }),
                    description: [resourcesToUnorderedListAlt(resources)],
                    footer: i18next.t('tags.audio.embed.footer'),
                },
                Colors.Blue
            );

            logger.info(`sent guides with /${interaction.commandName}`, {
                guildId: interaction.guildId,
                channelId: interaction.channelId,
                params: {
                    category,
                    language,
                    ephemeral,
                },
                executionTime: ms(Date.now() - startTime),
            });

            return await interaction.reply({ embeds: [embed], ephemeral });
        } else if (category === 'paperspace') {
            const content = i18next.t('tags.paperspace', { lng: language, returnObjects: true }) as Response;
            const embed = createEmbed(content.embed, Colors.Blue);

            logger.info(`sent guides with /${interaction.commandName}`, {
                guildId: interaction.guildId,
                channelId: interaction.channelId,
                params: {
                    category,
                    language,
                    ephemeral,
                },
                executionTime: ms(Date.now() - startTime),
            });

            return await interaction.reply({ embeds: [embed], ephemeral });
        } else if (category === 'realtime') {
            await handleSendRealtimeGuides(interaction, undefined, mainUser, ephemeral);
            return;
        } else if (category === 'rvc') {
            const content = i18next.t('tags.rvc.embeds', {
                lng: language,
                returnObjects: true,
            }) as EmbedData[];
            const embeds = createEmbeds(content, [Colors.Aqua, Colors.Blue, Colors.DarkBlue]);

            logger.info(`sent guides with /${interaction.commandName}`, {
                guildId: interaction.guildId,
                channelId: interaction.channelId,
                params: {
                    category,
                    language,
                    ephemeral,
                },
                executionTime: ms(Date.now() - startTime),
            });

            return await interaction.reply({ embeds, ephemeral });
        } else if (category === 'uvr') {
            const content = i18next.t('tags.uvr', {
                lng: language,
                returnObjects: true,
            }) as { embed: EmbedData; buttons: ButtonData[] };

            logger.info(`sent guides with /${interaction.commandName}`, {
                guildId: interaction.guildId,
                channelId: interaction.channelId,
                params: {
                    category,
                    language,
                    ephemeral,
                },
                executionTime: ms(Date.now() - startTime),
            });

            return await interaction.reply({
                embeds: [createEmbed(content.embed)],
                components: [createButtons(content.buttons)],
                ephemeral,
            });
        }
    },
};

export default Guides;
