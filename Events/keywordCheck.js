const delay = require('node:timers/promises').setTimeout;

module.exports = {
    name: "messageCreate",
    once: false,
    async run(client, message, _) {
        if (message.author.bot) return;

        // only proceed if reactions is enabled in configs
        if (!client.botConfigs.general.reactions) return;

        // skip prefix commands
        const prefix = client.prefix.ensure(message.guild.id, '-');
        if (message.content.startsWith(prefix)) return;

        // check if user is on cooldown
        if (client.cooldowns.reactions.has(message.author.id)) {
            const cooldownExpiration = client.cooldowns.reactions.get(message.author.id);
            const currentDate = new Date();

            if (currentDate.getTime() < cooldownExpiration.getTime()) {
                // user is on cooldown, don't add reactions
                return;
            }
            else {
                // cooldown expired
                client.cooldowns.reactions.delete(message.author.id);
            }
        }

        const messageLowercase = message.content.toLowerCase();

        try {
            // max of 20 reactions
            let reactionCounter = 0;
            for (const item of client.botData.reactionKeywords) {
                if (reactionCounter >= 20) break;

                let foundKeyword = false;

                let keywordCount = item.keywords.length;
                let matchedKeywords = 0;

                for (const keyword of item.keywords) {
                    // text is exact the keyword
                    if (item.exact) {
                        foundKeyword = messageLowercase === keyword;
                    }
                    else {
                        // otherwise check if text includes the keyword
                        foundKeyword = messageLowercase.includes(keyword);
                    }

                    if (foundKeyword) {
                        matchedKeywords++;

                        // only needs to match one keyword
                        if (matchedKeywords > 1) break;

                        //console.log('found', item);
                        //console.log('matched keywords', matchedKeywords);

                        for (const emoji of item.emojis) {
                            //console.log(emoji);
                            await message.react(emoji);
                            await delay(500);
                            reactionCounter++;
                        }
                    }
                }
                //console.log('End of keyword check');
            }
        } catch (error) {
            console.log('Failed to add reaction');
            // sends a log to the dev server
            if (client.botConfigs.general.sendLogs) {
                const { botConfigs } = client;
                const devServerGuild = client.guilds.cache.get(botConfigs.devServerId);
                const botDebugChannel = devServerGuild.channels.cache.get(botConfigs.debugChannelId);
                await botDebugChannel.send(`Failed to add reaction:\n> [Go to message](https://discordapp.com/channels/${message.guild.id}/${message.channel.id}/${message.id})`);
            }
        }
    }
}
