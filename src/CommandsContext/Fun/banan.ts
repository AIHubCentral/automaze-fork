/* context menu version of /banana */
import { ApplicationCommandType, ContextMenuCommandBuilder, ContextMenuCommandType } from 'discord.js';
import { ContextCommand } from '../../Interfaces/Command';
import ExtendedClient from '../../Core/extendedClient';
import i18next from '../../i18n';
import { getDisplayName } from '../../Utils/discordUtilities';
import knexInstance from '../../db';
import { BananManager } from '../../Utils/botUtilities';

const Banan: ContextCommand = {
    category: 'Fun',
    data: new ContextMenuCommandBuilder()
        .setName('banan')
        .setType(ApplicationCommandType.User as ContextMenuCommandType),
    async execute(interaction) {
        const client = interaction.client as ExtendedClient;
        const targetUser = interaction.targetUser;

        if (targetUser.bot) {
            await interaction.reply({
                content: i18next.t('general.bot_user', { lng: interaction.locale }),
                ephemeral: true,
            });
            return;
        }

        const bananManager = new BananManager(knexInstance, interaction.user.id, client.cooldowns.banana);

        if (bananManager.isAuthorOnCooldown() && !bananManager.isCooldownExpired()) {
            await interaction.reply(
                `dumbass yuo alredy banan ppl, wait GRRRRRRRRRRRRRRR!!!!!!!!!!!!!!!!!!!!!!!! yu gto ${client.cooldowns.banana.get(interaction.user.id) - Date.now()} milliseconds left im too lazy to do math do it yourself GRRRRRRRRRR`
            );
            return;
        }

        await interaction.deferReply();

        const targetUserDisplayName = await getDisplayName(targetUser, interaction.guild);

        try {
            const embed = await bananManager.banan({
                id: targetUser.id,
                username: targetUser.username,
                display_name: targetUserDisplayName === targetUser.username ? '' : targetUserDisplayName,
            });
            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            client.logger.error('failed to banan', error);
            await interaction.editReply({ content: 'Failed to banan user' });
        }
    },
};

export default Banan;
