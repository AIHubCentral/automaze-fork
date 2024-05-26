"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
/* checks if thread content was deleted */
const ThreadUpdate = {
    name: discord_js_1.Events.ThreadUpdate,
    once: false,
    async run(client, oldThread, newThread) {
        const { discordIDs } = client;
        if (newThread.parentId != discordIDs.Forum.VoiceModel)
            return;
        if (!(newThread.name.toLowerCase().includes('deleted')))
            return;
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
        }
        catch (error) {
            logData.more.updatedMessage = 'Original message was deleted';
        }
        client.logger.info('Voice model deleted', logData);
    },
};
exports.default = ThreadUpdate;
