/* context menu version of /banana */
import {
    ApplicationCommandType,
    ContextMenuCommandBuilder,
    ContextMenuCommandType,
    DiscordAPIError,
    Guild,
    GuildMember,
} from 'discord.js';
import { ContextCommand } from '../../Interfaces/Command';
import ExtendedClient from '../../Core/extendedClient';
import { banan } from '../../Utils/botUtilities';
import i18next from '../../i18n';
import { handleDiscordError } from '../../Utils/discordUtilities';
import ms from 'pretty-ms';

const Banan: ContextCommand = {
    category: 'Fun',
    data: new ContextMenuCommandBuilder()
        .setName('banan')
        .setType(ApplicationCommandType.User as ContextMenuCommandType),
    async execute(interaction) {
        const client = <ExtendedClient>interaction.client;
        const targetUser = interaction.targetUser;

        const logData = {
            guildId: interaction.guildId,
            channelId: interaction.channelId,
            commandName: interaction.commandName,
            executionTime: '',
        };

        if (!interaction.guild) {
            client.logger.warn(`failed to get guild info`, logData);
            return await interaction.reply({
                content: i18next.t('general.failed_retrieving_guild'),
                ephemeral: true,
            });
        }

        const startTime = Date.now();

        try {
            const guildMember = await getGuildMember(interaction.guild, targetUser.id);

            if (!guildMember) {
                client.logger.warn(`Guild member ${targetUser.id} not found`, logData);
                return await interaction.reply({
                    content: i18next.t('banan.failed_fetching_user'),
                    ephemeral: true,
                });
            }

            await banan(interaction, targetUser, guildMember);
        } catch (error) {
            if (error instanceof DiscordAPIError) {
                handleDiscordError(client.logger, error as DiscordAPIError);
            }
        } finally {
            const executionTime = Date.now() - startTime;
            logData.executionTime = ms(executionTime);
            client.logger.info("banan'd user", logData);
        }
    },
};

export default Banan;

async function getGuildMember(guild: Guild, userId: string): Promise<GuildMember | undefined> {
    let guildMember = guild.members.cache.get(userId);
    if (!guildMember) {
        guildMember = await guild.members.fetch(userId);
    }
    return guildMember;
}
