"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = __importDefault(require("node:path"));
const fileUtilities_1 = require("../Utils/fileUtilities");
const EVENTS_PATH = node_path_1.default.join(process.cwd(), 'dist', 'Events');
function registerEvents(client) {
    const eventFiles = (0, fileUtilities_1.getAllFiles)(EVENTS_PATH);
    for (const file of eventFiles) {
        const eventData = require(file).default || require(file);
        if (eventData.once) {
            client.once(eventData.name, (...args) => eventData.run(client, ...args));
        }
        else {
            client.on(eventData.name, (...args) => eventData.run(client, ...args));
        }
    }
}
exports.default = registerEvents;
