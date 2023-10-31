module.exports = {
    name: 'messageReactionAdd',
    once: false,
    async run (client, reaction, user){
        // only add cooldown if the reaction was added by the bot
        if (user.id !== client.user.id) return;

        // don't add cooldown if the bot reacted to itself like the voting embed for instance
        if (reaction.message.author.id === client.user.id) return;

        // add user to cooldown
        if (!client.cooldowns.reactions.has(reaction.message.author.id)) {
            const expirationDate = new Date();
            expirationDate.setMinutes(expirationDate.getMinutes() + 15);
            client.cooldowns.reactions.set(reaction.message.author.id, expirationDate);
            console.log(reaction.message.author.id, 'added to cooldown, expires in', expirationDate);
        }
    }
}