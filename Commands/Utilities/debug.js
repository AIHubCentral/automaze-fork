const fs = require('node:fs');
const path = require('node:path');

module.exports = {
    name: 'debug',
    category: 'Utilities',
    description: 'Bot developers only, logs info from discord API.',
    aliases: [],
    syntax: 'debug',
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: async (client, message, args, prefix) => {
        if (!client.botAdminIds) return;

        if (!client.botAdminIds.includes(message.author.id)) {
            console.log(`${message.author.id} (${message.author.username}): unauthorized to -debug`);
            const reactions = ['🐝', '🦋', '🪲', '🐞', '🦗'];
            await message.react(reactions[client.botUtils.getRandomNumber(0, reactions.length - 1)]);
        }
        else {
            console.log(`${message.author.id} (${message.author.username}): authorized to -debug`);

            // sends emojis to the dev server
            const prodServer = client.guilds.cache.get(client.discordIDs.Guild);
            const devServer = client.guilds.cache.get('1136971905354711193');

            // dev server bot-spam channel
            const botSpamChannel = devServer.channels.cache.get('1141368832993267792');

            if (!botSpamChannel) {
                console.log('Could\'n find bot spam channel');
                return;
            }

            const emojiManager = prodServer.emojis;

            const emojiStrings = [];

            emojiManager.cache.forEach(emoji => {
                // create a string in the format <:emoji:id>
                let emojiString = `- \\<:${emoji.name}:${emoji.id}> <:${emoji.name}:${emoji.id}>`;
                emojiStrings.push(emojiString);
            });

            await botSpamChannel.send({ content: '### Server Emojis:\n' + emojiStrings.join('\n') });

            // logs data to a text file
            const now = new Date();

            // Format the date and time with leading zeros if needed
            const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
            const formattedTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
            const formattedDateTime = `${formattedDate}-${formattedTime}`;
            
            const filepath = `./Debug/${formattedDateTime}-debug.txt`;

            let data = `guildId: ${message.guildId}`;
            data += `\n\nChannel`;
            data += `\n\tID: ${message.channel.id}`;
            data += `\n\tName: ${message.channel.name}`;
            data += `\n\tType: ${message.channel.type}`;
            data += `\n\tautoArchiveDuration: ${message.channel.autoArchiveDuration}`;
            data += `\n\tappliedTags: [${message.channel.appliedTags}]`;

            try {
                fs.appendFileSync(filepath, data, 'utf-8');
                await message.react('✅');
            }
            catch (error) {
                console.log(`Failed: ${error}`);
                await message.react('❌');
            }
        }
    }
}
