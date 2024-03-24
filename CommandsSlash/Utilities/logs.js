const { SlashCommandBuilder } = require('discord.js');
const delay = require('node:timers/promises').setTimeout;
const fs = require('node:fs').promises;
const path = require('node:path');

const LOGS_DEBUG_DIR = path.join(process.cwd(), 'Debug');
const LOGS_DIR = path.join(process.cwd(), 'logs');

async function getFileNames(targetDirectory, logger) {
    let fileNames = [];

    try {
        fileNames = await fs.readdir(targetDirectory);
    }
    catch (error) {
        logger.error(`Failed reading ${targetDirectory}`, error);
    }

    return fileNames;
}

async function createDirectoryIfNotExist(directoryPath, logger) {
    try {
        const directoryExists = await fs.access(directoryPath).then(() => true).catch(() => false);
        if (!directoryExists) {
            await fs.mkdir(directoryPath);
            logger.info(`Directory created: ${directoryPath}`);
        }
    }
    catch (error) {
        logger.error(`Failed to create ${directoryPath}`, error);
    }
}

async function checkFileExists(filePath, logger) {
    logger.info(`Checking if ${filePath} exists...`);

    try {
        await fs.stat(filePath);
        logger.info(`Found ${filePath}`);
        return true;
    }
    catch (error) {
        if (error.code === 'ENOENT') {
            logger.error(`${filePath} does not exist.`, error);
            return false;
        }
        // Rethrow unexpected errors
        throw error;
    }
}

async function deleteFile(filePath, logger) {
    try {
        await fs.unlink(filePath);
        logger.info(`Deleted ${filePath}`);
    }
    catch (error) {
        logger.error(`Error deleting ${filePath}`, error);
    }
}

module.exports = {
    category: 'Utilities',
    cooldown: 15,
    type: 'slash',
    data: new SlashCommandBuilder()
        .setName('logs')
        .setDescription('Manage bot logs')
        .addSubcommand(subcommand =>
            subcommand
                .setName('list')
                .setDescription('List all log files')
                .addStringOption(option =>
                    option
                        .setName('folder')
                        .setDescription('Where to look for the log files')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Logs', value: 'logs' },
                            { name: 'Debug', value: 'debug' },
                        ))
                .addStringOption(option =>
                    option
                        .setName('date')
                        .setDescription('Filter logs by date in the yyyy-mm-dd format'),
                ),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('manage')
                .setDescription('Manages a log file')
                .addStringOption(option =>
                    option
                        .setName('folder')
                        .setDescription('Where to look for the log files')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Logs', value: 'logs' },
                            { name: 'Debug', value: 'debug' },
                        ))
                .addStringOption(option =>
                    option
                        .setName('action')
                        .setDescription('Choose an action to do on a log file')
                        .setRequired(true)
                        .addChoices(
                            { name: 'download', value: 'download' },
                            { name: 'delete', value: 'delete' },
                        ),
                )
                .addStringOption(option =>
                    option
                        .setName('filename')
                        .setDescription('Name of the log file')
                        .setRequired(true),
                ),
        ),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const { client } = interaction;
        const botResponse = {};

        const targetFolder = interaction.options.getString('folder') === 'logs' ? LOGS_DIR : LOGS_DEBUG_DIR;
        await createDirectoryIfNotExist(targetFolder, client.logger);

        if (interaction.options.getSubcommand() === 'list') {
            client.logger.info(`Listing log files in ${targetFolder}`);

            const targetDateString = interaction.options.getString('date');

            try {
                const fileNames = await getFileNames(targetFolder, client.logger);
                botResponse.content = ['**Logs**:'];
                fileNames.forEach(file => {
                    // list all logs if date not provided
                    if (!targetDateString) {
                        botResponse.content.push(`- ${file}`);
                    }
                    else if (file.includes(targetDateString)) {
                        botResponse.content.push(`- ${file}`);
                    }
                });
                if (botResponse.content.length === 1) {
                    botResponse.content.push('No logs found.');
                }
                botResponse.content = botResponse.content.join('\n');
            }
            catch (error) {
                botResponse.content = error;
            }

            await interaction.editReply(botResponse);
        }
        else if (interaction.options.getSubcommand() === 'manage') {
            client.logger.info(`Managing log files in ${targetFolder}`);

            const action = interaction.options.getString('action');
            const filename = interaction.options.getString('filename');
            const filePath = path.join(targetFolder, filename);

            try {
                const fileExists = await checkFileExists(filePath, client.logger);
                if (!fileExists) {
                    botResponse.content = `File "${filename}" not found.`;
                    return await interaction.editReply(botResponse);
                }

                if (action === 'download') {
                    botResponse.content = `Downloading ${filename}...`;
                    botResponse.files = [filePath];
                }
                else if (action === 'delete') {
                    await deleteFile(filePath, client.logger);
                    botResponse.content = `"${filename}" deleted!`;
                }
            }
            catch (error) {
                botResponse.content = `'''${error}'''`;
                client.logger.error('Errored', error);
            }

            await interaction.editReply(botResponse);
        }
    },
};