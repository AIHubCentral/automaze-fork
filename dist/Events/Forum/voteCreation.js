"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const generalUtilities_1 = require("../../Utils/generalUtilities");
const discordUtilities_1 = require("../../Utils/discordUtilities");
const VoteCreation = {
    name: discord_js_1.Events.ThreadCreate,
    once: false,
    async run(client, thread, newlyCreated) {
        const logData = {
            more: {
                threadId: thread.id,
                parentId: thread.parentId,
                guildId: thread.guildId,
            },
        };
        try {
            let embedMessages = {
                //[client.discordIDs.Forum.Suggestions]: "Vote for this suggestion!",
                [client.discordIDs.Forum.TaskSTAFF]: 'Vote for this task!',
            };
            if (!newlyCreated)
                return;
            if (thread.guildId != client.discordIDs.Guild)
                return;
            if (!thread.parentId)
                return;
            if (!embedMessages[thread.parentId])
                return;
            const voteEmbed = (0, discordUtilities_1.createEmbed)({
                title: embedMessages[thread.parentId],
                color: client.botConfigs.colors.theme.primary,
            });
            // Check if the thread was created successfully
            await (0, generalUtilities_1.delay)(2_000);
            if (!thread.guild.channels.cache.get(thread.id))
                return;
            // Create reactions
            const message = await thread.send({ embeds: [voteEmbed] });
            await Promise.all([message.react(`🔼`), message.react(`🔽`)]);
            client.logger.debug('Added voting embed', logData);
        }
        catch (error) {
            client.logger.error('Failed to add voting embed', error, logData);
        }
    },
};
exports.default = VoteCreation;
