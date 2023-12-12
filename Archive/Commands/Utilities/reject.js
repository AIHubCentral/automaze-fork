const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'reject',
    category: 'Utilities',
    description: 'Only usable by mods+. Reject a suggestion thread and lock it.',
    aliases: [],
    syntax: 'reject',
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
    
                message.channel.setLocked(true, `rejected_${message.channel.id}`).then(async thread => {
                    const approvedEmbed = new EmbedBuilder()
                        .setTitle(`This thread has been rejected!`)
                        .setColor(`Red`)
                        .setDescription(`${message.author} has found the suggestion improper and decided not to follow. The suggestion is now locked.`);

                    const DMEmbed = new EmbedBuilder()
                        .setTitle(`Your thread has been rejected!`)
                        .setColor(`Red`)
                        .setDescription(`${message.author.username} finds your suggestion to be improper. Your thread is now rejected ${message.channel}`);

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