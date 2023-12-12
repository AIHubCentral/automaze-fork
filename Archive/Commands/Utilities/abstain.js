const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'abstain',
    category: 'Utilities',
    description: 'Only usable by mods+. Abstain from a suggestion thread and lock it.',
    aliases: [],
    syntax: 'abstain',
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: async(client, message, args, prefix) => {
        if (!message.channel.isThread()) return;

        const allowedThreads = [];
        allowedThreads.push(client.discordIDs.Forum.TaskSTAFF);
        allowedThreads.push(client.discordIDs.Forum.Suggestions);

        if (!allowedThreads.includes(message.channel.parentId)) {
            await message.delete();
            return;
        };

        // check if user has at least one appropriate role
        const allowedRoles = [];
        allowedRoles.push(client.discordIDs.Roles.Admin);
        allowedRoles.push(client.discordIDs.Roles.Mod);

        const userRoles = message.member.roles.cache;

        for (const roleId of allowedRoles) {
            if (userRoles.has(roleId)) {
                // check if thread is already locked
                if (message.channel.locked) return await message.reply(`This thread have already been locked.`);
    
                message.channel.setLocked(true, `abstain_${message.channel.id}`).then(async thread => {
                    const approvedEmbed = new EmbedBuilder()
                        .setTitle(`This thread has been locked!`)
                        .setColor(`Grey`)
                        .setDescription(`${message.author} is not sure of the suggestion and has decided to abstain from it. The suggestion is either a joke or is controversial and might be implemented or not depending on the staff team's discretion.`);

                    const DMEmbed = new EmbedBuilder()
                        .setTitle(`Your thread has been locked!`)
                        .setColor(`Grey`)
                        .setDescription(`${message.author.username} is not sure of your suggestion. Your thread is now locked ${message.channel}`);

                    await thread.send({ embeds: [approvedEmbed] });
                    await thread.fetchOwner().then(async threadMember => {
                        await message.delete()
                        await threadMember.user.send({ embeds: [DMEmbed] }).catch(() => { })
                    });
                });
                return;
            }
        }

        // otherwise don't do an action on the thread
        return await message.reply('You are not allowed to perform this action.');
    }
}