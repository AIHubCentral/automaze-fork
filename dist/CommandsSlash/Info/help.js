"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const slashCommandData_json_1 = __importDefault(require("../../../JSON/slashCommandData.json"));
const pretty_ms_1 = __importDefault(require("pretty-ms"));
const commandData = slashCommandData_json_1.default.help;
const Help = {
    category: 'Info',
    data: new discord_js_1.SlashCommandBuilder()
        .setName(commandData.name)
        .setDescription(commandData.description)
        .setDescriptionLocalizations(commandData.descriptionLocalizations)
        .addSubcommand((subcommand) => subcommand
        .setName(commandData.subcommands.commands.name)
        .setNameLocalizations(commandData.subcommands.commands.nameLocalizations)
        .setDescription(commandData.subcommands.commands.description)
        .setDescriptionLocalizations(commandData.subcommands.commands.descriptionLocalizations)
        .addStringOption((option) => option
        .setName(commandData.subcommands.commands.options.type.name)
        .setNameLocalizations(commandData.subcommands.commands.options.type.nameLocalizations)
        .setDescription(commandData.subcommands.commands.options.type.description)
        .setDescriptionLocalizations(commandData.subcommands.commands.options.type.descriptionLocalizations)
        .addChoices(commandData.subcommands.commands.options.type.choices)
        .setRequired(true))
        .addStringOption((option) => option
        .setName(commandData.subcommands.commands.options.language.name)
        .setNameLocalizations(commandData.subcommands.commands.options.language.nameLocalizations)
        .setDescription(commandData.subcommands.commands.options.language.description)
        .setDescriptionLocalizations(commandData.subcommands.commands.options.language.descriptionLocalizations)
        .addChoices(commandData.subcommands.commands.options.language.choices))
        .addBooleanOption((option) => option
        .setName(commandData.subcommands.commands.options.private.name)
        .setNameLocalizations(commandData.subcommands.commands.options.private.nameLocalizations)
        .setDescription(commandData.subcommands.commands.options.private.description)
        .setDescriptionLocalizations(commandData.subcommands.commands.options.private.descriptionLocalizations)))
        .addSubcommand((subcommand) => subcommand
        .setName(commandData.subcommands.general.name)
        .setNameLocalizations(commandData.subcommands.general.nameLocalizations)
        .setDescription(commandData.subcommands.general.description)
        .setDescriptionLocalizations(commandData.subcommands.general.descriptionLocalizations)
        .addStringOption((option) => option
        .setName(commandData.subcommands.general.options.language.name)
        .setNameLocalizations(commandData.subcommands.general.options.language.nameLocalizations)
        .setDescription(commandData.subcommands.general.options.language.description)
        .setDescriptionLocalizations(commandData.subcommands.general.options.language.descriptionLocalizations)
        .addChoices(commandData.subcommands.general.options.language.choices))
        .addBooleanOption((option) => option
        .setName(commandData.subcommands.general.options.private.name)
        .setNameLocalizations(commandData.subcommands.general.options.private.nameLocalizations)
        .setDescription(commandData.subcommands.general.options.private.description)
        .setDescriptionLocalizations(commandData.subcommands.general.options.private.descriptionLocalizations))),
    async execute(interaction) {
        const executionStart = Date.now();
        const client = interaction.client;
        const { botConfigs, logger } = client;
        const commandType = interaction.options.getString('type');
        const ephemeral = interaction.options.getBoolean('private') ?? false;
        let language = interaction.options.getString('language') ?? '';
        if (language === '') {
            language = interaction.locale;
        }
        if (interaction.options.getSubcommand() === 'commands') {
            await handleCommandOption(interaction, commandType, language);
        }
        else if (interaction.options.getSubcommand() === 'general') {
            await handleGeneralOption(interaction, language);
        }
        logger.info('Help sent', {
            guildId: interaction.guildId,
            channelId: interaction.channelId,
            commandParams: { commandType, language, ephemeral },
            executionTime: (0, pretty_ms_1.default)((Date.now() - executionStart) / 1000),
        });
    },
};
exports.default = Help;
async function handleCommandOption(interaction, commandType, language) {
    if (!commandType)
        return;
    if (commandType === 'slash') {
        await interaction.reply('slash');
    }
    else if (commandType === 'prefix') {
        await interaction.reply('prefix');
    }
    else if (commandType === 'context') {
        await interaction.reply('context');
    }
    else {
        await interaction.reply({ content: 'Not available', ephemeral: true });
    }
}
async function handleGeneralOption(interaction, language) {
    await interaction.reply('General');
}
