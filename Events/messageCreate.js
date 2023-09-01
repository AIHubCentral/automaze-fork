const { EmbedBuilder, RESTJSONErrorCodes } = require(`discord.js`);

const oldAutomazeId = '1122821715815321651';

module.exports = {
    name: "messageCreate",
    once: false,
    async run(Client, message, _) {
        if (message.author.bot) return;

        const prefix = Client.prefix.ensure(message.guild.id, '-');
        const range = i => [...Array(i).keys()];
        const arr = range(1000);
        const random = arr[Math.floor(Math.random() * arr.length)];
        const responses = ['ok but did you wash your ass today', 'ok but my rank is higher than yours', 'who asked lmaoooooo', 'https://tenor.com/view/watch-your-tone-goku-mui-gif-23784055', 'ok but you like men'];

        if (random === 69 && message.channel.id === Client.discordIDs.Channel.Verified) {
            message.reply(responses[Math.round(Math.random() * responses.length)]);
        }

        if (message.content.includes('<@' + Client.user.id + '>')) {
            const devServerGuildId = '1136971905354711193';
            let embedDescription = `## Wassup I'm Automaze!`;
            embedDescription += `\n- My prefix in this server is \`${prefix}\` (customizable with \`${prefix}prefix\`)`;

            // only show how many guilds the bot is present if in the development sever
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

            if (Client.slashCommands.get(commandName) && (!Client.deprecationCD.get(message.author.id) || Date.now() - Client.deprecationCD.get(message.author.id) >= 300000)) {
                const deprecationEmbed = new EmbedBuilder()
                    .setTitle(`Deprecation warning!`)
                    .setDescription(`Due to the need for verification, we are migrating from traditional prefix commands to a more user-friendly slash commands.\n **Please use the slash counterpart of this command, \`/${commandName}\`**`)
                    .setColor(`Yellow`)

                message.channel.send({ embeds: [deprecationEmbed] });
                Client.deprecationCD.set(message.author.id, Date.now());
            }

            command.run(Client, message, args, prefix);
        }

    }
}
