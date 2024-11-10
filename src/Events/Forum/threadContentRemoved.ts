import { Events, ThreadChannel } from 'discord.js';
import IEventData from '../../Interfaces/Events';
import { sendErrorLog } from '../../Utils/botUtilities';

/* checks if thread content was deleted */

const ThreadUpdate: IEventData = {
    name: Events.ThreadUpdate,
    once: false,
    async run(client, oldThread: ThreadChannel, newThread: ThreadChannel) {
        const { discordIDs } = client;
        if (newThread.parentId != discordIDs.Forum.VoiceModels) return;
        if (!newThread.name.toLowerCase().includes('deleted')) return;

        const logData = {
            more: {
                oldThreadName: oldThread.name,
                newThreadName: newThread.name,
                threadId: newThread.id,
                threadParentId: newThread.parentId,
                updatedMessage: '',
            },
        };

        try {
            const starterMessage = await newThread.fetchStarterMessage();
            if (starterMessage) {
                logData.more.updatedMessage = starterMessage.content;
            }
        } catch (error) {
            logData.more.updatedMessage = 'Original message was deleted';

            await sendErrorLog(client, error, {
                command: `Event: ThreadContentRemoved`,
                message: 'Failure on checking thread content removed',
                guildId: newThread.guildId ?? '',
                channelId: newThread.id,
            });
        }

        client.logger.info('Voice model deleted', logData);
    },
};

export default ThreadUpdate;
