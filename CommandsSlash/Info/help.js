const { SlashCommandBuilder} = require('discord.js');

module.exports = {
    category: 'Info',
    type: 'slash',
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Displays info about Automaze commands.')
    ,
    async execute(interaction) {
        await interaction.reply({ content: 'This command will be available soon, stay tuned!', ephemeral: true });
    }
};