"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const userService_1 = __importDefault(require("../../Services/userService"));
const discordUtilities_1 = require("../../Utils/discordUtilities");
const TopBanana = {
    category: 'Fun',
    cooldown: 15,
    data: new discord_js_1.SlashCommandBuilder()
        .setName('topbanana')
        .setDescription('SEE HOW MUCH SOMEONE GOT BANAN!!!!11!111!11')
        .addIntegerOption((option) => option.setName('limit').setDescription('How many users to show (max 50)')),
    async execute(interaction) {
        const client = interaction.client;
        await interaction.deferReply();
        const embedData = {
            title: 'THE FORTNITE BALLS LEADERBANAN',
            color: 'Yellow',
            timestamp: true,
            description: [],
        };
        const userService = new userService_1.default(client.knexInstance);
        let totalToShow = interaction.options.getInteger('limit') ?? 15;
        if (totalToShow > 50) {
            totalToShow = 50;
        }
        const users = await userService.getAll('bananas', true, totalToShow);
        //client.knexInstance('user').orderBy('bananas', 'desc').limit(15);
        if (users.length === 0) {
            embedData.description?.push('> The leaderboard is empty, `/banana` someone to show results here!');
            await interaction.editReply({ embeds: [(0, discordUtilities_1.createEmbed)(embedData)] });
            return;
        }
        let rankCounter = 1;
        for (const entry of users) {
            const user = entry;
            const userDisplay = user.displayName ?? user.userName;
            const userProfileLink = 'https://discordapp.com/users/' + user.id;
            embedData.description?.push(`${rankCounter}. [${userDisplay}](${userProfileLink}) — ${user.bananas}`);
            rankCounter++;
        }
        await interaction.editReply({ embeds: [(0, discordUtilities_1.createEmbed)(embedData)] });
    },
};
exports.default = TopBanana;
