import { Message } from "discord.js";
import IEventData from "../../Interfaces/Events";

/* Checks when a non model master sends a message in a model request thread */
const WriteComission: IEventData = {
    name: "messageCreate",
    once: false,
    async run(client, message: Message) {
        if (message.guildId != client.discordIDs.Guild) return;
        if (!client.botConfigs.commissions.deleteMessages) return;
        if (message.author.bot) return;

        try {
            const guild = message.guild;
            if (!guild) return;

            const channel = message.channel;
            if (!channel.isThread()) return;
            if (channel.parentId != client.discordIDs.Forum.RequestModel.ID) return;
            if (!(channel.appliedTags.find(tag => tag == client.discordIDs.Forum.RequestModel.Tags.Paid))) return;
            if (channel.ownerId == message.author.id) return;

            // Check if user has permission to write
            let isAllowedToWrite = false;

            const user = guild.members.cache.get(message.author.id);
            if (!user) return;

            let userRoles = user.roles.cache;

            let allowedRoleIDs = client.discordIDs.Forum.RequestModel.ComissionAllow;
            for (let roleId of allowedRoleIDs) {
                if (userRoles.find(role => role.id == client.discordIDs.Roles[roleId])) {
                    isAllowedToWrite = true;
                    break;
                }
            }

            // Remove user message if not allowed replying to the thread
            if (!isAllowedToWrite) await message.delete();

            client.logger.info('Deleted non model master message on model comission', {
                more: {
                    guildId: message.guildId,
                    channelId: message.channelId,
                }
            })

        } catch (error) {
            client.logger.error('Error checking message on comission', error, {
                more: {
                    guildId: message.guildId,
                    channelId: message.channelId,
                }
            });
        }
    }
}

export default WriteComission;