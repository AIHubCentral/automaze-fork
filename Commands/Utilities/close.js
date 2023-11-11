const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'close',
    category: 'Utilities',
    description: 'Allows user to close their forum thread.',
    aliases: [],
    syntax: 'close',
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: async (client, message, args, prefix) => {
        const channel = message.channel;
        if (!channel.isThread()) return;
        if (channel.locked) {
            return message.reply('This channel have already been locked.');
        }

        const { botConfigs, botUtils, discordIDs } = client;
        const availableColors = botUtils.getAvailableColors(botConfigs);
        const botResponse = {};
        const embedData = {
            title: 'Thread closed'
        };

        let userAllowedToClose = false;
        let userIsStaff = false;

        if (message.author.id !== channel.ownerId) {
            // if it's not the thread author, check if it's a staff member
            const allowedRoles = [
                discordIDs.Roles.Admin,
                discordIDs.Roles.Mod,
                discordIDs.Roles.Helper,
            ];
            const userRoles = message.member.roles.cache;
            for (const roleId of allowedRoles) {
                if (userRoles.has(roleId)) {
                    userAllowedToClose = true;
                    userIsStaff = true;
                    embedData.description = ['This post was closed by a staff member.'];
                    break;
                }
            }
        }
        else {
            // author of the post
            userAllowedToClose = true;
            embedData.description = ['User has closed their post.'];
        }

        if (!userAllowedToClose) {
            botResponse.content = 'You are not the author of this post.';
            return message.reply(botResponse);
        }
        else {
            botResponse.embeds = botUtils.createEmbeds([embedData], availableColors);
            await channel.send(botResponse);

            await channel.setAutoArchiveDuration(60);
            await channel.setLocked(true);

            let logChannel = message.guild.channels.cache.get(discordIDs.Channel.Moderation);

            if (!logChannel) {
                console.log('Log channel not found in cache...Fetching');
                logChannel = await message.guild.channels.fetch(discordIDs.Channel.Moderation);
            }

            embedData.title = '🔒 A thread have been locked',
            embedData.description = [
                `<@${message.author.id}> (${message.author.username}) has closed a post`,
                `\nGo to thread: [${channel.name}](https://discordapp.com/channels/${message.guild.id}/${message.channel.id}/${message.id})`
            ];

            botResponse.content = '';
            botResponse.embeds = botUtils.createEmbeds([embedData], availableColors);

            await logChannel.send(botResponse);

            if (userIsStaff) {
                await message.delete();
            }
        }
    }
}