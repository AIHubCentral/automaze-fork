import {
    ActionRowBuilder,
    ChatInputCommandInteraction,
    Colors,
    EmbedBuilder,
    Interaction,
    StringSelectMenuInteraction,
    SlashCommandBuilder,
    StringSelectMenuBuilder,
    TextChannel,
    unorderedList,
} from 'discord.js';
import { SlashCommand } from '../../Interfaces/Command';
import slashCommandData from '../../../JSON/slashCommandData.json';
import ExtendedClient from '../../Core/extendedClient';
import ms from 'pretty-ms';
import i18next from 'i18next';
import { EmbedData } from '../../Interfaces/BotData';
import { generateRandomId } from '../../Utils/generalUtilities';
import { sendErrorLog } from '../../Utils/botUtilities';

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
        const { logger } = client;

        const commandType = interaction.options.getString('type');
        const ephemeral = interaction.options.getBoolean('private') ?? false;

        const language = interaction.options.getString('language') ?? '';

        if (['pt'].includes(language)) {
            return await interaction.reply({
                content: i18next.t('general.translation_not_available', { lng: language }),
                ephemeral: true,
            });
        }

        try {
            if (interaction.options.getSubcommand() === 'commands') {
                await handleCommandOption(interaction, commandType, language, ephemeral);
            } else if (interaction.options.getSubcommand() === 'general') {
                await handleGeneralOption(interaction, language, ephemeral);
            }

            logger.info('Help sent', {
                guildId: interaction.guildId,
                channelId: interaction.channelId,
                commandParams: { commandType, language, ephemeral },
                executionTime: ms((Date.now() - executionStart) / 1000),
            });
        } catch (error) {
            await sendErrorLog(client, error, {
                command: `/${interaction.commandName}`,
                message: 'Failure on /help',
                guildId: interaction.guildId ?? '',
                channelId: interaction.channelId,
            });
        }
    },
};

export default Help;

async function handleCommandOption(
    interaction: ChatInputCommandInteraction,
    commandType: string | null,
    language: string,
    ephemeral: boolean
) {
    if (!commandType) return;

    const embed = new EmbedBuilder()
        .setColor(Colors.Greyple)
        .setTitle(i18next.t('help.title', { lng: language }));

    let menuOptions: string[] = [];
    const helpOptions = Object.keys(i18next.t('help', { lng: language, returnObjects: true }));

    if (commandType === 'slash') {
        menuOptions = helpOptions.filter((key) => key.startsWith('slash_'));
    } else if (commandType === 'prefix') {
        menuOptions = helpOptions.filter((key) => key.startsWith('prefix_'));
    } else if (commandType === 'context') {
        menuOptions = helpOptions.filter((key) => key.startsWith('context_'));
    } else {
        await interaction.reply({
            content: i18next.t('general.not_available', { lng: language }),
            ephemeral: true,
        });
        return;
    }

    const menuId = `select_${generateRandomId(6)}`;

    const selectMenu = new StringSelectMenuBuilder()
        .setCustomId(menuId)
        .setPlaceholder(i18next.t('help.placeholder', { lng: language }))
        .addOptions(
            menuOptions.map((key) => {
                return {
                    label: i18next.t(`help.${key}.label`, { lng: language }),
                    description: i18next.t(`help.${key}.description`, { lng: language }),
                    emoji: i18next.t(`help.${key}.icon`, { lng: language }),
                    value: key,
                };
            })
        );

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu);

    await interaction.reply({ embeds: [embed], components: [row], ephemeral });

    const filter = (i: Interaction) => i.isStringSelectMenu() && i.customId === menuId;

    const currentChannel = interaction.channel as TextChannel;

    // shows for 10 minutes
    const collector = currentChannel.createMessageComponentCollector({ filter, time: 600_000 });

    collector.on('collect', async (i: StringSelectMenuInteraction) => {
        if (i.user.id === interaction.user.id) {
            await i.deferUpdate();
            const selectedValue = i.values[0];

            const embedData = i18next.t(`help.${selectedValue}.embed`, {
                lng: language,
                returnObjects: true,
            }) as EmbedData;

            if (!embedData.description) return;

            embed.setTitle(
                `${i18next.t(`help.${selectedValue}.icon`, { lng: language })} ${i18next.t(`help.${selectedValue}.label`, { lng: language })}`
            );
            embed.setDescription(embedData.description.join('\n'));

            if (embedData.footer) {
                embed.setFooter({ text: embedData.footer });
            } else {
                embed.setFooter(null);
            }

            await i.editReply({ embeds: [embed], components: [row] });
        } else {
            await i.reply({
                content: i18next.t('general.not_interaction_author', { lng: i.locale }),
                ephemeral: true,
            });
        }
    });

    collector.on('end', async (_collected, reason) => {
        if (reason === 'time') {
            const disabledSelectMenu = new StringSelectMenuBuilder()
                .setCustomId(menuId)
                .setPlaceholder(i18next.t('help.placeholder', { lng: language }))
                .addOptions([
                    {
                        label: 'N/A',
                        value: 'not_available',
                    },
                ])
                .setDisabled(true);

            const disabledRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
                disabledSelectMenu
            );

            embed.setColor(Colors.Red);

            await interaction.editReply({
                content: i18next.t('help.timeout', { lng: language }),
                embeds: [embed],
                components: [disabledRow],
            });
        }
    });
}

async function handleGeneralOption(
    interaction: ChatInputCommandInteraction,
    language: string,
    ephemeral: boolean
) {
    const embedTitle = `✍ ${i18next.t('faq.unknown.embedData.title', {
        lng: language,
    })}`;
    const embedDescription = i18next.t('faq.unknown.embedData.description', {
        lng: language,
        returnObjects: true,
    }) as Array<string>;

    await interaction.reply({
        embeds: [
            new EmbedBuilder()
                .setTitle(embedTitle)
                .setColor(Colors.Greyple)
                .setDescription(unorderedList(embedDescription)),
        ],
        ephemeral: ephemeral,
    });
}
