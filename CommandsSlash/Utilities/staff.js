const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    category: `Utilities`,
    type: `slash`, 
    data: new SlashCommandBuilder()
                .setName('staff')
                .setDescription('See staff activities'),
    async execute(client, interaction) {
        await interaction.reply({content: 'test', ephemeral:true});
    }
}
