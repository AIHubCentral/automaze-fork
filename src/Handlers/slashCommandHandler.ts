import fs from 'node:fs';
import path from 'node:path';
import ExtendedClient from '../Core/extendedClient';
import { SlashCommand } from '../Interfaces/Command';

const ROOT_DIR = path.join(process.cwd(), 'dist', 'CommandsSlash');

export default function setSlashCommands(client: ExtendedClient): void {
    const categoryFolders = fs.readdirSync(ROOT_DIR);

    for (const folder of categoryFolders) {
        const commandFiles = fs.readdirSync(path.join(ROOT_DIR, folder)).filter(file => file.endsWith(`.js`));

        for (const file of commandFiles) {
            //if (!file.includes('doxx')) continue;
            //console.log(file);
            const filePath = path.join(ROOT_DIR, folder, file);
            const command = require(filePath).default as SlashCommand || require(filePath) as SlashCommand;
            client.slashCommands.set(command.data.name, command);
        }
    }
}