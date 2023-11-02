const {
    StringSelectMenuBuilder, StringSelectMenuOptionBuilder,
    ActionRowBuilder, ButtonBuilder, ButtonStyle,
    SlashCommandBuilder
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
                // TODO: continue this
                selectedGuide = botData.embeds.guides.realtime[language];
                if (!selectedGuide) {
                    botResponse.ephemeral = true;
                    botResponse.content = 'This guide is not available in the selected language yet.';
                    return await interaction.reply(botResponse);
                }

                const targetChannelId = client.discordIDs.Channel.HelpWOkada;
                const targetChannel = interaction.guild.channels.cache.get(targetChannelId) ?? '"help-w-okada" channel';

                const embedData = selectedGuide[0];

                // insert the link to the channel in $channel
                const lastDescriptionIndex = embedData.description.length - 1;
                const lastDescriptionText = embedData.description[lastDescriptionIndex]
                embedData.description[lastDescriptionIndex] = lastDescriptionText.replace('$channel', targetChannel);

                const selectMenu = new StringSelectMenuBuilder()
                    .setCustomId('realtime_guides')
                    .setPlaceholder('Select a guide')
                    .addOptions(
                        new StringSelectMenuOptionBuilder()
                            .setLabel('Local realtime guides')
                            .setDescription('If you have a decent GPU these can be a good option')
                            .setValue('realtime_local'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('Online realtime guides')
                            .setDescription('If you don\'t have a decent GPU these can be a good option')
                            .setValue('realtime_online')
                    );
                const realtimeActionRow = new ActionRowBuilder().addComponents(selectMenu);
                botResponse.content = '### Realtime guides'
                botResponse.embeds = botUtils.createEmbeds(selectedGuide, availableColors);
                botResponse.components = [realtimeActionRow];

                botResponse.embeds = botUtils.createEmbeds(selectedGuide, availableColors);
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
            botResponse.content += `\n👇 Suggestions for ${targetUser}!`;
            return await interaction.reply(botResponse);
        }

        await interaction.reply(botResponse);
    }
};