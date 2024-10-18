"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const i18n_1 = __importDefault(require("../../i18n"));
const botUtilities_1 = require("../../Utils/botUtilities");
const SendRealtimeGuides = {
    category: 'Tags',
    data: new discord_js_1.ContextMenuCommandBuilder()
        .setName('Send Realtime guides')
        .setType(discord_js_1.ApplicationCommandType.User),
    async execute(interaction) {
        const client = interaction.client;
        const { targetUser } = interaction;
        const { logger } = client;
        if (targetUser.bot) {
            logger.warn(`tried sending ${interaction.commandName} to a bot user`);
            return await interaction.reply({
                content: i18n_1.default.t('general.bot_user', { lng: interaction.locale }),
                ephemeral: true,
            });
        }
        await (0, botUtilities_1.handleSendRealtimeGuides)(interaction, targetUser, interaction.user);
    },
};
exports.default = SendRealtimeGuides;
