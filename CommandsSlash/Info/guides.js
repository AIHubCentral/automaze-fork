const {
    StringSelectMenuBuilder, StringSelectMenuOptionBuilder,
    ActionRowBuilder, ButtonBuilder, ButtonStyle,
    SlashCommandBuilder,
    ComponentType
} = require('discord.js');

module.exports = {
    category: 'Info',
    type: 'slash',
    data: new SlashCommandBuilder()
        .setName('guides')
        .setDescription('Guides for RVC (how to make ai cover).')
        .addStringOption(option =>
            option.setName('category')
                .setDescription('Choose a category')
                .setRequired(true)
                .addChoices(
                    { name: 'RVC', value: 'rvc' },
                    { name: 'Applio', value: 'applio' },
                    { name: 'Audio', value: 'audio' },
                    { name: 'Paperspace', value: 'paperspace' },
                    { name: 'Realtime', value: 'realtime' },
                    { name: 'Upload', value: 'upload' },
                    { name: 'UVR', value: 'uvr' },
                )
        )
        .addStringOption(option =>
            option.setName('language')
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
                    { name: 'RU', value: 'ru' },
                )
        )
        .addUserOption(option =>
            option.setName('user')
                .setDescription('(Optional) Send this guide to an user')
        )
    ,
    async execute(interaction) {
        const category = interaction.options.getString('category');
        const language = interaction.options.getString('language') ?? 'en';
        const targetUser = interaction.options.getUser('user');
        const mainUser = interaction.user;

        const { client } = interaction;
        const { botData, botConfigs, botUtils } = client;
        const availableColors = botUtils.getAvailableColors(botConfigs);

        // default response
        let botResponse = { content: '', ephemeral: false };

        let selectedGuide;

        switch (category) {
            case 'applio':
                selectedGuide = botData.embeds.guides.applio[language];
                if (!selectedGuide) {
                    botResponse.ephemeral = true;
                    botResponse.content = 'This guide is not available in the selected language yet.';
                    return await interaction.reply(botResponse);
                }
                botResponse.embeds = botUtils.createEmbeds(selectedGuide, availableColors);
                break;
            case 'audio':
                selectedGuide = botData.embeds.guides.audio[language];
                if (!selectedGuide) {
                    botResponse.ephemeral = true;
                    botResponse.content = 'This guide is not available in the selected language yet.';
                    return await interaction.reply(botResponse);
                }
                botResponse.embeds = botUtils.createEmbeds(selectedGuide, availableColors);
                break;
            case 'paperspace':
                selectedGuide = botData.embeds.guides.paperspace[language];
                if (!selectedGuide) {
                    botResponse.ephemeral = true;
                    botResponse.content = 'This guide is not available in the selected language yet.';
                    return await interaction.reply(botResponse);
                }
                botResponse.embeds = botUtils.createEmbeds(selectedGuide, availableColors);

                const button = new ButtonBuilder()
                    .setLabel('Google Docs')
                    .setURL('https://docs.google.com/document/d/1lIAK4Y0ylash_1M2UTTL_tfA3_mEzP0D2kjX2A3rfSY/edit?usp=sharing')
                    .setStyle(ButtonStyle.Link);

                const actionRow = new ActionRowBuilder()
                    .addComponents(button);

                botResponse.components = [actionRow];
                break;
            case 'realtime':
                switch (language) {
                    case 'ru':
                        botResponse.content = '';
                        botResponse.embeds = botUtils.createEmbeds(botData.embeds.guides.realtime[language], availableColors);
                        break;
                    case 'en':
                        const realtimeSelectOptions = botData.embeds.guides.realtime[language]['menuOptions'];
                        selectedGuide = botData.embeds.guides.realtime[language]['local']['embeds'];

                        var realtimeGuidesSelectMenu = new StringSelectMenuBuilder()
                            .setCustomId('realtime_guides')
                            .setPlaceholder('Select a guide')
                            .addOptions(
                                realtimeSelectOptions.map(menuOption =>
                                    new StringSelectMenuOptionBuilder()
                                        .setLabel(menuOption.label)
                                        .setDescription(menuOption.description)
                                        .setValue(menuOption.value)
                                        .setEmoji(menuOption.emoji)
                                ));

                        const realtimeActionRow = new ActionRowBuilder().addComponents(realtimeGuidesSelectMenu);

                        botResponse.content = selectedGuide.content;
                        botResponse.embeds = botUtils.createEmbeds(selectedGuide, availableColors);
                        botResponse.components = [realtimeActionRow];
                        break;
                    default:
                        botResponse.ephemeral = true;
                        botResponse.content = 'This guide is not available in the selected language yet.';
                        return await interaction.reply(botResponse);
                }

                break;
            case 'upload':
                selectedGuide = botData.embeds.guides.upload[language];
                if (!selectedGuide) {
                    botResponse.ephemeral = true;
                    botResponse.content = 'This guide is not available in the selected language yet.';
                    return await interaction.reply(botResponse);
                }
                botResponse.embeds = botUtils.createEmbeds(selectedGuide, availableColors);
                break;
            case 'uvr':
                selectedGuide = botData.embeds.guides.uvr[language];
                if (!selectedGuide) {
                    botResponse.ephemeral = true;
                    botResponse.content = 'This guide is not available in the selected language yet.';
                    return await interaction.reply(botResponse);
                }
                botResponse.embeds = botUtils.createEmbeds(selectedGuide, availableColors);
                break;
            default:
                selectedGuide = botData.embeds.guides.rvc[language];
                if (!selectedGuide) {
                    botResponse.ephemeral = true;
                    botResponse.content = 'This guide is not available in the selected language yet.';
                    return await interaction.reply(botResponse);
                }
                botResponse.embeds = botUtils.createEmbeds(selectedGuide, availableColors);
        }

        if (targetUser && (targetUser.id !== interaction.user.id)) {
            // if try to send the guide to the bot...
            if (targetUser.id === client.user.id) {
                const bloopers = [
                    'bruh i know how to make ai cover',
                    'thanks i\'ll check',
                    'alright, thanks!',
                    'thanks for the guide suggestion',
                    'yeah imma read it, thanks!',
                    'okay, thanks for the suggestion!'
                ];
                return await interaction.reply(bloopers[client.botUtils.getRandomNumber(0, bloopers.length)]);
            }
            botResponse.content = `\n👇 Suggestions for ${targetUser}!`;
        }

        const botReply = await interaction.reply(botResponse);

        // listen to select menu events if applicable
        if (category === 'realtime' && language == 'en') {
            let selectMenuDisplayMinutes = targetUser ? 30 : 5;

            const collector = botReply.createMessageComponentCollector({
                componentType: ComponentType.StringSelect,
                time: selectMenuDisplayMinutes * 60 * 1000
            });

            collector.on('collect', (i) => {
                let allowedToInteract = i.user.id === mainUser.id;

                if (targetUser) {
                    allowedToInteract = i.user.id === mainUser.id || i.user.id === targetUser.id;
                }

                if (allowedToInteract) {
                    const selectMenuResult = i.values[0];

                    const realtimeGuides = botData.embeds.guides.realtime.en;
                    let guide;

                    if (selectMenuResult === 'realtime_local') {
                        guide = realtimeGuides.local
                    }
                    else if (selectMenuResult === 'realtime_online') {
                        guide = realtimeGuides.online
                    }
                    else if (selectMenuResult === 'realtime_faq') {
                        guide = realtimeGuides.faq

                    }

                    if (targetUser) {
                        botResponse.content = guide.content + `\nSuggestions for ${targetUser}`;
                    } else {
                        botResponse.content = guide.content;
                    }

                    botResponse.embeds = botUtils.createEmbeds(guide.embeds, availableColors);

                    i.update(botResponse);
                } else {
                    i.reply({ content: 'You didn\'t start this interaction, use `/guides realtime` if you wish to choose an option.', ephemeral: true });
                }
            });

            collector.on('end', (i) => {
                botResponse.content = '> This interaction has expired, use the command `/guides realtime` if you wish to see it again.';
                botResponse.embeds = [];
                botResponse.components = [];
                botReply.edit(botResponse);
            });
        }
    }
};