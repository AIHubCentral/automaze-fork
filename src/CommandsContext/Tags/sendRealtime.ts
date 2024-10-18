import { ApplicationCommandType, ContextMenuCommandBuilder, ContextMenuCommandType } from 'discord.js';
import { ContextCommand } from '../../Interfaces/Command';
import ExtendedClient from '../../Core/extendedClient';
import i18next from '../../i18n';
import { handleSendRealtimeGuides } from '../../Utils/botUtilities';

const SendRealtimeGuides: ContextCommand = {
    category: 'Tags',
    data: new ContextMenuCommandBuilder()
        .setName('Send Realtime guides')
        .setType(ApplicationCommandType.User as ContextMenuCommandType),
    async execute(interaction) {
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

        await handleSendRealtimeGuides(interaction, targetUser, interaction.user);
    },
};

export default SendRealtimeGuides;
