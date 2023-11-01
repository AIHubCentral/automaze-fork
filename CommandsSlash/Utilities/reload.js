const { SlashCommandBuilder, ActivityType, Collection } = require('discord.js');
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
                .addStringOption(option =>
                    option
                        .setName('user_id')
                        .setDescription('Resets the cooldowns for a specific user')
                )
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
            const targetUserId =  interaction.options.getString('user_id');
            const botResponse = { content: ['### Result'], ephemeral: true };
            if (targetUserId) {
                client.cooldowns.reactions.delete(targetUserId);
                botResponse.content.push(`- Reaction cooldown reseted for ${targetUserId}`);

                client.cooldowns.slashCommands.delete(targetUserId);
                botResponse.content.push(`- Slash commands cooldown reseted for ${targetUserId}`);

                client.cooldowns.banana.delete(targetUserId);
                botResponse.content.push(`- Banan cooldown reseted for ${targetUserId}`);
            } else {
                client.cooldowns.reactions = new Collection();
                botResponse.content.push('- Reseted reaction cooldowns for every user');

                client.cooldowns.slashCommands = new Collection();
                botResponse.content.push('- Reseted slash commands cooldowns for every user');

                client.cooldowns.banan = new Collection();
                botResponse.content.push('- Reseted banan cooldowns for every user');
            }
            botResponse.content = botResponse.content.join('\n');
            return await interaction.reply(botResponse);
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