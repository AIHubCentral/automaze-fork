"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
//import ExtendedClient from '../../Core/extendedClient';
const slashCommandData_json_1 = __importDefault(require("../../../JSON/slashCommandData.json"));
const i18next_1 = __importDefault(require("i18next"));
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
        console.log(topic);
        console.log(suggestions);
        await interaction.respond(suggestions.map((suggestion) => ({ name: suggestion, value: suggestion })));
    },
    async execute(interaction) {
        const startTime = Date.now();
        const topic = interaction.options.getString('topic', true);
        const language = interaction.options.getString('language') || '';
        const ephemeral = interaction.options.getBoolean('private') || false;
        const client = interaction.client;
        const { logger } = client;
        let response = null;
        // TODO: get the language from the user locale if it's an empty string
        console.log(language);
        switch (topic) {
            case 'epoch':
                response = i18next_1.default.t('faq.epoch', {
                    lng: language,
                });
                break;
            case 'dataset':
                response = `Datasets are a set of audio files compressed into a .zip file, used by RVC for voice training. You can learn more about it in the [Applio Docs](https://docs.applio.org/faq)`;
                break;
            case 'model':
                response =
                    'A model is the result of training on a dataset. You can learn more about it in the [Applio Docs](https://docs.applio.org/faq)';
                break;
            case 'inference':
                response =
                    'Inference is the process where an audio is transformed by the voice model. You can learn more about it in the [Applio Docs](https://docs.applio.org/faq)';
                break;
            case 'overtraining':
                response =
                    'A solid way to detect overtraining is checking if the **TensorBoard** graph starts rising and never comes back down, leading to robotic, muffled output with poor articulation. You can learn more about it in the [Applio Docs](https://docs.applio.org/getting-started/tensorboard)';
                break;
            default:
                response = '';
        }
        if (!response) {
            await interaction.reply({
                content: "I'm sorry, display name.I couldn't find the topic you were looking for 😭.You can try the following: ",
                embeds: [new discord_js_1.EmbedBuilder().setDescription('Look for channel')],
            });
            return;
        }
        await interaction.reply({ content: response, ephemeral });
        console.log(i18next_1.default.t('greeting'));
        const logData = {
            guildId: interaction.guildId || '',
            channelId: interaction.channelId,
            executionTime: (Date.now() - startTime) / 1000,
        };
        logger.info('FAQ sent by slash command', logData);
    },
};
exports.default = Faq;
