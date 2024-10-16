import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { SlashCommand } from '../../Interfaces/Command';
import slashCommandData from '../../../JSON/slashCommandData.json';
import ExtendedClient from '../../Core/extendedClient';
import ms from 'pretty-ms';

const commandData = slashCommandData.help;

const Help: SlashCommand = {
    category: 'Info',
    data: new SlashCommandBuilder()
        .setName(commandData.name)
        .setDescription(commandData.description)
        .setDescriptionLocalizations(commandData.descriptionLocalizations)
        .addSubcommand((subcommand) =>
            subcommand
                .setName(commandData.subcommands.commands.name)
                .setNameLocalizations(commandData.subcommands.commands.nameLocalizations)
                .setDescription(commandData.subcommands.commands.description)
                .setDescriptionLocalizations(commandData.subcommands.commands.descriptionLocalizations)
                .addStringOption((option) =>
                    option
                        .setName(commandData.subcommands.commands.options.type.name)
                        .setNameLocalizations(commandData.subcommands.commands.options.type.nameLocalizations)
                        .setDescription(commandData.subcommands.commands.options.type.description)
                        .setDescriptionLocalizations(
                            commandData.subcommands.commands.options.type.descriptionLocalizations
                        )
                        .addChoices(commandData.subcommands.commands.options.type.choices)
                        .setRequired(true)
                )
                .addStringOption((option) =>
                    option
                        .setName(commandData.subcommands.commands.options.language.name)
                        .setNameLocalizations(
                            commandData.subcommands.commands.options.language.nameLocalizations
                        )
                        .setDescription(commandData.subcommands.commands.options.language.description)
                        .setDescriptionLocalizations(
                            commandData.subcommands.commands.options.language.descriptionLocalizations
                        )
                        .addChoices(commandData.subcommands.commands.options.language.choices)
                )
                .addBooleanOption((option) =>
                    option
                        .setName(commandData.subcommands.commands.options.private.name)
                        .setNameLocalizations(
                            commandData.subcommands.commands.options.private.nameLocalizations
                        )
                        .setDescription(commandData.subcommands.commands.options.private.description)
                        .setDescriptionLocalizations(
                            commandData.subcommands.commands.options.private.descriptionLocalizations
                        )
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName(commandData.subcommands.general.name)
                .setNameLocalizations(commandData.subcommands.general.nameLocalizations)
                .setDescription(commandData.subcommands.general.description)
                .setDescriptionLocalizations(commandData.subcommands.general.descriptionLocalizations)
                .addStringOption((option) =>
                    option
                        .setName(commandData.subcommands.general.options.language.name)
                        .setNameLocalizations(
                            commandData.subcommands.general.options.language.nameLocalizations
                        )
                        .setDescription(commandData.subcommands.general.options.language.description)
                        .setDescriptionLocalizations(
                            commandData.subcommands.general.options.language.descriptionLocalizations
                        )
                        .addChoices(commandData.subcommands.general.options.language.choices)
                )
                .addBooleanOption((option) =>
                    option
                        .setName(commandData.subcommands.general.options.private.name)
                        .setNameLocalizations(
                            commandData.subcommands.general.options.private.nameLocalizations
                        )
                        .setDescription(commandData.subcommands.general.options.private.description)
                        .setDescriptionLocalizations(
                            commandData.subcommands.general.options.private.descriptionLocalizations
                        )
                )
        ),
    async execute(interaction) {
        const executionStart = Date.now();
        const client = interaction.client as ExtendedClient;
        const { botConfigs, logger } = client;

        const commandType = interaction.options.getString('type');
        const ephemeral = interaction.options.getBoolean('private') ?? false;

        let language = interaction.options.getString('language') ?? '';

        if (language === '') {
            language = interaction.locale;
        }

        if (interaction.options.getSubcommand() === 'commands') {
            await handleCommandOption(interaction, commandType, language);
        } else if (interaction.options.getSubcommand() === 'general') {
            await handleGeneralOption(interaction, language);
        }

        logger.info('Help sent', {
            guildId: interaction.guildId,
            channelId: interaction.channelId,
            commandParams: { commandType, language, ephemeral },
            executionTime: ms((Date.now() - executionStart) / 1000),
        });
    },
};

export default Help;

async function handleCommandOption(
    interaction: ChatInputCommandInteraction,
    commandType: string | null,
    language: string
) {
    if (!commandType) return;

    if (commandType === 'slash') {
        await interaction.reply('slash');
    } else if (commandType === 'prefix') {
        await interaction.reply('prefix');
    } else if (commandType === 'context') {
        await interaction.reply('context');
    } else {
        await interaction.reply({ content: 'Not available', ephemeral: true });
    }
}

async function handleGeneralOption(interaction: ChatInputCommandInteraction, language: string) {
    await interaction.reply('General');
}
