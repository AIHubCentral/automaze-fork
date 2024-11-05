"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const discordUtilities_1 = require("../../Utils/discordUtilities");
const db_1 = __importDefault(require("../../db"));
const userService_1 = __importDefault(require("../../Services/userService"));
const TopBanana = {
    category: 'Fun',
    cooldown: 15,
    data: new discord_js_1.SlashCommandBuilder()
        .setName('topbanana')
        .setDescription('SEE HOW MUCH SOMEONE GOT BANAN!!!!11!111!11')
        .addIntegerOption((option) => option.setName('limit').setDescription('How many users to show (max 50)')),
    async execute(interaction) {
        await interaction.deferReply();
        const embedData = {
            title: 'THE FORTNITE BALLS LEADERBANAN',
            color: 'Yellow',
            timestamp: true,
            description: [],
        };
        let totalToShow = interaction.options.getInteger('limit') ?? 15;
        if (totalToShow > 50) {
            totalToShow = 50;
        }
        const service = new userService_1.default(db_1.default);
        const result = await service.findAll({
            limit: totalToShow,
            sortBy: 'bananas',
            sortOrder: 'desc',
        });
        if (result.data.length === 0) {
            embedData.description?.push('> The leaderboard is empty, `/banana` someone to show results here!');
            await interaction.editReply({ embeds: [(0, discordUtilities_1.createEmbed)(embedData)] });
            return;
        }
        let rankCounter = 1;
        for (const entry of result.data) {
            const user = entry;
            const userDisplay = user.display_name ?? user.username;
            const userProfileLink = 'https://discordapp.com/users/' + user.id;
            embedData.description?.push(`${rankCounter}. [${userDisplay}](${userProfileLink}) — ${user.bananas}`);
            rankCounter++;
        }
        await interaction.editReply({ embeds: [(0, discordUtilities_1.createEmbed)(embedData)] });
    },
};
exports.default = TopBanana;
