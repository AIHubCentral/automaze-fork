import { Events, ThreadChannel } from "discord.js";
import IEventData from "../../Interfaces/Events";
import { delay } from "../../Utils/generalUtilities";
import { createEmbed } from "../../Utils/discordUtilities";

const VoteCreation: IEventData = {
    name: Events.ThreadCreate,
    once: false,
    async run(client, thread: ThreadChannel, newlyCreated: boolean) {
        const logData = {
            more: {
                threadId: thread.id,
                parentId: thread.parentId,
                guildId: thread.guildId,
            }
        };

        try {
            let embedMessages = {
                [client.discordIDs.Forum.Suggestions]: "Vote for this suggestion!",
                [client.discordIDs.Forum.TaskSTAFF]: "Vote for this task!",
            }

            if (!newlyCreated) return;
            if (thread.guildId != client.discordIDs.Guild) return;
            if (!thread.parentId) return;
            if (!embedMessages[thread.parentId]) return;

            const voteEmbed = createEmbed({
                title: embedMessages[thread.parentId],
                color: client.botConfigs.colors.theme.primary,
            });

            // Check if the thread was created successfully
            await delay(2_000);
            if (!(thread.guild.channels.cache.get(thread.id))) return;

            // Create reactions
            const message = await thread.send({ embeds: [voteEmbed] })
            await Promise.all([
                message.react(`🔼`),
                message.react(`🔽`),
            ]);

            client.logger.info('Added voting embed', logData);

        } catch (error) {
            client.logger.error('Failed to add voting embed', error, logData);
        }
    }
}

export default VoteCreation;