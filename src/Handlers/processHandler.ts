import ExtendedClient from '../Core/extendedClient';

export default function registerProcesses(client: ExtendedClient) {
    process.on('uncaughtException', (error) => {
        client.logger.error('uncaughtException', error);
    });

    process.on('unhandledRejection', (error) => {
        client.logger.error('unhandledRejection', error);
    });
}
