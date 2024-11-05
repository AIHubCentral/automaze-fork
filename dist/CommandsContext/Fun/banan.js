"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* context menu version of /banana */
const discord_js_1 = require("discord.js");
const i18n_1 = __importDefault(require("../../i18n"));
const discordUtilities_1 = require("../../Utils/discordUtilities");
const db_1 = __importDefault(require("../../db"));
const botUtilities_1 = require("../../Utils/botUtilities");
const Banan = {
    category: 'Fun',
    data: new discord_js_1.ContextMenuCommandBuilder()
        .setName('banan')
        .setType(discord_js_1.ApplicationCommandType.User),
    async execute(interaction) {
        const client = interaction.client;
        const targetUser = interaction.targetUser;
        if (targetUser.bot) {
            await interaction.reply({
                content: i18n_1.default.t('general.bot_user', { lng: interaction.locale }),
                ephemeral: true,
            });
            return;
        }
        const bananManager = new botUtilities_1.BananManager(db_1.default, interaction.user.id, client.cooldowns.banana);
        if (bananManager.isAuthorOnCooldown() && !bananManager.isCooldownExpired()) {
            await interaction.reply(`dumbass yuo alredy banan ppl, wait GRRRRRRRRRRRRRRR!!!!!!!!!!!!!!!!!!!!!!!! yu gto ${client.cooldowns.banana.get(interaction.user.id) - Date.now()} milliseconds left im too lazy to do math do it yourself GRRRRRRRRRR`);
            return;
        }
        await interaction.deferReply();
        const targetUserDisplayName = await (0, discordUtilities_1.getDisplayName)(targetUser, interaction.guild);
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
exports.default = Banan;
