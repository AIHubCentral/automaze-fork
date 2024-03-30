module.exports = {
    name: 'messageReactionAdd',
    once: false,
    async run(client, reaction, user) {
        // only add cooldown if the reaction was added by the bot
        if (user.id !== client.user.id) return;

        // don't add cooldown if the bot reacted to itself like the voting embed for instance
        if (reaction.message.author.id === client.user.id) return;

        // cooldown immune users
        if (client.botData.cooldownImmuneUsers.has(reaction.message.author.id)) return;

        // add user to cooldown
        if (!client.cooldowns.reactions.has(reaction.message.author.id)) {
            const expirationDate = new Date();
            expirationDate.setMinutes(expirationDate.getMinutes() + 5);
            client.cooldowns.reactions.set(reaction.message.author.id, expirationDate);
            client.logger.debug('User added to cooldown', {
                more: {
                    userId: reaction.message.author.id,
                    channelId: reaction.message.channel.id,
                    guildId: reaction.message.guild.id,
                    expiresIn: expirationDate,
                },
            });

            if (client.botConfigs.logs.emojis) {
                // log the emoji to a file
                const logData = {
                    more: {
                        author: {
                            displayName: reaction.message.author.displayName,
                            userName: reaction.message.author.username,
                        },
                        reaction: reaction.emoji,
                        link: `https://discordapp.com/channels/${reaction.message.guildId}/${reaction.message.channelId}/${reaction.message.id}` },
                };
                client.logger.info('Added emoji reaction', logData);
            }
        }
    },
};