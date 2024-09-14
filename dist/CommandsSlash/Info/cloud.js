"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const botUtilities_1 = require("../../Utils/botUtilities");
const slashCommandData_json_1 = __importDefault(require("../../../JSON/slashCommandData.json"));
const cloudCommandData = slashCommandData_json_1.default.cloud;
const Cloud = {
    category: 'Info',
    cooldown: 5,
    data: new discord_js_1.SlashCommandBuilder()
        .setName(cloudCommandData.name)
        .setDescription(cloudCommandData.description)
        .setDescriptionLocalizations(cloudCommandData.descriptionLocalizations)
        .addStringOption(option => option
        .setName(cloudCommandData.options.platform.name)
        .setNameLocalizations(cloudCommandData.options.platform.nameLocalizations)
        .setDescription(cloudCommandData.options.platform.description)
        .setDescriptionLocalizations(cloudCommandData.options.platform.descriptionLocalizations)
        .addChoices({ name: 'colab', value: botUtilities_1.CloudPlatform.Colab }, { name: 'huggingface', value: botUtilities_1.CloudPlatform.Huggingface }, { name: 'kaggle', value: botUtilities_1.CloudPlatform.Kaggle }, { name: 'lightning', value: botUtilities_1.CloudPlatform.Lightning })
        .setRequired(true)),
    async execute(interaction) {
        const client = interaction.client;
        const logData = {
            guildId: interaction.guildId,
            channelId: interaction.channelId,
            userId: interaction.user.id,
            userName: interaction.user.username,
        };
        client.logger.debug('/cloud', logData);
        const { botCache, logger } = client;
        const platform = interaction.options.getString('platform', true);
        const resources = await (0, botUtilities_1.getResourceData)(platform, botCache, logger);
        const embed = new discord_js_1.EmbedBuilder()
            .setTitle("Not available yet")
            .setColor(discord_js_1.Colors.Grey)
            .setDescription("Stay tuned!");
        if (resources.length === 0) {
            await interaction.reply({ embeds: [embed], ephemeral: true });
            return;
        }
        if (platform === botUtilities_1.CloudPlatform.Colab) {
            embed
                .setTitle("☁️ Google Colabs")
                .setColor("f9ab00")
                .setDescription((0, botUtilities_1.resourcesToUnorderedList)(resources));
        }
        else if (platform === botUtilities_1.CloudPlatform.Huggingface) {
            embed
                .setTitle("<:huggingface:1179800228946268270> Hugginface Spaces")
                .setColor("ffcc4d")
                .setDescription((0, botUtilities_1.resourcesToUnorderedList)(resources));
        }
        else if (platform === botUtilities_1.CloudPlatform.Kaggle) {
            embed
                .setTitle("📘 Kaggle Notebooks")
                .setColor(discord_js_1.Colors.Blue)
                .setDescription((0, botUtilities_1.resourcesToUnorderedList)(resources));
        }
        else if (platform === botUtilities_1.CloudPlatform.Lightning) {
            embed
                .setTitle("⚡ Lightning AI")
                .setColor("b45aff")
                .setDescription((0, botUtilities_1.resourcesToUnorderedList)(resources));
        }
        await interaction.reply({ embeds: [embed] });
    }
};
exports.default = Cloud;
