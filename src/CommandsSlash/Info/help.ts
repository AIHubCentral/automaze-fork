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
} from 'discord.js';
import { SlashCommand } from '../../Interfaces/Command';
import slashCommandData from '../../../JSON/slashCommandData.json';
import ExtendedClient from '../../Core/extendedClient';
import ms from 'pretty-ms';
import i18next from 'i18next';
import { EmbedData } from '../../Interfaces/BotData';

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
            await handleCommandOption(interaction, commandType, language, ephemeral);
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
    language: string,
    ephemeral: boolean
) {
    if (!commandType) return;

    if (['es', 'pt'].includes(language)) {
        return await interaction.reply({
            content: i18next.t('general.translation_not_available', { lng: language }),
            ephemeral: true,
        });
    }

    const embed = new EmbedBuilder()
        .setColor(Colors.Greyple)
        .setTitle(i18next.t('help.title', { lng: language }));

    if (commandType === 'slash') {
        const menuOptions = ['doxx', '8ball', 'banana', 'topbanana'];

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('select_slash')
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

        const filter = (i: Interaction) =>
            i.isStringSelectMenu() && i.customId === 'select_slash' && i.user.id === interaction.user.id;

        const currentChannel = interaction.channel as TextChannel;

        const collector = currentChannel.createMessageComponentCollector({ filter, time: 60_000 });

        collector.on('collect', async (i: StringSelectMenuInteraction) => {
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
            }

            await i.editReply({ embeds: [embed], components: [row] });
            //await i.followUp({ content: `You selected: ${selectedValue}` });
        });

        collector.on('end', async (_collected, reason) => {
            if (reason === 'time') {
                const disabledSelectMenu = new StringSelectMenuBuilder()
                    .setCustomId('select')
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
