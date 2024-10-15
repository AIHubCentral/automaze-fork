"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const discordUtilities_1 = require("../../Utils/discordUtilities");
/* Checks when a non model master sends a message in a model request thread */
const WriteComission = {
    name: 'messageCreate',
    once: false,
    async run(client, message) {
        if (message.guildId != client.discordIDs.Guild)
            return;
        if (!client.botConfigs.commissions.deleteMessages)
            return;
        if (message.author.bot)
            return;
        const guild = message.guild;
        if (!guild)
            return;
        const channel = message.channel;
        if (!channel.isThread())
            return;
        if (channel.parentId != client.discordIDs.Forum.RequestModel.ID)
            return;
        if (!channel.appliedTags.find((tag) => tag == client.discordIDs.Forum.RequestModel.Tags.Paid))
            return;
        if (channel.ownerId == message.author.id)
            return;
        // Check if user has permission to write
        let isAllowedToWrite = false;
        const user = guild.members.cache.get(message.author.id);
        if (!user)
            return;
        const userRoles = user.roles.cache;
        const allowedRoleIDs = client.discordIDs.Forum.RequestModel.ComissionAllow;
        for (const roleId of allowedRoleIDs) {
            if (userRoles.find((role) => role.id == client.discordIDs.Roles[roleId])) {
                isAllowedToWrite = true;
                break;
            }
        }
        // Remove user message if not allowed replying to the thread
        if (!isAllowedToWrite)
            await deleteMessage(client, message);
    },
};
exports.default = WriteComission;
async function deleteMessage(client, message) {
    try {
        await message.delete();
        const currentChannel = message.channel;
        client.logger.info('Deleted non model master message on model comission', {
            guildId: message.guildId,
            channelId: currentChannel.id,
            channelName: currentChannel.name,
        });
    }
    catch (error) {
        if (error instanceof discord_js_1.DiscordAPIError) {
            (0, discordUtilities_1.handleDiscordError)(client.logger, error);
        }
    }
}
