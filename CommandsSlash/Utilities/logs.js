const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ComponentType,
    ButtonBuilder, ButtonStyle,
} = require('discord.js');

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

function generateEmbeds(logFiles, itemsPerPage) {
    /* generate embeds for implementing pagination */

    const embeds = [];

    for (let i = 0; i < logFiles.length; i += itemsPerPage) {
        const currentItems = logFiles.slice(i, i + itemsPerPage);

        // Create a new Embed for each page
        const embed = new EmbedBuilder()
            .setColor('Blurple')
            .setTitle('Logs')
            .setDescription(currentItems.join('\n'))
            .setTimestamp();

        // Add the embed to the array of embeds
        embeds.push(embed);
    }

    return embeds;
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

                if (fileNames.length === 0) {
                    return await interaction.editReply('No logs found.');
                }

                botResponse.content = ['**Logs**:'];

                const itemsPerPage = 15;
                let currentPage = 0;
                const embeds = generateEmbeds(fileNames, itemsPerPage);

                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('previous')
                            .setLabel('Previous')
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(true),
                        new ButtonBuilder()
                            .setCustomId('next')
                            .setLabel('Next')
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(fileNames.length <= itemsPerPage),
                    );

                botResponse.content = botResponse.content.join('\n');
                botResponse.embeds = [embeds[currentPage]];
                botResponse.components = [row];

                const response = await interaction.editReply(botResponse);

                // handle pagination buttons
                const collector = response.createMessageComponentCollector({
                    componentType: ComponentType.Button,
                    time: 120_000,
                });

                collector.on('collect', async (i) => {
                    if (i.customId === 'next') {
                        currentPage = Math.min(currentPage + 1, embeds.length - 1);
                        console.log('next');
                    }
                    else if (i.customId === 'previous') {
                        currentPage = Math.max(currentPage - 1, 0);
                        console.log('previous');
                    }

                    await i.update({
                        embeds: [embeds[currentPage]],
                        components: [row],
                    });

                    // Update the buttons' disabled state based on the current page
                    row.components[0].setDisabled(currentPage === 0);
                    row.components[1].setDisabled(currentPage === embeds.length - 1);
                });

                collector.on('end', collected => {
                    client.logger.info(`Collected ${collected.size} interactions on ${interaction.channel.id}.`);
                    // disable the buttons after the collector ends
                    row.components.forEach(button => button.setDisabled(true));
                    interaction.editReply({
                        content:'This interaction has expired.',
                        components: [],
                        embeds: [],
                    });
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