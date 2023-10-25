const { SlashCommandBuilder} = require('discord.js');

module.exports = {
    category: 'Info',
    type: 'slash',
    data: new SlashCommandBuilder()
        .setName('guides')
        .setDescription('Guides for RVC (how to make ai cover).')
        .addStringOption(option =>
            option.setName('category')
                .setDescription('Choose a category')
                .setRequired(true)
                .addChoices(
                    { name: 'RVC', value: 'rvc' },
                    { name: 'Audio', value: 'audio' },
                    { name: 'Colab', value: 'colab' },
                    { name: 'Paperspace', value: 'paperspace' },
                    { name: 'Realtime', value: 'realtime' },
                    { name: 'Upload', value: 'upload' },
                )
        )
        .addStringOption(option =>
            option.setName('language')
                .setDescription('(Optional) Choose a language by country')
                .addChoices(
                    { name: 'EN', value: 'en' },
                )
        )
        .addUserOption(option =>
            option.setName('user')
                .setDescription('(Optional) Send this guide to a user')
        )
    ,
    async execute(interaction) {
        await interaction.reply({ content: 'This command will be available soon, stay tuned!', ephemeral: true });
    }
};