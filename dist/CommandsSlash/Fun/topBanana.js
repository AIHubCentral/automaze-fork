"use strict";
const { SlashCommandBuilder } = require('discord.js');
module.exports = {
    category: 'Fun',
    cooldown: 15,
    type: 'slash',
    data: new SlashCommandBuilder()
        .setName('topbanana')
        .setDescription('SEE HOW MUCH SOMEONE GOT BANAN!!!!11!111!11'),
    async execute(interaction) {
        const client = interaction.client;
        await interaction.deferReply();
        const embedData = {
            title: 'THE FORTNITE BALLS LEADERBANAN',
            color: 'Yellow',
            timestamp: true,
            description: [],
        };
        const users = await client.knexInstance('user').orderBy('bananas', 'desc').limit(15);
        if (users.length === 0) {
            embedData.description.push('> The leaderboard is empty, `/banana` someone to show results here!');
            return await interaction.editReply({ embeds: [client.botUtils.createEmbed(embedData)] });
        }
        let rankCounter = 1;
        for (const entry of users) {
            const user = entry;
            const userDisplay = user.display_name ?? user.username;
            const userProfileLink = 'https://discordapp.com/users/' + user.id;
            embedData.description.push(`${rankCounter}. [${userDisplay}](${userProfileLink}) — ${user.bananas}`);
            rankCounter++;
        }
        await interaction.editReply({ embeds: [client.botUtils.createEmbed(embedData)] });
    },
};
