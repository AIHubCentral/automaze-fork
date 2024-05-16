"use strict";
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ComponentType, ButtonBuilder, ButtonStyle, } = require('discord.js');
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
        .addSubcommand(subcommand => subcommand
        .setName('list')
        .setDescription('List all log files')
        .addStringOption(option => option
        .setName('folder')
        .setDescription('Where to look for the log files')
        .setRequired(true)
        .addChoices({ name: 'Logs', value: 'logs' }, { name: 'Debug', value: 'debug' }))
        .addStringOption(option => option
        .setName('date')
        .setDescription('Filter logs by date in the yyyy-mm-dd format')))
        .addSubcommand(subcommand => subcommand
        .setName('manage')
        .setDescription('Manages a log file')
        .addStringOption(option => option
        .setName('folder')
        .setDescription('Where to look for the log files')
        .setRequired(true)
        .addChoices({ name: 'Logs', value: 'logs' }, { name: 'Debug', value: 'debug' }))
        .addStringOption(option => option
        .setName('action')
        .setDescription('Choose an action to do on a log file')
        .setRequired(true)
        .addChoices({ name: 'download', value: 'download' }, { name: 'delete', value: 'delete' }))
        .addStringOption(option => option
        .setName('filename')
        .setDescription('Name of the log file')
        .setRequired(true))),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const { client } = interaction;
        const botResponse = {};
        const targetFolder = interaction.options.getString('folder') === 'logs' ? LOGS_DIR : LOGS_DEBUG_DIR;
        await createDirectoryIfNotExist(targetFolder, client.logger);
        if (interaction.options.getSubcommand() === 'list') {
            client.logger.debug(`Listing log files in ${targetFolder}`);
            const targetDateString = interaction.options.getString('date');
            try {
                const fileNames = await getFileNames(targetFolder, client.logger);
                if (fileNames.length === 0) {
                    return await interaction.editReply('No log found.');
                }
                const itemsPerPage = 15;
                const pages = Math.ceil(fileNames.length / itemsPerPage);
                let currentPage = 1;
                const getEmbed = (page) => {
                    const startIndex = (page - 1) * itemsPerPage;
                    const endIndex = Math.min(page * itemsPerPage, fileNames.length);
                    const listedItems = fileNames.slice(startIndex, endIndex);
                    const embed = new EmbedBuilder()
                        .setTitle('Logs')
                        .setDescription(listedItems.join('\n'))
                        .setColor('Blurple')
                        .setFooter({ text: `Page ${currentPage} of ${pages}` });
                    const row = new ActionRowBuilder();
                    row.addComponents(new ButtonBuilder()
                        .setCustomId('previous')
                        .setLabel('Previous')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(currentPage === 1));
                    row.addComponents(new ButtonBuilder()
                        .setCustomId('next')
                        .setLabel('Next')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(currentPage === pages));
                    return { embeds: [embed], components: [row] };
                };
                const response = await interaction.editReply(getEmbed(currentPage));
                const interactionDuration = 60000;
                const collector = response.createMessageComponentCollector({
                    componentType: ComponentType.Button,
                    time: interactionDuration,
                });
                collector.on('collect', async (buttonInteraction) => {
                    if (!buttonInteraction.isButton())
                        return;
                    await buttonInteraction.deferUpdate();
                    if (buttonInteraction.customId === 'previous') {
                        currentPage--;
                    }
                    else if (buttonInteraction.customId === 'next') {
                        currentPage++;
                    }
                    await buttonInteraction.editReply(getEmbed(currentPage));
                    // Reset timeout on interaction
                    collector.resetTimer();
                });
                collector.on('end', async () => {
                    const embed = new EmbedBuilder()
                        .setTitle('Users')
                        .setDescription('Interaction timed out.')
                        .setColor('Red');
                    await interaction.editReply({ embeds: [embed], components: [] });
                });
            }
            catch (error) {
                return await interaction.editReply('```javascript\n' + error + '\n```');
            }
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
                botResponse.content = '```javascript\n' + error + '\n```';
                client.logger.error('Errored', error);
            }
            await interaction.editReply(botResponse);
        }
    },
};
