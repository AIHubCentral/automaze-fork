const { Collection } = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    once: false,
    async run(client, interaction) {
        if (interaction.isChatInputCommand()) {
            const command = interaction.client.slashCommands.get(interaction.commandName);

            if (!command) {
                client.logger.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }

            client.logger.info(`Executing command /${command.data.name} - guild:${interaction.guild.id};channel:${interaction.channel.id}`);

            // handle cooldowns if command exists
            const { cooldowns } = client;

            if (!cooldowns.slashCommands.has(command.data.name)) {
                cooldowns.slashCommands.set(command.data.name, new Collection());
            }

            const now = Date.now();
            const timestamps = cooldowns.slashCommands.get(command.data.name);
            // duration in seconds
            const defaultCooldownDuration = 3;
            // convert to milliseconds
            const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1000; 

            if (timestamps.has(interaction.user.id)) {
                const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

                if (now < expirationTime) {
                    const expiredTimestamp = Math.round(expirationTime / 1000);
                    return interaction.reply({ content: `Please wait, you are on a cooldown for \`/${command.data.name}\`. You can use it again <t:${expiredTimestamp}:R>`, ephemeral: true });
                }
            }

            timestamps.set(interaction.user.id, now);
            setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

            try {
                await command.execute(interaction);
            }
            catch (error) {
                client.logger.error(`Failed to execute command ${command.data.name}`, error);
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: `There was an error while executing this command!\n\`\`\`\n${error.toString()}\n\`\`\``, ephemeral: true });
                }
                else {
                    await interaction.reply({ content: `There was an error while executing this command!\n\`\`\`\n${error.toString()}\n\`\`\``, ephemeral: true });
                }
            }
        }

        if (interaction.isAutocomplete()) {
            const command = interaction.client.slashCommands.get(interaction.commandName);

            if (!command) {
                client.logger.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }

            try {
                await command.autocomplete(client, interaction);
            }
            catch (error) {
                client.logger.error(error);
            }
        }

        // context menu commands
        if (!interaction.isContextMenuCommand()) return;

        if (interaction.isUserContextMenuCommand()) {
            const command = interaction.client.contextMenuCommands.get(interaction.commandName);

            if (!command) {
                client.logger.error(`No context command matching ${interaction.commandName} was found.`);
                return;
            }

            try {
                await command.execute(interaction);
            }
            catch (error) {
                client.logger.error(error);
            }
        }
    },
};