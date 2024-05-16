"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = __importDefault(require("node:path"));
const fs_1 = __importDefault(require("fs"));
const winston_1 = __importDefault(require("winston"));
const logsDir = node_path_1.default.join(process.cwd(), 'logs');
// Ensure the logs directory exists
if (!fs_1.default.existsSync(logsDir)) {
    fs_1.default.mkdirSync(logsDir);
}
const Logger = winston_1.default.createLogger({
    level: 'debug',
    format: winston_1.default.format.combine(winston_1.default.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
    }), winston_1.default.format.json()),
    transports: [
        new winston_1.default.transports.Console({
            format: winston_1.default.format.simple(),
        }),
        new winston_1.default.transports.File({
            filename: node_path_1.default.join(logsDir, 'combined.log'),
            maxsize: 10485760,
        }),
    ],
});
exports.default = Logger;
