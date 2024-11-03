import { SlashCommandBuilder } from 'discord.js';
import { SlashCommand } from '../../Interfaces/Command';
import { EmbedData } from '../../Interfaces/BotData';
import { createEmbed } from '../../Utils/discordUtilities';
import { getAllUsers } from '../../Services/userService';
import knexInstance from '../../db';

const TopBanana: SlashCommand = {
    category: 'Fun',
    cooldown: 15,
    data: new SlashCommandBuilder()
        .setName('topbanana')
        .setDescription('SEE HOW MUCH SOMEONE GOT BANAN!!!!11!111!11')
        .addIntegerOption((option) =>
            option.setName('limit').setDescription('How many users to show (max 50)')
        ),
    async execute(interaction) {
        await interaction.deferReply();

        const embedData: EmbedData = {
            title: 'THE FORTNITE BALLS LEADERBANAN',
            color: 'Yellow',
            timestamp: true,
            description: [],
        };

        let totalToShow = interaction.options.getInteger('limit') ?? 15;

        if (totalToShow > 50) {
            totalToShow = 50;
        }

        const users = await getAllUsers(knexInstance, totalToShow, 'bananas', 'desc');

        if (users.length === 0) {
            embedData.description?.push(
                '> The leaderboard is empty, `/banana` someone to show results here!'
            );
            await interaction.editReply({ embeds: [createEmbed(embedData)] });
            return;
        }

        let rankCounter = 1;
        for (const entry of users) {
            const user = entry;
            const userDisplay = user.display_name ?? user.username;
            const userProfileLink = 'https://discordapp.com/users/' + user.id;
            embedData.description?.push(
                `${rankCounter}. [${userDisplay}](${userProfileLink}) — ${user.bananas}`
            );
            rankCounter++;
        }

        await interaction.editReply({ embeds: [createEmbed(embedData)] });
    },
};

export default TopBanana;
