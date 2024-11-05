"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const botUtilities_js_1 = require("../../Utils/botUtilities.js");
const db_js_1 = __importDefault(require("../../db.js"));
const i18next_1 = __importDefault(require("i18next"));
const discordUtilities_js_1 = require("../../Utils/discordUtilities.js");
const Banana = {
    category: 'Fun',
    data: new discord_js_1.SlashCommandBuilder()
        .setName('banana')
        .setDescription('BANAN SOMEOME!!!!11!111!11')
        .addUserOption((option) => option.setName('user').setDescription('User to banan').setRequired(true)),
    async execute(interaction) {
        const client = interaction.client;
        const targetUser = interaction.options.getUser('user', true);
        if (targetUser.bot) {
            await interaction.reply({
                content: i18next_1.default.t('general.bot_user', { lng: interaction.locale }),
                ephemeral: true,
            });
            return;
        }
        const bananManager = new botUtilities_js_1.BananManager(db_js_1.default, interaction.user.id, client.cooldowns.banana);
        if (bananManager.isAuthorOnCooldown() && !bananManager.isCooldownExpired()) {
            await interaction.reply(`dumbass yuo alredy banan ppl, wait GRRRRRRRRRRRRRRR!!!!!!!!!!!!!!!!!!!!!!!! yu gto ${client.cooldowns.banana.get(interaction.user.id) - Date.now()} milliseconds left im too lazy to do math do it yourself GRRRRRRRRRR`);
            return;
        }
        await interaction.deferReply();
        const targetUserDisplayName = await (0, discordUtilities_js_1.getDisplayName)(targetUser, interaction.guild);
        try {
            const embed = await bananManager.banan({
                id: targetUser.id,
                username: targetUser.username,
                display_name: targetUserDisplayName === targetUser.username ? '' : targetUserDisplayName,
            });
            await interaction.editReply({ embeds: [embed] });
        }
        catch (error) {
            client.logger.error('failed to banan', error);
            await interaction.editReply({ content: 'Failed to banan user' });
        }
    },
};
exports.default = Banana;
