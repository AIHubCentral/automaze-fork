"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
//import ExtendedClient from '../../Core/extendedClient';
const slashCommandData_json_1 = __importDefault(require("../../../JSON/slashCommandData.json"));
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
        const allTopics = ['A', 'B', 'C'];
        const suggestions = allTopics.filter((topicItem) => topicItem.toLowerCase().includes(topic.toLowerCase().trim()));
        console.log(topic);
        console.log(suggestions);
        await interaction.respond(suggestions.map((suggestion) => ({ name: suggestion, value: suggestion })));
    },
    async execute(interaction) {
        const topic = interaction.options.getString('topic', true);
        /*  const language = interaction.options.getString('language') || '';
        const private = interaction.options.getString('private') || '';

        const client = interaction.client as ExtendedClient;

        const logData = {
            guildId: interaction.guildId,
            channelId: interaction.channelId,
            userId: interaction.user.id,
            userName: interaction.user.username,
        }; */
        await interaction.reply({ content: `You selected ${topic}` });
    },
};
exports.default = Faq;
