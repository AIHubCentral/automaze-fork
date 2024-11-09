import { DiscordAPIError, Message, TextChannel } from 'discord.js';
import IEventData from '../../Interfaces/Events';
import ExtendedClient from '../../Core/extendedClient';
import { handleDiscordError } from '../../Utils/discordUtilities';
import { ISettings } from '../../Services/settingsService';

/* Checks when a non model master sends a message in a model request thread */
const WriteComission: IEventData = {
    name: 'messageCreate',
    once: false,
    async run(client, message: Message) {
        if (message.author.bot) return;
        if (message.guildId != client.discordIDs.Guild) return;

        // only delete if settings allows it
        if (!client.botCache.has('settings')) return;
        const settings = client.botCache.get('settings') as ISettings;
        if (!settings.delete_messages) return;

        const guild = message.guild;
        if (!guild) return;

        const channel = message.channel;
        if (!channel.isThread()) return;
        if (channel.parentId != client.discordIDs.Forum.RequestModel.ID) return;
        if (!channel.appliedTags.find((tag) => tag == client.discordIDs.Forum.RequestModel.Tags.Paid)) return;
        if (channel.ownerId == message.author.id) return;

        // Check if user has permission to write
        let isAllowedToWrite = false;

        const user = guild.members.cache.get(message.author.id);
        if (!user) return;

        const userRoles = user.roles.cache;

        const allowedRoleIDs = client.discordIDs.Forum.RequestModel.ComissionAllow;
        for (const roleId of allowedRoleIDs) {
            if (userRoles.find((role) => role.id == client.discordIDs.Roles[roleId])) {
                isAllowedToWrite = true;
                break;
            }
        }

        // Remove user message if not allowed replying to the thread
        if (!isAllowedToWrite) await deleteMessage(client, message);
    },
};

export default WriteComission;

async function deleteMessage(client: ExtendedClient, message: Message) {
    try {
        await message.delete();
        const currentChannel = message.channel as TextChannel;
        client.logger.info('Deleted non model master message on model comission', {
            guildId: message.guildId,
            channelId: currentChannel.id,
            channelName: currentChannel.name,
        });
    } catch (error) {
        if (error instanceof DiscordAPIError) {
            handleDiscordError(client.logger, error);
        }
    }
}
