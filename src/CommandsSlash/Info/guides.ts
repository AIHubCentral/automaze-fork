import {
    SlashCommandBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    ActionRowBuilder,
    ComponentType,
    User,
    ChatInputCommandInteraction,
    EmbedBuilder,
    InteractionReplyOptions,
    InteractionResponse,
    InteractionUpdateOptions,
    ButtonBuilder,
    ButtonStyle,
} from 'discord.js';

import { SlashCommand } from '../../Interfaces/Command';
import ExtendedClient from '../../Core/extendedClient';
import { EmbedData, LanguageData } from '../../Interfaces/BotData';
import { createEmbed, createEmbeds } from '../../Utils/discordUtilities';
import { IConfigColors } from '../../Interfaces/BotConfigs';

const Guides: SlashCommand = {
    category: 'Info',
    data: new SlashCommandBuilder()
        .setName('guides')
        .setDescription('Guides for RVC (how to make ai cover).')
        .addStringOption((option) =>
            option
                .setName('category')
                .setDescription('Choose a category')
                .setRequired(true)
                .addChoices(
                    { name: 'RVC', value: 'rvc' },
                    { name: 'Applio', value: 'applio' },
                    { name: 'Audio', value: 'audio' },
                    { name: 'Paperspace', value: 'paperspace' },
                    { name: 'Realtime', value: 'realtime' },
                    { name: 'Upload', value: 'upload' },
                    { name: 'UVR', value: 'uvr' }
                )
        )
        .addStringOption((option) =>
            option
                .setName('language')
                .setDescription('(Optional) Choose a language by country')
                .addChoices(
                    { name: 'DE', value: 'de' },
                    { name: 'EN', value: 'en' },
                    { name: 'ES', value: 'es' },
                    { name: 'FR', value: 'fr' },
                    { name: 'IT', value: 'it' },
                    { name: 'JP', value: 'jp' },
                    { name: 'KR', value: 'kr' },
                    { name: 'PL', value: 'pl' },
                    { name: 'PT', value: 'pt' },
                    { name: 'RU', value: 'ru' }
                )
        )
        .addUserOption((option) =>
            option.setName('user').setDescription('(Optional) Send this guide to an user')
        ),
    async execute(interaction) {
        const category = interaction.options.getString('category') ?? '';
        const language = interaction.options.getString('language') ?? 'en';
        const targetUser = interaction.options.getUser('user');
        const mainUser = interaction.user;

        const client = interaction.client as ExtendedClient;
        const { botData, botConfigs } = client;

        client.logger.debug('sending guide', {
            more: {
                category,
                language,
                channelId: interaction.channelId,
                guildId: interaction.guildId,
            },
        });

        if (category === 'realtime') {
            const guideForRealtime = botData.embeds[category][language];
            if (!guideForRealtime)
                return await interaction.reply({
                    content: 'This guide is not available in the selected language.',
                    ephemeral: true,
                });
            await handleRealtimeGuide(guideForRealtime, mainUser, targetUser, interaction);
            return;
        }

        // other than realtime guides
        let selectedGuide: LanguageData | null = botData.embeds[category][language];

        if (!selectedGuide)
            return interaction.reply({
                content: 'This guide is not available in the selected language.',
                ephemeral: true,
            });

        const botResponse: InteractionReplyOptions = prepareGuideReply(
            selectedGuide,
            targetUser,
            botConfigs.colors
        );

        await interaction.reply(botResponse);
    },
};

export default Guides;

function createSelectMenu(content: LanguageData): ActionRowBuilder<StringSelectMenuBuilder> {
    if (!content.menuOptions) throw new Error('Missing menu content');

    const realtimeSelectOptions = content.menuOptions.map((menuOption) => {
        const menuOptionBuilder = new StringSelectMenuOptionBuilder()
            .setLabel(menuOption.label)
            .setDescription(menuOption.description)
            .setValue(menuOption.value);

        if (menuOption.emoji) {
            menuOptionBuilder.setEmoji(menuOption.emoji);
        }

        return menuOptionBuilder;
    });

    const realtimeGuidesSelectMenu = new StringSelectMenuBuilder()
        .setCustomId('realtime_guides')
        .setPlaceholder('Select a guide')
        .addOptions(realtimeSelectOptions);

    const selectMenuActionRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
        realtimeGuidesSelectMenu
    );

    return selectMenuActionRow;
}

async function handleRealtimeGuide(
    content: LanguageData,
    mainUser: User,
    targetUser: User | null,
    interaction: ChatInputCommandInteraction
): Promise<void> {
    const realtimeActionRow = createSelectMenu(content);
    const embeds: EmbedBuilder[] = [];
    const botResponse: InteractionReplyOptions = {};

    content.local?.embeds.forEach((embedData: EmbedData) => {
        embeds.push(createEmbed(embedData));
    });

    botResponse.embeds = embeds;
    botResponse.components = [realtimeActionRow];

    if (targetUser) {
        botResponse.content = `Suggestion for ${targetUser}`;
    }

    const botReply: InteractionResponse = await interaction.reply(botResponse);

    const selectMenuDisplayMinutes = 30;

    const collector = botReply.createMessageComponentCollector({
        componentType: ComponentType.StringSelect,
        time: selectMenuDisplayMinutes * 60 * 1000,
    });

    collector.on('collect', (i) => {
        let allowedToInteract: boolean = i.user.id === mainUser.id;

        // allow the mentioned user to interact as well
        if (targetUser) {
            allowedToInteract = i.user.id === mainUser.id || i.user.id === targetUser.id;
        }

        if (allowedToInteract) {
            const selectMenuResult = i.values[0];

            const realtimeGuides = content;
            let currentGuide: EmbedBuilder;

            if (selectMenuResult === 'realtime_local') {
                currentGuide = createEmbed(realtimeGuides.local!.embeds[0]);
                botResponse.embeds = [currentGuide];
            } else if (selectMenuResult === 'realtime_online') {
                currentGuide = createEmbed(realtimeGuides.online!.embeds[0]);
                botResponse.embeds = [currentGuide];
            } else if (selectMenuResult === 'realtime_faq') {
                currentGuide = createEmbed(realtimeGuides.faq!.embeds[0]);
                botResponse.embeds = [currentGuide];
            }

            i.update(botResponse as InteractionUpdateOptions);
        } else {
            i.reply({
                content:
                    "You didn't start this interaction, use `/guides realtime` if you wish to choose an option.",
                ephemeral: true,
            });
        }
    });

    collector.on('end', () => {
        botResponse.content =
            '> This interaction has expired, use the command `/guides realtime` if you wish to see it again.';
        botResponse.embeds = [];
        botResponse.components = [];
        botReply.edit(botResponse);
    });
}

function prepareGuideReply(
    guide: LanguageData,
    targetUser: User | null,
    embedColors: IConfigColors
): InteractionReplyOptions {
    if (!guide.embeds) throw new Error('Missing embeds for a guide');

    const result: InteractionReplyOptions = { embeds: [] };

    const colors = [embedColors.theme.primary, embedColors.theme.secondary, embedColors.theme.tertiary];

    result.embeds = createEmbeds(guide.embeds, colors);

    if (targetUser) {
        result.content = `Suggestion for ${targetUser}`;
    }

    if (guide.buttons) {
        const buttonsActionRow = new ActionRowBuilder<ButtonBuilder>();

        const buttonBuilders = guide.buttons.map((btnData) =>
            new ButtonBuilder().setLabel(btnData.label).setURL(btnData.url).setStyle(ButtonStyle.Link)
        );

        buttonsActionRow.addComponents(buttonBuilders);
        result.components = [buttonsActionRow];
    }

    return result;
}
