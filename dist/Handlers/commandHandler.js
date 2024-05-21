"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
function setCommands(commandsDir, commandsCollection) {
    const categoryFolders = node_fs_1.default.readdirSync(commandsDir);
    for (const folder of categoryFolders) {
        const commandFiles = node_fs_1.default.readdirSync(node_path_1.default.join(commandsDir, folder)).filter(file => file.endsWith(`.js`));
        for (const file of commandFiles) {
            const filePath = node_path_1.default.join(commandsDir, folder, file);
            const isInteractionCommand = commandsDir.includes('Context') || commandsDir.includes('Slash');
            if (isInteractionCommand) {
                const command = require(filePath).default || require(filePath);
                commandsCollection.set(command.data.name, command);
            }
            else {
                const command = require(filePath).default || require(filePath);
                commandsCollection.set(command.name, command);
            }
        }
    }
}
function registerCommands(client) {
    const prefixCommandsDir = node_path_1.default.join(process.cwd(), 'dist', 'Commands');
    setCommands(prefixCommandsDir, client.commands);
    const slashCommandsDir = node_path_1.default.join(process.cwd(), 'dist', 'CommandsSlash');
    setCommands(slashCommandsDir, client.slashCommands);
    const contextCommandsDir = node_path_1.default.join(process.cwd(), 'dist', 'CommandsContext');
    setCommands(contextCommandsDir, client.contextMenuCommands);
}
exports.default = registerCommands;
