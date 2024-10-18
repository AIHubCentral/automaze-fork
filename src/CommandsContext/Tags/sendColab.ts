import {
    ApplicationCommandType,
    ColorResolvable,
    ContextMenuCommandBuilder,
    ContextMenuCommandType,
    DiscordAPIError,
} from 'discord.js';
import { ContextCommand } from '../../Interfaces/Command';
import ExtendedClient from '../../Core/extendedClient';
import { createEmbed, handleDiscordError } from '../../Utils/discordUtilities';
import { getResourceData, resourcesToUnorderedList } from '../../Utils/botUtilities';
import i18next from '../../i18n';
import ms from 'pretty-ms';

const SendColabLinks: ContextCommand = {
    category: 'Tags',
    data: new ContextMenuCommandBuilder()
        .setName('Send Colab links')
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
        const { botCache, logger } = client;

        if (targetUser.bot) {
            logger.warn(`tried sending ${interaction.commandName} to a bot user`);
            return await interaction.reply({
                content: i18next.t('general.bot_user', { lng: interaction.locale }),
                ephemeral: true,
            });
        }

        const resources = await getResourceData('colab', botCache, logger);

        if (resources.length === 0) {
            await interaction.reply({
                content: i18next.t('general.not_available', { lng: interaction.locale }),
                ephemeral: true,
            });
            return;
        }

        const startTime = Date.now();
        try {
            await interaction.reply({
                content: i18next.t('general.suggestions_for_user', { userId: targetUser.id }),
                embeds: [
                    createEmbed({
                        title: i18next.t('tags.colab.embed.title'),
                        color: 'f9ab00' as ColorResolvable,
                        description: [resourcesToUnorderedList(resources)],
                    }),
                    createEmbed({
                        title: i18next.t('tags.colab.notice.embed.title'),
                        description: [i18next.t('tags.colab.notice.embed.description')],
                        footer: i18next.t('tags.colab.embed.footer'),
                    }),
                ],
            });
        } catch (error) {
            if (error instanceof DiscordAPIError) {
                handleDiscordError(client.logger, error as DiscordAPIError);
            }
        } finally {
            const executionTime = Date.now() - startTime;
            logData.executionTime = ms(executionTime);
            client.logger.info('sent colab links', logData);
        }
    },
};

export default SendColabLinks;
