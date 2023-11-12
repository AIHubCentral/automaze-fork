const { SlashCommandBuilder } = require('discord.js');
const delay = require('node:timers/promises').setTimeout;
const fs = require('node:fs');
const path = require('node:path');

module.exports = {
    category: `Utilities`,
    cooldown: 15,
    type: `slash`,
    data: new SlashCommandBuilder()
        .setName('logs')
        .setDescription('Manage bot logs')
        .addSubcommand(subcommand =>
            subcommand
                .setName('list')
                .setDescription('List all log files')
                .addStringOption(option =>
                    option
                        .setName('date')
                        .setDescription('Filter logs by date in the yyyy-mm-dd format')
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('manage')
                .setDescription('Manages a log file')
                .addStringOption(option =>
                    option
                        .setName('action')
                        .setDescription('Choose an action to do on a log file')
                        .setRequired(true)
                        .addChoices(
                            { name: 'download', value: 'download' },
                            { name: 'delete', value: 'delete' }
                        )
                )
                .addStringOption(option =>
                    option
                        .setName('filename')
                        .setDescription('Name of the log file')
                        .setRequired(true)
                )
        )
    ,
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const client = interaction.client;
        const botResponse = {};

        if (interaction.options.getSubcommand() === 'list') {
            const targetDateString = interaction.options.getString('date');

            // log files in this dir
            const targetDirectory = path.join(process.cwd(), 'Debug');

            try {
                const filesInDir = fs.readdirSync(targetDirectory);
                botResponse.content = ['**Logs**:'];
                filesInDir.forEach(file => {
                    // list all logs if date not provided
                    if (!targetDateString) {
                        botResponse.content.push(`- ${file}`);
                    }
                    else {
                        if (file.includes(targetDateString)) {
                            botResponse.content.push(`- ${file}`);
                        }
                    }
                });
                if (botResponse.content.length === 1) {
                    botResponse.content.push('No logs found.')
                }
                botResponse.content = botResponse.content.join('\n');
            }
            catch (error) {
                botResponse.content = error;
            }

            await interaction.editReply(botResponse);
        }
        else if (interaction.options.getSubcommand() === 'manage') {
            const action = interaction.options.getString('action');
            const filename = interaction.options.getString('filename');
            const filePath = path.join(process.cwd(), 'Debug', filename);

            if (!fs.existsSync(filePath)) {
                botResponse.content = `File "${filename}" not found.`;
            }
            else {
                try {
                    if (action === 'download') {
                        botResponse.content = `Downloading ${filename}...`;
                        botResponse.files = [filePath];
                    }
                    else if (action === 'delete') {
                        fs.unlinkSync(filePath);
                        botResponse.content = `"${filename}" deleted!`;
                    }
                }
                catch (error) {
                    botResponse.content = `${error}`;
                }
            }

            await interaction.editReply(botResponse);
        }
    }
}