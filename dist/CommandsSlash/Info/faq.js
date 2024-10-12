"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const slashCommandData_json_1 = __importDefault(require("../../../JSON/slashCommandData.json"));
const i18next_1 = __importDefault(require("i18next"));
const generalUtilities_1 = require("../../Utils/generalUtilities");
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
        .setRequired(false))
        .addBooleanOption((option) => option
        .setName(commandData.options.private.name)
        .setNameLocalizations(commandData.options.private.nameLocalizations)
        .setDescription(commandData.options.private.description)
        .setDescriptionLocalizations(commandData.options.private.descriptionLocalizations)
        .setRequired(false)),
    async autocomplete(interaction) {
        const topic = interaction.options.getString('topic', true);
        const allTopics = ['epoch', 'dataset', 'model', 'inference', 'overtraining'];
        const suggestions = allTopics.filter((topicItem) => topicItem.toLowerCase().includes(topic.toLowerCase().trim()));
        await interaction.respond(suggestions.map((suggestion) => ({ name: suggestion, value: suggestion })));
    },
    async execute(interaction) {
        const startTime = Date.now();
        const topic = interaction.options.getString('topic', true);
        const language = interaction.options.getString('language') || '';
        const ephemeral = interaction.options.getBoolean('private') || false;
        const client = interaction.client;
        const { logger } = client;
        // TODO: get the language from the user locale if it's an empty string
        const response = i18next_1.default.t(`faq.${topic}`, { lng: language });
        if (response.startsWith('faq.')) {
            await interaction.deferReply({ ephemeral: ephemeral });
            await (0, generalUtilities_1.delay)(3_000);
            const textResponse = i18next_1.default.t('faq.unknown.message', {
                user: (0, discord_js_1.bold)(interaction.user.username),
                lng: language,
            });
            const embedTitle = i18next_1.default.t('faq.unknown.embedData.title', {
                lng: language,
            });
            const channelIds = client.discordIDs.Channel;
            const embedDescription = i18next_1.default.t('faq.unknown.embedData.description', {
                lng: language,
                returnObjects: true,
                okadaChannel: (0, discord_js_1.channelMention)(channelIds.HelpWOkada),
                helpChannel: (0, discord_js_1.channelMention)(channelIds.HelpRVC),
                helpAiArtChannel: (0, discord_js_1.channelMention)(channelIds.HelpAiArt),
            });
            await interaction.editReply({
                content: textResponse + ' 😭' + '\n',
                embeds: [
                    new discord_js_1.EmbedBuilder()
                        .setTitle(`✍ ${embedTitle}`)
                        .setColor(discord_js_1.Colors.DarkAqua)
                        .setDescription((0, discord_js_1.unorderedList)(embedDescription)),
                ],
            });
            return;
        }
        await interaction.reply({ content: response, ephemeral });
        const logData = {
            guildId: interaction.guildId || '',
            channelId: interaction.channelId,
            executionTime: (Date.now() - startTime) / 1000,
        };
        logger.info('FAQ sent by slash command', logData);
    },
};
exports.default = Faq;
