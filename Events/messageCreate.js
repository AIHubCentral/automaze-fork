const { EmbedBuilder, RESTJSONErrorCodes } = require(`discord.js`);

const range = i => [...Array(i).keys()];
const arr = range(1000);

module.exports = {
    name: "messageCreate",
    once: false,
    async run(Client, message, _) {
        if (message.author.bot) return;

        const prefix = Client.prefix.ensure(message.guild.id, '-');
        
        // verified chat only
        if (message.channel.id === Client.discordIDs.Channel.Verified) {
            const messageLowercase = message.content.toLowerCase();

            /* these always happens */

            // if qo is mentioned
            if (messageLowercase == 'qo' || messageLowercase.startsWith('qo ') || messageLowercase.includes(' qo ') || messageLowercase.endsWith(' qo')) {
                await message.react('🐀');
            }

            /* these have a chance of happening */
            /*
            const random = arr[Math.floor(Math.random() * arr.length)];
            if (random === 69) {
                if (!messageLowercase.includes('?') && messageLowercase.length > 5) {
                    const responses = Client.botResponses.responses.verifiedChat;
                    const selectedIndex = Math.floor(Math.random() * responses.length);
                    const botResponse = responses[selectedIndex];
                    await message.reply(botResponse);
                }
            }
            */
        }

        if (!message.content.startsWith('-banan') && message.content.includes('<@' + Client.user.id + '>')) {
            const devServerGuildId = '1136971905354711193';
            let embedDescription = `## Wassup I'm Automaze!`;
            embedDescription += `\n- My prefix in this server is \`${prefix}\` (customizable with \`${prefix}prefix\`)`;

            // only show how many guilds the bot is present if in the development server
            if (message.guild.id == devServerGuildId) {
                embedDescription += `\n- Currently I'm present in ${Client.guilds.cache.size} servers.`;
            }

            embedDescription += `\n- Interested in how I'm built? [I'm actually open source!](https://github.com/DeprecatedTable/automaze)`;
            embedDescription += `\n- Feeling a tad bit generous? [Buy me a coffee!](https://ko-fi.com/fungusdesu)`;
            message.reply({ embeds: [new EmbedBuilder().setColor(`Aqua`).setDescription(embedDescription)] });
        }

        if (message.content.startsWith(prefix)) {
            const args = message.content.slice(prefix.length).trim().split(/ +/);
            const commandName = args.shift().toLowerCase();
            const command = Client.commands.get(commandName) || Client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName) && cmd.aliases !== []); // Use the command alias if there's any, if there's none use the real command name instead

            if (!command) {
                return;
            } // If can't find then do nothing

            /*
            if (Client.slashCommands.get(commandName) && (!Client.deprecationCD.get(message.author.id) || Date.now() - Client.deprecationCD.get(message.author.id) >= 300000)) {
                const deprecationEmbed = new EmbedBuilder()
                    .setTitle(`Deprecation warning!`)
                    .setDescription(`Due to the need for verification, we are migrating from traditional prefix commands to a more user-friendly slash commands.\n **Please use the slash counterpart of this command, \`/${commandName}\`**`)
                    .setColor(`Yellow`)

                message.channel.send({ embeds: [deprecationEmbed] });
                Client.deprecationCD.set(message.author.id, Date.now());
            }
            */

            command.run(Client, message, args, prefix);
        }

    }
}
