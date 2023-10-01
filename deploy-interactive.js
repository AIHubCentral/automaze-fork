/* Interactive console app to assist on command deployment */
const { REST, Routes } = require('discord.js');
const readline = require('readline');
const utils = require('./utils.js');

require('dotenv').config();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('Leave the options blank to read the values from .env\n');

rl.question('Token: ', (tokenInput) => {
    rl.question('Client ID: ', (clientIdInput) => {
        rl.question('Guild ID: ', (guildIdInput) => {
            const token = tokenInput ? tokenInput : process.env.token;
            const clientId = clientIdInput ? clientIdInput : process.env.clientId;
            const guildId = guildIdInput ? guildIdInput : process.env.guildId;
            rl.close();  // stop reading inputs

            // proceed if the values above are not null
            if (token && clientId && guildId) {
                const commands = utils.getCommands(__dirname, 'CommandsSlash');

                // Construct and prepare an instance of the REST module
                const rest = new REST().setToken(token);

                // and deploy your commands!
                (async () => {
                    try {
                        console.log(`Started refreshing ${commands.length} application (/) commands.`);

                        // The put method is used to fully refresh all commands in the guild with the current set
                        const data = await rest.put(
                            Routes.applicationGuildCommands(clientId, guildId),
                            { body: commands },
                        );

                        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
                    }
                    catch (error) {
                        console.error(error);
                    }
                })();
            }
            else {
                console.log('Failed, check your .env file and make sure it has the necessary variables.');
            }
        });
    }); 
});