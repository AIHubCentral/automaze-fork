"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reactionAddEvent = {
    name: 'messageReactionAdd',
    once: false,
    async run(client, reaction, user) {
        // only add cooldown if the reaction was added by the bot
        const botId = client.user?.id;
        if (user.id !== botId)
            return;
        const reactionAuthor = reaction.message.author;
        if (!reactionAuthor)
            return;
        // don't add cooldown if the bot reacted to itself like the voting embed for instance
        if (reactionAuthor.id === botId)
            return;
        // add user to cooldown
        if (client.cooldowns.reactions.has(reactionAuthor.id))
            return;
        const expirationDate = new Date();
        expirationDate.setMinutes(expirationDate.getMinutes() + 5);
        client.cooldowns.reactions.set(reactionAuthor.id, expirationDate);
        client.logger.info('Added emoji reaction', {
            more: {
                user: {
                    id: reactionAuthor.id,
                    displayName: reactionAuthor.displayName,
                    userName: reactionAuthor.username,
                },
                channelId: reaction.message.channel.id,
                guildId: reaction.message.guild?.id,
                reaction: reaction.emoji,
                link: `https://discordapp.com/channels/${reaction.message.guildId}/${reaction.message.channelId}/${reaction.message.id}`,
            },
        });
    },
};
exports.default = reactionAddEvent;
