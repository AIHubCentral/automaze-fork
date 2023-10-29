const { Collection } = require('discord.js');

module.exports = {
    name: 'messageReactionAdd',
    once: false,
    async run (client, reaction, user){
        // add reaction cooldowns on verified chat
        if (reaction.message.channelId == client.discordIDs.Channel.Verified) {

            // triggered when the bot adds a reaction
            if (user.bot && (user.id === client.user.id)) {

                // add user to cooldown
                if (!client.cooldowns.reactions.has(reaction.message.author.id)) {
                    const cooldownAmount = 1 * 60 * 1000;
                    client.cooldowns.reactions.set(reaction.message.author.id, new Date());
                    console.log(reaction.message.author.id, 'added to cooldown');
                    //setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
                }
            }
        }
    }
}