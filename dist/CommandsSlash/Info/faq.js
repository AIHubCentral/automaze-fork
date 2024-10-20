"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const slashCommandData_json_1 = __importDefault(require("../../../JSON/slashCommandData.json"));
const i18next_1 = __importDefault(require("i18next"));
const generalUtilities_1 = require("../../Utils/generalUtilities");
const discordUtilities_1 = require("../../Utils/discordUtilities");
const commandData = slashCommandData_json_1.default.faq;
const Faq = {
    category: 'Info',
    cooldown: 5,
    data: new discord_js_1.SlashCommandBuilder()
        .setName(commandData.name)
        .setDescription(commandData.description)
        .setDescriptionLocalizations(commandData.descriptionLocalizations)
        .addStringOption((option) => option
        .setName(commandData.options.topic.name)
        .setNameLocalizations(commandData.options.topic.nameLocalizations)
        .setDescription(commandData.options.topic.description)
        .setDescriptionLocalizations(commandData.options.topic.descriptionLocalizations)
        .setAutocomplete(true)
        .setRequired(true))
        .addStringOption((option) => option
        .setName(commandData.options.language.name)
        .setNameLocalizations(commandData.options.language.nameLocalizations)
        .setDescription(commandData.options.language.description)
        .setDescriptionLocalizations(commandData.options.language.descriptionLocalizations)
        .addChoices(commandData.options.language.choices)
        .setRequired(false))
        .addBooleanOption((option) => option
        .setName(commandData.options.private.name)
        .setNameLocalizations(commandData.options.private.nameLocalizations)
        .setDescription(commandData.options.private.description)
        .setDescriptionLocalizations(commandData.options.private.descriptionLocalizations)
        .setRequired(false)),
    async autocomplete(interaction) {
        const topic = interaction.options.getString('topic', true);
        const allTopics = i18next_1.default.t('faq.topics', { returnObjects: true });
        const suggestions = Object.keys(allTopics).filter((topicItem) => topicItem.toLowerCase().includes(topic.toLowerCase().trim()));
        await interaction.respond(suggestions.map((suggestion) => ({ name: suggestion, value: suggestion })));
    },
    async execute(interaction) {
        const topic = interaction.options.getString('topic', true);
        const language = interaction.options.getString('language') || interaction.locale;
        const ephemeral = interaction.options.getBoolean('private') || false;
        const client = interaction.client;
        const { logger } = client;
        const logData = {
            guildId: interaction.guildId || '',
            channelId: interaction.channelId,
            commandParams: {
                topic,
                language,
                ephemeral,
            },
        };
        const response = i18next_1.default.t(`faq.topics.${topic}`, {
            lng: language,
            returnObjects: true,
        });
        if (typeof response === 'string' && response.startsWith('faq.')) {
            await interaction.deferReply({ ephemeral: ephemeral });
            await (0, generalUtilities_1.delay)(3_000);
            const displayName = await (0, discordUtilities_1.getDisplayName)(interaction.user, interaction.guild);
            const textResponse = i18next_1.default.t('faq.unknown.message', {
                user: (0, discord_js_1.bold)(displayName),
                lng: language,
            });
            const embedTitle = i18next_1.default.t('faq.unknown.embedData.title', {
                lng: language,
            });
            const embedDescription = i18next_1.default.t('faq.unknown.embedData.description', {
                lng: language,
                returnObjects: true,
            });
            await interaction.editReply({
                content: textResponse + ' 😭' + '\n',
                embeds: [
                    new discord_js_1.EmbedBuilder()
                        .setTitle(`✍ ${embedTitle}`)
                        .setColor(discord_js_1.Colors.Yellow)
                        .setDescription((0, discord_js_1.unorderedList)(embedDescription)),
                ],
            });
            logger.warn("Couldn't find topic", logData);
            return;
        }
        const processedTranslation = (0, generalUtilities_1.processTranslation)(response);
        const embed = new discord_js_1.EmbedBuilder().setColor(discord_js_1.Colors.Blue);
        let hasButtons = false;
        const rows = [];
        if (typeof processedTranslation === 'string') {
            embed.setDescription(processedTranslation);
        }
        else {
            if (processedTranslation.title) {
                embed.setTitle(processedTranslation.title);
            }
            if (processedTranslation.description) {
                embed.setDescription(processedTranslation.description.join('\n'));
            }
            if (processedTranslation.footer) {
                embed.setFooter({ text: processedTranslation.footer });
            }
            if (processedTranslation.buttons) {
                hasButtons = true;
                rows.push((0, discordUtilities_1.createButtons)(processedTranslation.buttons));
            }
        }
        if (hasButtons) {
            await interaction.reply({
                embeds: [embed],
                components: rows,
                ephemeral,
            });
        }
        else {
            await interaction.reply({
                embeds: [embed],
                ephemeral,
            });
        }
        logger.info('FAQ sent by slash command', logData);
    },
};
exports.default = Faq;
