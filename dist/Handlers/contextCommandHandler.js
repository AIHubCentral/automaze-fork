"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const ROOT_DIR = node_path_1.default.join(process.cwd(), 'dist', 'CommandsContext');
function setContextCommands(client) {
    const categoryFolders = node_fs_1.default.readdirSync(ROOT_DIR);
    for (const folder of categoryFolders) {
        const commandFiles = node_fs_1.default.readdirSync(node_path_1.default.join(ROOT_DIR, folder)).filter(file => file.endsWith(`.js`));
        for (const file of commandFiles) {
            const filePath = node_path_1.default.join(ROOT_DIR, folder, file);
            const command = require(filePath).default || require(filePath);
            client.contextMenuCommands.set(command.data.name, command);
        }
    }
}
exports.default = setContextCommands;
