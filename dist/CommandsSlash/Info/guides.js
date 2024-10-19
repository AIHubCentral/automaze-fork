"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const discordUtilities_1 = require("../../Utils/discordUtilities");
const slashCommandData_json_1 = __importDefault(require("../../../JSON/slashCommandData.json"));
const pretty_ms_1 = __importDefault(require("pretty-ms"));
const botUtilities_1 = require("../../Utils/botUtilities");
const i18n_1 = __importDefault(require("../../i18n"));
const commandData = slashCommandData_json_1.default.guides;
const Guides = {
    category: 'Info',
    data: new discord_js_1.SlashCommandBuilder()
        .setName(commandData.name)
        .setDescription(commandData.description)
        .setDescriptionLocalizations(commandData.descriptionLocalizations)
        .addStringOption((0, discordUtilities_1.createStringOption)(commandData.options.category))
        .addStringOption((0, discordUtilities_1.createStringOption)(commandData.options.language))
        .addBooleanOption((option) => option
        .setName(commandData.options.private.name)
        .setNameLocalizations(commandData.options.private.nameLocalizations)
        .setDescription(commandData.options.private.description)
        .setDescriptionLocalizations(commandData.options.private.descriptionLocalizations)),
    async execute(interaction) {
        const startTime = Date.now();
        const category = interaction.options.getString('category', true);
        const language = interaction.options.getString('language') ?? interaction.locale;
        const ephemeral = interaction.options.getBoolean('private') ?? false;
        const mainUser = interaction.user;
        const client = interaction.client;
        const { botCache, logger } = client;
        if (['pt', 'es', 'it'].includes(language)) {
            return await interaction.reply({
                content: i18n_1.default.t('general.translation_not_available', { lng: language }),
                ephemeral: true,
            });
        }
        if (category === 'audio') {
            const resources = await (0, botUtilities_1.getResourceData)('audio', botCache, logger);
            if (resources.length === 0) {
                await interaction.reply({
                    content: i18n_1.default.t('general.not_available', { lng: language }),
                    ephemeral: true,
                });
                return;
            }
            const embed = (0, discordUtilities_1.createEmbed)({
                title: i18n_1.default.t('tags.audio.embed.title', { lng: language }),
                description: [(0, botUtilities_1.resourcesToUnorderedListAlt)(resources)],
                footer: i18n_1.default.t('tags.audio.embed.footer'),
            }, discord_js_1.Colors.Blue);
            logger.info(`sent guides with /${interaction.commandName}`, {
                guildId: interaction.guildId,
                channelId: interaction.channelId,
                params: {
                    category,
                    language,
                    ephemeral,
                },
                executionTime: (0, pretty_ms_1.default)(Date.now() - startTime),
            });
            return await interaction.reply({ embeds: [embed], ephemeral });
        }
        else if (category === 'paperspace') {
            const content = i18n_1.default.t('tags.paperspace', { lng: language, returnObjects: true });
            const embed = (0, discordUtilities_1.createEmbed)(content.embed, discord_js_1.Colors.Blue);
            logger.info(`sent guides with /${interaction.commandName}`, {
                guildId: interaction.guildId,
                channelId: interaction.channelId,
                params: {
                    category,
                    language,
                    ephemeral,
                },
                executionTime: (0, pretty_ms_1.default)(Date.now() - startTime),
            });
            return await interaction.reply({ embeds: [embed], ephemeral });
        }
        else if (category === 'realtime') {
            await (0, botUtilities_1.handleSendRealtimeGuides)(interaction, undefined, mainUser, ephemeral);
            return;
        }
        else if (category === 'rvc') {
            const content = i18n_1.default.t('tags.rvc.embeds', {
                lng: language,
                returnObjects: true,
            });
            const embeds = (0, discordUtilities_1.createEmbeds)(content, [discord_js_1.Colors.Aqua, discord_js_1.Colors.Blue, discord_js_1.Colors.DarkBlue]);
            logger.info(`sent guides with /${interaction.commandName}`, {
                guildId: interaction.guildId,
                channelId: interaction.channelId,
                params: {
                    category,
                    language,
                    ephemeral,
                },
                executionTime: (0, pretty_ms_1.default)(Date.now() - startTime),
            });
            return await interaction.reply({ embeds, ephemeral });
        }
        else if (category === 'uvr') {
            const content = i18n_1.default.t('tags.uvr', {
                lng: language,
                returnObjects: true,
            });
            logger.info(`sent guides with /${interaction.commandName}`, {
                guildId: interaction.guildId,
                channelId: interaction.channelId,
                params: {
                    category,
                    language,
                    ephemeral,
                },
                executionTime: (0, pretty_ms_1.default)(Date.now() - startTime),
            });
            return await interaction.reply({
                embeds: [(0, discordUtilities_1.createEmbed)(content.embed)],
                components: [(0, discordUtilities_1.createButtons)(content.buttons)],
                ephemeral,
            });
        }
    },
};
exports.default = Guides;
