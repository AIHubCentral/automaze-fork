"use strict";
/* Interactive console app to assist on command deployment */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const readline_1 = __importDefault(require("readline"));
const path_1 = __importDefault(require("path"));
const process_1 = require("process");
const dotenv_1 = require("dotenv");
const discord_js_1 = require("discord.js");
const fileUtilities_1 = require("./Utils/fileUtilities");
const rl = readline_1.default.createInterface({
    input: process_1.stdin,
    output: process_1.stdout,
    terminal: true,
});
// gets console inputs
function question(query) {
    return new Promise((resolve) => {
        rl.question(query, (answer) => {
            resolve(answer);
        });
    });
}
// helper function to assign default values if input not provided
async function promptWithDefault(prompt, defaultValue) {
    const input = await question(prompt);
    return input.trim() || defaultValue;
}
async function deployCommands(credentials, commands) {
    // Construct and prepare an instance of the REST module
    const rest = new discord_js_1.REST({ version: '10' }).setToken(credentials.token);
    // merge slash and context commands into an array
    const mergedCommands = [];
    commands.slashCommands.forEach(command => mergedCommands.push(command.data.toJSON()));
    commands.contextCommands.forEach(command => mergedCommands.push(command.data.toJSON()));
    try {
        console.log(`Started refreshing ${commands.slashCommands.length} application (/) commands and ${commands.contextCommands.length} context commands.`);
        // The put method is used to fully refresh all commands in the guild with the current set
        const data = await rest.put(discord_js_1.Routes.applicationGuildCommands(credentials.clientId, credentials.guildId), { body: mergedCommands });
        console.log(`Successfully reloaded ${data.length} commands in ${credentials.guildId}.`);
    }
    catch (error) {
        console.error('Error reloading application (/) commands:', error);
    }
}
// dotenv
(0, dotenv_1.config)();
(async () => {
    try {
        console.log('Leave the options blank to read the values from .env\n');
        let token = await promptWithDefault("Token: ", process.env.token ?? '');
        let clientId = await promptWithDefault("Client ID: ", process.env.clientId ?? '');
        let guildId = await promptWithDefault("Guild ID: ", process.env.guildId ?? '');
        if (token && clientId && guildId) {
            const slashCommandFiles = (0, fileUtilities_1.getAllFiles)(path_1.default.join(__dirname, "CommandsSlash"));
            const contextCommandFiles = (0, fileUtilities_1.getAllFiles)(path_1.default.join(__dirname, "CommandsContext"));
            const slashCommands = [];
            const contextCommands = [];
            slashCommandFiles.forEach((commandFile) => {
                const command = require(commandFile).default || require(commandFile);
                slashCommands.push(command);
            });
            contextCommandFiles.forEach((commandFile) => {
                const command = require(commandFile).default || require(commandFile);
                contextCommands.push(command);
            });
            await deployCommands({ token, clientId, guildId }, { slashCommands, contextCommands });
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
