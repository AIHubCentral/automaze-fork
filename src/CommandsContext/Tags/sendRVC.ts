import {
    APIEmbed,
    ApplicationCommandType,
    ContextMenuCommandBuilder,
    ContextMenuCommandType,
    DiscordAPIError,
    InteractionReplyOptions,
} from 'discord.js';
import { ContextCommand } from '../../Interfaces/Command';
import ExtendedClient from '../../Core/extendedClient';
import { ColorThemes, createThemedEmbeds, handleDiscordError } from '../../Utils/discordUtilities';
import { EmbedData } from '../../Interfaces/BotData';
import i18next from '../../i18n';
import ms from 'pretty-ms';
import { ISettings } from '../../Services/settingsService';

const SendRVCGuides: ContextCommand = {
    category: 'Tags',
    data: new ContextMenuCommandBuilder()
        .setName('Send RVC guides')
        .setType(ApplicationCommandType.User as ContextMenuCommandType),
    async execute(interaction) {
        const logData = {
            guildId: interaction.guildId,
            channelId: interaction.channelId,
            commandName: interaction.commandName,
            executionTime: '',
        };

        const client = interaction.client as ExtendedClient;

        const { targetUser } = interaction;
        const { logger } = client;

        if (targetUser.bot) {
            logger.warn(`tried sending ${interaction.commandName} to a bot user`);
            return await interaction.reply({
                content: i18next.t('general.bot_user', { lng: interaction.locale }),
                ephemeral: true,
            });
        }

        const content = i18next.t('tags.rvc.embeds', { returnObjects: true }) as EmbedData[];

        const startTime = Date.now();
        try {
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

            const botResponse: InteractionReplyOptions = {
                content: `Hello, ${targetUser}! Here are some recommended resources for you!`,
                embeds: createThemedEmbeds(apiEmbedData, selectedTheme as ColorThemes),
            };

            interaction.reply(botResponse);
        } catch (error) {
            if (error instanceof DiscordAPIError) {
                handleDiscordError(client.logger, error as DiscordAPIError);
            }
        } finally {
            const executionTime = Date.now() - startTime;
            logData.executionTime = ms(executionTime);
            client.logger.info('sent rvc guides with a context command', logData);
        }
    },
};

export default SendRVCGuides;
