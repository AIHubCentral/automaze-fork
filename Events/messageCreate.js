const { EmbedBuilder, RESTJSONErrorCodes } = require(`discord.js`);

const oldAutomazeId = '1122821715815321651';

const range = i => [...Array(i).keys()];
const arr = range(1000);

const responses = [
    'who asked lmaoooooo', 'rvc 3 when?', 'really?',
    'lol', 'frfr', 'bruh', 'BRUHHH',
    'ok but my rank is higher than yours', 'if you say so', 'ok but how to make ai cover?',
    '🤔', '🤨', '😲', '🤯',
    // gifs
    'https://tenor.com/view/shocked-shock-shocking-omg-omg-meme-gif-26225226',
    'https://tenor.com/view/jonah-hill-annoyed-gif-9220106536573580777',
    'https://tenor.com/view/nick-young-question-mark-huh-what-confused-gif-4995479',
    'https://tenor.com/view/ben-stiller-zoolander-god-ugly-gif-20659335',
    'https://tenor.com/view/go-away-oops-awkward-big-eyes-gif-16408506',
    'https://tenor.com/view/problematic-stressed-smh-oh-dear-gif-23576897',
    'https://tenor.com/view/watch-your-tone-goku-mui-gif-23784055'
];

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
            const random = arr[Math.floor(Math.random() * arr.length)];
            if (random === 69) {
                if (!messageLowercase.includes('?') && messageLowercase.length > 5) {
                    const selectedIndex = Math.floor(Math.random() * responses.length);
                    const botResponse = responses[selectedIndex];
                    await message.reply(botResponse);
                }
            }
        }

        if (message.content.includes('<@' + Client.user.id + '>')) {
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
