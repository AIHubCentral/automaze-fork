import {
    ApplicationCommandType,
    ContextMenuCommandType,
    Colors,
    ContextMenuCommandBuilder,
    EmbedBuilder,
    unorderedList,
    DiscordAPIError,
} from 'discord.js';
import { ContextCommand } from '../../Interfaces/Command';
import ExtendedClient from '../../Core/extendedClient';
import i18next from 'i18next';
import { handleDiscordError } from '../../Utils/discordUtilities';
import ms from 'pretty-ms';

const SendHelp: ContextCommand = {
    category: 'Tags',
    data: new ContextMenuCommandBuilder()
        .setName('Send help')
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

        const embedDescription = i18next.t('faq.unknown.embedData.description', {
            returnObjects: true,
        }) as Array<string>;

        const startTime = Date.now();

        try {
            await interaction.reply({
                content: i18next.t('general.suggestions_for_user', { userId: targetUser.id }),
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`✍ Things you can try`)
                        .setColor(Colors.Greyple)
                        .setDescription(unorderedList(embedDescription)),
                ],
            });
        } catch (error) {
            if (error instanceof DiscordAPIError) {
                handleDiscordError(client.logger, error as DiscordAPIError);
            }
        } finally {
            const executionTime = Date.now() - startTime;
            logData.executionTime = ms(executionTime);
            client.logger.info('sent help with a context command', logData);
        }
    },
};

export default SendHelp;
