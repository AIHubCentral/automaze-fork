"use strict";
const { EmbedBuilder } = require("discord.js");
module.exports = {
    name: 'voting',
    category: 'Utilities',
    description: 'Only usable by helpers+. Adds the voting embed to a thread.',
    aliases: ['vote'],
    syntax: 'voting',
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
     * @param {String} prefix
     */
    run: async (client, message, args, prefix) => {
        if (!message.channel.isThread())
            return;
        // which channel the command can be used
        const allowedChannelIds = [client.discordIDs.Forum.TaskSTAFF, client.discordIDs.Forum.Suggestions];
        if (!allowedChannelIds.includes(message.channel.parent.id))
            return;
        // which user can use the command based on their roles
        const allowedRoleIds = [
            client.discordIDs.Roles.Admin,
            client.discordIDs.Roles.Mod,
            client.discordIDs.Roles.Helper,
        ];
        let userAllowed = false;
        const userRoles = message.member.roles.cache;
        for (const roleId of allowedRoleIds) {
            if (userRoles.has(roleId)) {
                userAllowed = true;
            }
        }
        if (!userAllowed)
            return;
        // choose the right message (defaults to 'Vote for this suggestion!')
        let embedTitle = 'Vote for this ';
        if (message.channel.parent.id == allowedChannelIds[0]) {
            embedTitle += 'task';
        }
        else {
            embedTitle += 'suggestion';
        }
        embedTitle += '!';
        // don't add voting if there are already more than 2 messages
        if (message.channel.messageCount > 2)
            return;
        // delete the command message (-vote)
        await message.delete();
        // create the embed, send it and add the reactions
        const votingEmbed = new EmbedBuilder()
            .setTitle(embedTitle)
            .setColor(client.botConfigs.colors.theme.primary);
        const botResponse = await message.channel.send({ embeds: [votingEmbed] });
        await Promise.all([
            botResponse.react(`🔼`),
            botResponse.react(`🔽`)
        ]);
    }
};
