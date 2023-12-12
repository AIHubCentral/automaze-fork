const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'resolve',
    category: 'Utilities',
    description: 'Only usable by mods+. Approve of a suggestion thread and lock it.',
    aliases: ['approve'],
    syntax: 'resolve',
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: async (client, message, args, prefix) => {
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
    
                message.channel.setLocked(true, `approved_${message.channel.id}`).then(async thread => {
                    const approvedEmbed = new EmbedBuilder()
                        .setTitle(`This thread has been approved!`)
                        .setColor(`Green`)
                        .setDescription(`${message.author} has found the suggestion contributive and approved it. The suggestion is now being considered and is likely to be put into motion.`);

                    const DMEmbed = new EmbedBuilder()
                        .setTitle(`Your thread has been approved!`)
                        .setColor(`Green`)
                        .setDescription(`${message.author.username} finds your suggestion to be useful. Your thread is now approved ${message.channel}`);

                    await thread.send({ embeds: [approvedEmbed] });
                    await thread.fetchOwner().then(async threadMember => {
                        await message.delete()
                        await threadMember.user.send({ embeds: [DMEmbed] }).catch(() => { })
                    });

                    /*
                    setTimeout(() => {
                        message.channel.setArchived();
                    }, 3000);
                    */
                });
                return;
            }
        }

        // otherwise don't do an action on the thread
        return await message.reply('You are not allowed to perform this action.');
    }
}
