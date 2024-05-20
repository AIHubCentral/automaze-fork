import fs from 'node:fs';
import path from 'node:path';
import ExtendedClient from '../Core/extendedClient';
import { PrefixCommand } from '../Interfaces/Command';

const ROOT_DIR = path.join(process.cwd(), 'dist', 'Commands');

export default function setPrefixCommands(client: ExtendedClient) {
    const categoryFolders = fs.readdirSync(ROOT_DIR);

    for (const folder of categoryFolders) {
        const commandFiles = fs.readdirSync(path.join(ROOT_DIR, folder)).filter(file => file.endsWith(`.js`));

        for (const file of commandFiles) {
            const filePath = path.join(ROOT_DIR, folder, file);
            const command = require(filePath).default as PrefixCommand || require(filePath) as PrefixCommand;
            client.commands.set(command.name, command);
        }
    }
}