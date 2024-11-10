import { APIEmbed, Colors, SlashCommandBuilder } from 'discord.js';

import ExtendedClient from '../../Core/extendedClient';
import { ButtonData, EmbedData } from '../../Interfaces/BotData';
import {
    ColorThemes,
    createButtons,
    createEmbed,
    createStringOption,
    createThemedEmbeds,
} from '../../Utils/discordUtilities';
import { SlashCommand } from '../../Interfaces/Command';
import slashCommandData from '../../../JSON/slashCommandData.json';
import ms from 'pretty-ms';
import {
    getResourceData,
    handleSendRealtimeGuides,
    resourcesToUnorderedListAlt,
    sendErrorLog,
} from '../../Utils/botUtilities';
import i18next from '../../i18n';
import { ISettings } from '../../Services/settingsService';

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

        try {
            if (category === 'audio' || category === 'local') {
                const resources = await getResourceData(category, botCache, logger);

                if (resources.length === 0) {
                    await interaction.reply({
                        content: i18next.t('general.not_available', { lng: language }),
                        ephemeral: true,
                    });
                    return;
                }

                const embed = createEmbed(
                    {
                        title:
                            i18next.t(`common.emojis.${category === 'local' ? 'laptop' : 'book'}`) +
                            ' ' +
                            i18next.t(`tags.${category}.embed.title`, { lng: language }),
                        description: [resourcesToUnorderedListAlt(resources, language)],
                        footer: i18next.t(`tags.${category}.embed.footer`, { lng: language }),
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
            } else if (category === 'realtime') {
                await handleSendRealtimeGuides(interaction, undefined, mainUser, ephemeral, language);
                return;
            } else if (category === 'rvc') {
                const content = i18next.t('tags.rvc.embeds', {
                    lng: language,
                    returnObjects: true,
                }) as EmbedData[];

                let selectedTheme: string | null = null;
                const settings = client.botCache.get('main_settings') as ISettings;
                if (!settings) {
                    selectedTheme = ColorThemes.Default;
                } else {
                    selectedTheme = settings.theme;
                }

                const apiEmbedData: APIEmbed[] = content.map((item) => {
                    return {
                        title: item.title,
                        description: item.description?.join('\n'),
                    };
                });

                const embeds = createThemedEmbeds(apiEmbedData, selectedTheme as ColorThemes);

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
        } catch (error) {
            await sendErrorLog(client, error, {
                command: `/${interaction.commandName}`,
                message: 'Failure on /guides',
                guildId: interaction.guildId ?? '',
                channelId: interaction.channelId,
            });
        }
    },
};

export default Guides;
