"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const slashCommandData_json_1 = __importDefault(require("../../../JSON/slashCommandData.json"));
const pretty_ms_1 = __importDefault(require("pretty-ms"));
const i18next_1 = __importDefault(require("i18next"));
const generalUtilities_1 = require("../../Utils/generalUtilities");
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
        const language = interaction.options.getString('language') ?? '';
        if (['es', 'pt'].includes(language)) {
            return await interaction.reply({
                content: i18next_1.default.t('general.translation_not_available', { lng: language }),
                ephemeral: true,
            });
        }
        /*
        if (language === '') {
            language = interaction.locale;
        }
        */
        if (interaction.options.getSubcommand() === 'commands') {
            await handleCommandOption(interaction, commandType, language, ephemeral);
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
async function handleCommandOption(interaction, commandType, language, ephemeral) {
    if (!commandType)
        return;
    const embed = new discord_js_1.EmbedBuilder()
        .setColor(discord_js_1.Colors.Greyple)
        .setTitle(i18next_1.default.t('help.title', { lng: language }));
    let menuOptions = [];
    if (commandType === 'slash') {
        menuOptions = [
            'doxx',
            '8ball',
            'banana',
            'topbanana',
            'ping',
            'close',
            'guides',
            'cloud',
            'faq',
            'help',
        ];
    }
    else if (commandType === 'prefix') {
        menuOptions = [
            'prefix_audio',
            'prefix_colab',
            'prefix_gui',
            'prefix_hf',
            'prefix_hfstatus',
            'prefix_java',
        ];
    }
    else if (commandType === 'context') {
        menuOptions = ['context_banan', 'context_colab', 'context_realtime', 'context_rvc', 'context_help'];
    }
    else {
        await interaction.reply({ content: 'Not available', ephemeral: true });
        return;
    }
    const menuId = `select_${(0, generalUtilities_1.generateRandomId)(6)}`;
    const selectMenu = new discord_js_1.StringSelectMenuBuilder()
        .setCustomId(menuId)
        .setPlaceholder(i18next_1.default.t('help.placeholder', { lng: language }))
        .addOptions(menuOptions.map((key) => {
        return {
            label: i18next_1.default.t(`help.${key}.label`, { lng: language }),
            description: i18next_1.default.t(`help.${key}.description`, { lng: language }),
            emoji: i18next_1.default.t(`help.${key}.icon`, { lng: language }),
            value: key,
        };
    }));
    const row = new discord_js_1.ActionRowBuilder().addComponents(selectMenu);
    await interaction.reply({ embeds: [embed], components: [row], ephemeral });
    const filter = (i) => i.isStringSelectMenu() && i.customId === menuId;
    const currentChannel = interaction.channel;
    // shows for 10 minutes
    const collector = currentChannel.createMessageComponentCollector({ filter, time: 600_000 });
    collector.on('collect', async (i) => {
        if (i.user.id === interaction.user.id) {
            await i.deferUpdate();
            const selectedValue = i.values[0];
            const embedData = i18next_1.default.t(`help.${selectedValue}.embed`, {
                lng: language,
                returnObjects: true,
            });
            if (!embedData.description)
                return;
            embed.setTitle(`${i18next_1.default.t(`help.${selectedValue}.icon`, { lng: language })} ${i18next_1.default.t(`help.${selectedValue}.label`, { lng: language })}`);
            embed.setDescription(embedData.description.join('\n'));
            if (embedData.footer) {
                embed.setFooter({ text: embedData.footer });
            }
            else {
                embed.setFooter(null);
            }
            await i.editReply({ embeds: [embed], components: [row] });
        }
        else {
            await i.reply({
                content: i18next_1.default.t('general.not_interaction_author', { lng: language }),
                ephemeral: true,
            });
        }
    });
    collector.on('end', async (_collected, reason) => {
        if (reason === 'time') {
            const disabledSelectMenu = new discord_js_1.StringSelectMenuBuilder()
                .setCustomId(menuId)
                .setPlaceholder(i18next_1.default.t('help.placeholder', { lng: language }))
                .addOptions([
                {
                    label: 'N/A',
                    value: 'not_available',
                },
            ])
                .setDisabled(true);
            const disabledRow = new discord_js_1.ActionRowBuilder().addComponents(disabledSelectMenu);
            embed.setColor(discord_js_1.Colors.Red);
            await interaction.editReply({
                content: i18next_1.default.t('help.timeout', { lng: language }),
                embeds: [embed],
                components: [disabledRow],
            });
        }
    });
}
async function handleGeneralOption(interaction, language) {
    await interaction.reply('General');
}
