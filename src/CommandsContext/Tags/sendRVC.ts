import {
    ApplicationCommandType,
    ContextMenuCommandBuilder,
    ContextMenuCommandType,
    DiscordAPIError,
    InteractionReplyOptions,
} from 'discord.js';
import { ContextCommand } from '../../Interfaces/Command';
import ExtendedClient from '../../Core/extendedClient';
import { createEmbeds, getAvailableColors, handleDiscordError } from '../../Utils/discordUtilities';
import { EmbedData } from '../../Interfaces/BotData';
import i18next from '../../i18n';
import ms from 'pretty-ms';

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

        const { botConfigs } = client;

        const availableColors = getAvailableColors(botConfigs);

        const content = i18next.t('tags.rvc.embeds', { returnObjects: true }) as EmbedData[];

        const startTime = Date.now();
        try {
            const botResponse: InteractionReplyOptions = {
                content: `Hello, ${targetUser}! Here are some recommended resources for you!`,
                embeds: createEmbeds(content, availableColors),
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
