const { SlashCommandBuilder, ActivityType } = require('discord.js');
const path = require('node:path');
const delay = require('node:timers/promises').setTimeout;

module.exports = {
    category: `Utilities`,
    cooldown: 30,
    type: `slash`,
    data: new SlashCommandBuilder()
        .setName('reload')
        .setDescription('Reloads bot data')
        .addSubcommand(subcommand =>
            subcommand
                .setName('command')
                .setDescription('Reloads specific commands')
                .addStringOption(option =>
                    option
                        .setName('name')
                        .setDescription('Name for the command')
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option
                        .setName('category')
                        .setDescription('The command category')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('cooldowns')
                .setDescription('Reset cooldowns')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('embeds')
                .setDescription('Reloads embed data')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('bot')
                .setDescription('Restart the bot')
        )
    ,
    async execute(interaction) {
        const { client } = interaction;
        const baseDir = process.cwd();

        if (interaction.options.getSubcommand() === 'command') {
            let commandName = interaction.options.getString('name');
            const commandCategory = interaction.options.getString('category');

            const command = interaction.client.slashCommands.get(commandName);

            if (!command) {
                return interaction.reply(`There's no command with name \`${commandName}\`.`);
            }

            const commandPath = path.join(baseDir, 'CommandsSlash', commandCategory, command.data.name + '.js');

            delete require.cache[require.resolve(commandPath)];

            try {
                interaction.client.slashCommands.delete(command.data.name);
                const newCommand = require(commandPath);
                interaction.client.slashCommands.set(newCommand.data.name, newCommand);
                await interaction.reply(`Command \`${newCommand.data.name}\` was reloaded!`);
            } catch (error) {
                console.error(error);
                await interaction.reply(`There was an error while reloading a command \`${command.data.name}\`:\n\`${error.message}\``);
            }
        }
        else if (interaction.options.getSubcommand() === 'cooldowns') {
            return await interaction.reply({ content: 'Not available yet', ephemeral: true });
        }
        else if (interaction.options.getSubcommand() === 'embeds') {
            const embedsJsonPath = path.join(baseDir, 'JSON', 'embeds.json');
            delete require.cache[require.resolve(embedsJsonPath)];
            client.botData.embeds = require(embedsJsonPath);
            return await interaction.reply({ content: 'Embeds restored to default.', ephemeral: true });
        }
        else if (interaction.options.getSubcommand() === 'bot') {
            return await interaction.reply({ content: 'Not available yet', ephemeral: true });
        }
    }
}