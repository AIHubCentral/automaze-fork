/* Interactive console app to assist on command deployment */

import readline from 'readline';
import path from 'path';
import { stdin , stdout } from 'process';
import { config } from 'dotenv';
import { REST, RESTPostAPIApplicationCommandsJSONBody, RESTPutAPIApplicationGuildCommandsResult, Routes } from 'discord.js';
import { getAllFiles } from './Utils/fileUtilities';
import { ContextCommand, SlashCommand } from './Interfaces/Command';

const rl = readline.createInterface({
    input: stdin as unknown as NodeJS.ReadableStream,
    output: stdout as unknown as NodeJS.WritableStream,
    terminal: true,
});

// gets console inputs
function question(query: string): Promise<string> {
    return new Promise((resolve) => {
        rl.question(query, (answer: string) => {
            resolve(answer);
        });
    });
}

// helper function to assign default values if input not provided
async function promptWithDefault(prompt: string, defaultValue: string): Promise<string> {
    const input = await question(prompt);
    return input.trim() || defaultValue;
}

interface ICredentials {
    token: string,
    clientId: string,
    guildId: string,
}

interface ICommandsToDeploy {
    slashCommands: SlashCommand[],
    contextCommands: ContextCommand[]
}

async function deployCommands(credentials: ICredentials, commands: ICommandsToDeploy) {
    // Construct and prepare an instance of the REST module
    const rest = new REST({ version: '10' }).setToken(credentials.token);

    // merge slash and context commands into an array
    const mergedCommands: RESTPostAPIApplicationCommandsJSONBody[] = [];
    commands.slashCommands.forEach(command => mergedCommands.push(command.data.toJSON()));
    commands.contextCommands.forEach(command => mergedCommands.push(command.data.toJSON()));

    try {
        console.log(`Started refreshing ${commands.slashCommands.length} application (/) commands and ${commands.contextCommands.length} context commands.`);

        // The put method is used to fully refresh all commands in the guild with the current set
        const data = await rest.put(
            Routes.applicationGuildCommands(credentials.clientId, credentials.guildId),
            { body: mergedCommands },
        ) as RESTPutAPIApplicationGuildCommandsResult;

        console.log(`Successfully reloaded ${data.length} commands in ${credentials.guildId}.`);
    }
    catch (error) {
        console.error('Error reloading application (/) commands:', error);
    }
}

// dotenv
config();

(async () => {
    try {
        console.log('Leave the options blank to read the values from .env\n');

        let token: string = await promptWithDefault("Token: ", process.env.token ?? '');
        let clientId: string = await promptWithDefault("Client ID: ", process.env.clientId ?? '');
        let guildId: string = await promptWithDefault("Guild ID: ", process.env.guildId ?? '');

        if (token && clientId && guildId) {
            const slashCommandFiles = getAllFiles(path.join(__dirname, "CommandsSlash"));
            const contextCommandFiles = getAllFiles(path.join(__dirname, "CommandsContext"));

            const slashCommands: SlashCommand[] = [];
            const contextCommands: ContextCommand[] = [];

            slashCommandFiles.forEach((commandFile: string) => {
                const command = require(commandFile).default as SlashCommand || require(commandFile) as SlashCommand;
                slashCommands.push(command);
            });

            contextCommandFiles.forEach((commandFile: string) => {
                const command = require(commandFile).default as ContextCommand || require(commandFile) as ContextCommand;
                contextCommands.push(command);
            });

            await deployCommands(
                {token, clientId, guildId},
                {slashCommands, contextCommands}
            );
        }
        else {
            console.error('Missing token, client id or guild id.');
        }

        rl.close();
    }
    catch (err) {
        console.error('Error reading input:', err);
        rl.close();
    }
})();