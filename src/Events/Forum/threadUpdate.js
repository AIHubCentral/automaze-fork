const { Events } = require('discord.js');

/* checks if thread content was deleted */

module.exports = {
    name: Events.ThreadUpdate,
    once: false,
    async run(client, oldThread, newThread) {
        const { discordIDs } = client;
        if (newThread.parentId != discordIDs.Forum.VoiceModel) return;
        if (!(newThread.name.toLowerCase().includes('deleted'))) return;

        const logData = {
            more: {
                oldThreadName: oldThread.name,
                newThreadName: newThread.name,
                threadId: newThread.id,
                threadParentId: newThread.parentId,
            },
        };

        try {
            const starterMessage = await newThread.fetchStarterMessage();
            logData.more.updatedMessage = starterMessage.content;
        }
        catch (error) {
            logData.more.updatedMessage = 'Original message was deleted';
        }

        client.logger.debug('Voice model deleted', logData);
    },
};