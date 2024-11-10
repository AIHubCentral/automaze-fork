import { SlashCommandBuilder } from 'discord.js';
import { BananManager, sendErrorLog } from '../../Utils/botUtilities.js';
import { SlashCommand } from '../../Interfaces/Command.js';
import ExtendedClient from '../../Core/extendedClient.js';
import knexInstance from '../../db.js';
import i18next from 'i18next';
import { getDisplayName } from '../../Utils/discordUtilities.js';

const Banana: SlashCommand = {
    category: 'Fun',
    data: new SlashCommandBuilder()
        .setName('banana')
        .setDescription('BANAN SOMEOME!!!!11!111!11')
        .addUserOption((option) => option.setName('user').setDescription('User to banan').setRequired(true)),
    async execute(interaction) {
        const client = interaction.client as ExtendedClient;
        const targetUser = interaction.options.getUser('user', true);

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
            await interaction.editReply({ content: 'Failed to banan user' });
            await sendErrorLog(client, error, {
                command: `/${interaction.commandName}`,
                message: 'failed to banan',
                guildId: interaction.guildId ?? '',
                channelId: interaction.channelId,
            });
        }
    },
};

export default Banana;
