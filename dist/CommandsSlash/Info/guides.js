"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const discordUtilities_1 = require("../../Utils/discordUtilities");
const Guides = {
    category: 'Info',
    data: new discord_js_1.SlashCommandBuilder()
        .setName('guides')
        .setDescription('Guides for RVC (how to make ai cover).')
        .addStringOption((option) => option
        .setName('category')
        .setDescription('Choose a category')
        .setRequired(true)
        .addChoices({ name: 'RVC', value: 'rvc' }, { name: 'Applio', value: 'applio' }, { name: 'Audio', value: 'audio' }, { name: 'Paperspace', value: 'paperspace' }, { name: 'Realtime', value: 'realtime' }, { name: 'Upload', value: 'upload' }, { name: 'UVR', value: 'uvr' }))
        .addStringOption((option) => option
        .setName('language')
        .setDescription('(Optional) Choose a language by country')
        .addChoices({ name: 'DE', value: 'de' }, { name: 'EN', value: 'en' }, { name: 'ES', value: 'es' }, { name: 'FR', value: 'fr' }, { name: 'IT', value: 'it' }, { name: 'JP', value: 'jp' }, { name: 'KR', value: 'kr' }, { name: 'PL', value: 'pl' }, { name: 'PT', value: 'pt' }, { name: 'RU', value: 'ru' }))
        .addUserOption((option) => option.setName('user').setDescription('(Optional) Send this guide to an user')),
    async execute(interaction) {
        const category = interaction.options.getString('category') ?? '';
        const language = interaction.options.getString('language') ?? 'en';
        const targetUser = interaction.options.getUser('user');
        const mainUser = interaction.user;
        const client = interaction.client;
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
        let selectedGuide = botData.embeds[category][language];
        if (!selectedGuide)
            return interaction.reply({
                content: 'This guide is not available in the selected language.',
                ephemeral: true,
            });
        const botResponse = prepareGuideReply(selectedGuide, targetUser, botConfigs.colors);
        await interaction.reply(botResponse);
    },
};
exports.default = Guides;
function createSelectMenu(content) {
    if (!content.menuOptions)
        throw new Error('Missing menu content');
    const realtimeSelectOptions = content.menuOptions.map((menuOption) => {
        const menuOptionBuilder = new discord_js_1.StringSelectMenuOptionBuilder()
            .setLabel(menuOption.label)
            .setDescription(menuOption.description)
            .setValue(menuOption.value);
        if (menuOption.emoji) {
            menuOptionBuilder.setEmoji(menuOption.emoji);
        }
        return menuOptionBuilder;
    });
    const realtimeGuidesSelectMenu = new discord_js_1.StringSelectMenuBuilder()
        .setCustomId('realtime_guides')
        .setPlaceholder('Select a guide')
        .addOptions(realtimeSelectOptions);
    const selectMenuActionRow = new discord_js_1.ActionRowBuilder().addComponents(realtimeGuidesSelectMenu);
    return selectMenuActionRow;
}
async function handleRealtimeGuide(content, mainUser, targetUser, interaction) {
    const realtimeActionRow = createSelectMenu(content);
    const embeds = [];
    const botResponse = {};
    content.local?.embeds.forEach((embedData) => {
        embeds.push((0, discordUtilities_1.createEmbed)(embedData));
    });
    botResponse.embeds = embeds;
    botResponse.components = [realtimeActionRow];
    if (targetUser) {
        botResponse.content = `Suggestion for ${targetUser}`;
    }
    const botReply = await interaction.reply(botResponse);
    const selectMenuDisplayMinutes = 30;
    const collector = botReply.createMessageComponentCollector({
        componentType: discord_js_1.ComponentType.StringSelect,
        time: selectMenuDisplayMinutes * 60 * 1000,
    });
    collector.on('collect', (i) => {
        let allowedToInteract = i.user.id === mainUser.id;
        // allow the mentioned user to interact as well
        if (targetUser) {
            allowedToInteract = i.user.id === mainUser.id || i.user.id === targetUser.id;
        }
        if (allowedToInteract) {
            const selectMenuResult = i.values[0];
            const realtimeGuides = content;
            let currentGuide;
            if (selectMenuResult === 'realtime_local') {
                currentGuide = (0, discordUtilities_1.createEmbed)(realtimeGuides.local.embeds[0]);
                botResponse.embeds = [currentGuide];
            }
            else if (selectMenuResult === 'realtime_online') {
                currentGuide = (0, discordUtilities_1.createEmbed)(realtimeGuides.online.embeds[0]);
                botResponse.embeds = [currentGuide];
            }
            else if (selectMenuResult === 'realtime_faq') {
                currentGuide = (0, discordUtilities_1.createEmbed)(realtimeGuides.faq.embeds[0]);
                botResponse.embeds = [currentGuide];
            }
            i.update(botResponse);
        }
        else {
            i.reply({
                content: "You didn't start this interaction, use `/guides realtime` if you wish to choose an option.",
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
function prepareGuideReply(guide, targetUser, embedColors) {
    if (!guide.embeds)
        throw new Error('Missing embeds for a guide');
    const result = { embeds: [] };
    const colors = [embedColors.theme.primary, embedColors.theme.secondary, embedColors.theme.tertiary];
    result.embeds = (0, discordUtilities_1.createEmbeds)(guide.embeds, colors);
    if (targetUser) {
        result.content = `Suggestion for ${targetUser}`;
    }
    if (guide.buttons) {
        const buttonsActionRow = new discord_js_1.ActionRowBuilder();
        const buttonBuilders = guide.buttons.map((btnData) => new discord_js_1.ButtonBuilder().setLabel(btnData.label).setURL(btnData.url).setStyle(discord_js_1.ButtonStyle.Link));
        buttonsActionRow.addComponents(buttonBuilders);
        result.components = [buttonsActionRow];
    }
    return result;
}
