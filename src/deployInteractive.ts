/* eslint-disable @typescript-eslint/no-require-imports */
/* Interactive console app to assist on command deployment */

import readline from 'readline';
import path from 'path';
import { stdin, stdout } from 'process';
import { config } from 'dotenv';
import {
    REST,
    RESTPostAPIApplicationCommandsJSONBody,
    RESTPutAPIApplicationGuildCommandsResult,
    Routes,
} from 'discord.js';
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
    token: string;
    clientId: string;
    guildId: string;
}

interface ICommandsToDeploy {
    slashCommands: SlashCommand[];
    contextCommands: ContextCommand[];
}

async function deployCommands(credentials: ICredentials, commands: ICommandsToDeploy) {
    // Construct and prepare an instance of the REST module
    const rest = new REST({ version: '10' }).setToken(credentials.token);

    // merge slash and context commands into an array
    const mergedCommands: RESTPostAPIApplicationCommandsJSONBody[] = [];
    commands.slashCommands.forEach((command) => mergedCommands.push(command.data.toJSON()));
    commands.contextCommands.forEach((command) => mergedCommands.push(command.data.toJSON()));

    try {
        console.log(
            `\nStarted refreshing ${commands.slashCommands.length} application (/) commands and ${commands.contextCommands.length} context commands.`
        );

        mergedCommands.forEach((cmd) => console.log(`- ${cmd.name}`));

        // The put method is used to fully refresh all commands in the guild with the current set
        const data = (await rest.put(
            Routes.applicationGuildCommands(credentials.clientId, credentials.guildId),
            { body: mergedCommands }
        )) as RESTPutAPIApplicationGuildCommandsResult;

        console.log(`\nSuccessfully reloaded ${data.length} commands in ${credentials.guildId}.`);
    } catch (error) {
        console.error('Error reloading application (/) commands:', error);
    }
}

async function clearDeployedCommands(credentials: ICredentials): Promise<void> {
    const rest = new REST({ version: '10' }).setToken(credentials.token);

    console.log(`\nClearing deployed commands in guild: ${credentials.guildId}`);

    try {
        await rest.put(Routes.applicationGuildCommands(credentials.clientId, credentials.guildId), {
            body: [],
        });

        console.log('Successfully removed all commands.');
    } catch (error) {
        console.error('Failed to clear deployed commands.', error);
    }
}

// dotenv
config();

(async () => {
    try {
        console.log('Leave the options blank to read the values from .env\n');

        const token: string = await promptWithDefault('Token: ', process.env.token ?? '');
        const clientId: string = await promptWithDefault('Client ID: ', process.env.clientId ?? '');
        const guildId: string = await promptWithDefault('Guild ID: ', process.env.guildId ?? '');
        const mode: string = await promptWithDefault('Mode (debug, dev, prod): ', 'prod');

        if (!token || !clientId || !guildId) {
            console.log('Missing token, client id or guild id');
            rl.close();
            return;
        }

        const clearAll: string = await promptWithDefault('Clear all commands? (y/n): ', 'n');
        const shouldClearDeployedCommands: boolean = clearAll.trim().toLowerCase() === 'y';

        if (shouldClearDeployedCommands) {
            await clearDeployedCommands({ token, clientId, guildId });
        } else {
            const contextCommandFiles = getAllFiles(path.join(__dirname, 'CommandsContext'));

            let slashCommandFiles = [
                ...getAllFiles(path.join(__dirname, 'CommandsSlash', 'Fun')),
                ...getAllFiles(path.join(__dirname, 'CommandsSlash', 'General')),
                ...getAllFiles(path.join(__dirname, 'CommandsSlash', 'Info')),
            ];

            switch (mode.trim().toLocaleLowerCase()) {
                case 'debug':
                    console.log('Deploying in debug mode');
                    slashCommandFiles = slashCommandFiles
                        .concat(getAllFiles(path.join(__dirname, 'CommandsSlash', 'Utilities')))
                        .concat(getAllFiles(path.join(__dirname, 'CommandsSlash', 'Misc')));
                    break;
                case 'dev':
                    console.log('Deploying in dev mode');
                    slashCommandFiles = slashCommandFiles.concat(
                        getAllFiles(path.join(__dirname, 'CommandsSlash', 'Misc'))
                    );
                    break;
            }

            const slashCommands: SlashCommand[] = [];
            const contextCommands: ContextCommand[] = [];

            slashCommandFiles.forEach((commandFile: string) => {
                const command =
                    (require(commandFile).default as SlashCommand) || (require(commandFile) as SlashCommand);
                slashCommands.push(command);
            });

            contextCommandFiles.forEach((commandFile: string) => {
                const command =
                    (require(commandFile).default as ContextCommand) ||
                    (require(commandFile) as ContextCommand);
                contextCommands.push(command);
            });

            await deployCommands({ token, clientId, guildId }, { slashCommands, contextCommands });
        }

        rl.close();
    } catch (err) {
        console.error('Error reading input:', err);
        rl.close();
    }
})();
