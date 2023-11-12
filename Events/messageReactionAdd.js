const fs = require('node:fs');
const path = require('node:path');
const { saveJSON } = require('../utils.js');

function logEmojiToFile(data) {
    return saveJSON('reactions', data);
}

module.exports = {
    name: 'messageReactionAdd',
    once: false,
    async run (client, reaction, user){
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
            console.log(reaction.message.author.id, 'added to cooldown, expires in', expirationDate);

            // log the emoji to a file
            const logData = {
                author: {
                    displayName: reaction.message.author.displayName,
                    userName: reaction.message.author.username,
                },
                reaction: reaction.emoji,
                link: `https://discordapp.com/channels/${reaction.message.guildId}/${reaction.message.channelId}/${reaction.message.id}`
            };
            if (logEmojiToFile(logData)) console.log('Emoji log saved!');
        }
    }
}