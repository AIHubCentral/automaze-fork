"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Help = {
    category: 'Info',
    data: new discord_js_1.SlashCommandBuilder()
        .setName('help')
        .setDescription('Displays info about Automaze commands.'),
    async execute(interaction) {
        const client = interaction.client;
        await interaction.reply({ content: client.botResponses.responses.help.join('\n'), ephemeral: true });
    }
};
exports.default = Help;
