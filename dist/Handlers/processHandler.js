"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = registerProcesses;
function registerProcesses(client) {
    process.on('uncaughtException', (error) => {
        client.logger.error('uncaughtException', error);
    });
    process.on('unhandledRejection', (error) => {
        client.logger.error('unhandledRejection', error);
    });
}
