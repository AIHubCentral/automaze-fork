import { SlashCommandBuilder } from 'discord.js';
import { SlashCommand } from '../../Interfaces/Command';
import ExtendedClient from '../../Core/extendedClient';

const Help: SlashCommand = {
    category: 'Info',
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Displays info about Automaze commands.')
    ,
    async execute(interaction) {
        const client = interaction.client as ExtendedClient;
        await interaction.reply({ content: client.botResponses.responses.help.join('\n'), ephemeral: true });
    }
};

export default Help;