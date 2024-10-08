import fs from 'node:fs';
import path from 'node:path';
import ExtendedClient from '../Core/extendedClient';
import { ContextCommand, PrefixCommand, SlashCommand } from '../Interfaces/Command';
import { Collection } from 'discord.js';

type interactionCommand = SlashCommand | ContextCommand;

function setCommands(commandsDir: string, commandsCollection: Collection<string, any>): void {
    const categoryFolders = fs.readdirSync(commandsDir);

    for (const folder of categoryFolders) {
        const commandFiles = fs
            .readdirSync(path.join(commandsDir, folder))
            .filter((file) => file.endsWith(`.js`));

        for (const file of commandFiles) {
            const filePath = path.join(commandsDir, folder, file);
            const isInteractionCommand: boolean =
                commandsDir.includes('Context') || commandsDir.includes('Slash');

            if (isInteractionCommand) {
                const command =
                    (require(filePath).default as interactionCommand) ||
                    (require(filePath) as interactionCommand);
                commandsCollection.set(command.data.name, command);
            } else {
                const command =
                    (require(filePath).default as PrefixCommand) || (require(filePath) as PrefixCommand);
                commandsCollection.set(command.name, command);
            }
        }
    }
}

export default function registerCommands(client: ExtendedClient): void {
    const prefixCommandsDir = path.join(process.cwd(), 'dist', 'Commands');
    setCommands(prefixCommandsDir, client.commands);

    const slashCommandsDir = path.join(process.cwd(), 'dist', 'CommandsSlash');
    setCommands(slashCommandsDir, client.slashCommands);

    const contextCommandsDir = path.join(process.cwd(), 'dist', 'CommandsContext');
    setCommands(contextCommandsDir, client.contextMenuCommands);
}
