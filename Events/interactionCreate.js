const { Collection } = require('discord.js');

module.exports = {
    name: "interactionCreate",
    once: false,
    async run (client, interaction){
        if (interaction.isChatInputCommand()) {
            const command = interaction.client.slashCommands.get(interaction.commandName);
            
            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }

            client.logger.info(`Executing command /${command.data.name}`);

            // handle cooldowns if command exists
            const { cooldowns } = client;

            if (!cooldowns.slashCommands.has(command.data.name)) {
                cooldowns.slashCommands.set(command.data.name, new Collection());
            }

            const now = Date.now();
            const timestamps = cooldowns.slashCommands.get(command.data.name);
            const defaultCooldownDuration = 3;  // duration in seconds
            const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1000;  // convert to milliseconds

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
            } catch (error) {
                console.error(error);
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: `There was an error while executing this command!\n\`\`\`\n${error.toString()}\n\`\`\``, ephemeral: true });
                } else {
                    await interaction.reply({ content: `There was an error while executing this command!\n\`\`\`\n${error.toString()}\n\`\`\``, ephemeral: true });
                }
            }
        }
    
        if (interaction.isAutocomplete()) {
            const command = interaction.client.slashCommands.get(interaction.commandName);
    
            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }
    
            try {
                await command.autocomplete(client, interaction);
            } catch (error) {
                console.error(error);
            }
        }

        // context menu commands
        if (!interaction.isContextMenuCommand()) return;

        if (interaction.isUserContextMenuCommand()) {
            const command = interaction.client.contextMenuCommands.get(interaction.commandName);
    
            if (!command) {
                console.error(`No context command matching ${interaction.commandName} was found.`);
                return;
            }
    
            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
            }
        }
    }
}