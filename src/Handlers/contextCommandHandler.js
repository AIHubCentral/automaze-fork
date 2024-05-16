const fs = require(`node:fs`);

module.exports = client => {
    const categoriesPath = `${process.cwd()}/dist/CommandsContext`
    const categoryFolders = fs.readdirSync(categoriesPath)

    for (const folder of categoryFolders) {
        const commandFiles = fs.readdirSync(`${categoriesPath}/${folder}`).filter(file => file.endsWith(`.js`));

        for (const file of commandFiles) {
            const filePath = `${categoriesPath}/${folder}/${file}`;
            const command = require(filePath);

            if (`data` in command && `execute` in command && (command.type === 'context-menu')) {
                client.contextMenuCommands.set(command.data.name, command);
            } else {
                console.log(`[WARNING] A context command in ${filePath} is missing data or execute property, or is having incorrect type!`);
            }
        }
    }
}