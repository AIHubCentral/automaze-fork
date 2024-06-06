"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
function createMenuOptions(availableOptions) {
    const menuOptions = [];
    for (const option of availableOptions ?? []) {
        const optionBuilder = new discord_js_1.StringSelectMenuOptionBuilder()
            .setLabel(option.label)
            .setDescription(option.description)
            .setValue(option.value);
        if (option.emoji) {
            optionBuilder.setEmoji(option.emoji);
        }
        menuOptions.push(optionBuilder);
    }
    return menuOptions;
}
const Realtime = {
    name: 'realtime',
    category: 'Tags',
    description: 'RVC real-time conversion guide',
    aliases: ['rt', 'tts'],
    syntax: `realtime [member]`,
    run: async (client, message) => {
        const { botData, botConfigs, botUtils } = client;
        const availableColors = botUtils.getAvailableColors(botConfigs);
        const realtimeSelectOptions = botData.embeds.realtime.en['menuOptions'];
        if (!realtimeSelectOptions)
            throw new Error('Missing menu options');
        let selectedGuide = botData.embeds.realtime.en['local'];
        const menuOptions = createMenuOptions(realtimeSelectOptions);
        var realtimeGuidesSelectMenu = new discord_js_1.StringSelectMenuBuilder()
            .setCustomId('realtime_guides')
            .setPlaceholder('Select a guide')
            .addOptions(menuOptions);
        const realtimeActionRow = new discord_js_1.ActionRowBuilder().addComponents(realtimeGuidesSelectMenu);
        let botResponse = {
            embeds: botUtils.createEmbeds(selectedGuide?.embeds, availableColors),
            components: [realtimeActionRow]
        };
        let selectMenuDisplayMinutes = 5; // allow interaction with the select menu for 5 minutes
        let targetUser = message.mentions.members?.first();
        let mainUser = message.author;
        if (targetUser) {
            botResponse.content = `*Tag suggestion for ${message.mentions.members?.first()}*`;
            selectMenuDisplayMinutes = 30; // menu available for 30 minutes if it was sent to someone
        }
        const botReply = await message.reply(botResponse);
        const collector = botReply.createMessageComponentCollector({
            componentType: discord_js_1.ComponentType.StringSelect,
            time: selectMenuDisplayMinutes * 60 * 1000
        });
        collector.on('collect', (i) => {
            let allowedToInteract = i.user.id === mainUser.id;
            if (targetUser) {
                allowedToInteract = i.user.id === mainUser.id || i.user.id === targetUser.id;
            }
            if (allowedToInteract) {
                const selectMenuResult = i.values[0];
                const realtimeGuides = botData.embeds.realtime.en;
                let guide;
                if (selectMenuResult === 'realtime_local') {
                    guide = realtimeGuides.local;
                }
                else if (selectMenuResult === 'realtime_online') {
                    guide = realtimeGuides.online;
                }
                else if (selectMenuResult === 'realtime_faq') {
                    guide = realtimeGuides.faq;
                }
                if (targetUser) {
                    botResponse.content = `\nSuggestions for ${targetUser}`;
                }
                botResponse.embeds = botUtils.createEmbeds(guide?.embeds, availableColors);
                i.update(botResponse);
            }
            else {
                i.reply({ content: 'You didn\'t start this interaction, use `/guides realtime` if you wish to choose an option.', ephemeral: true });
            }
        });
        collector.on('end', () => {
            botResponse.content = '> This interaction has expired, use the command `/guides realtime` if you wish to see it again.';
            botResponse.embeds = [];
            botResponse.components = [];
            botReply.edit(botResponse);
        });
    }
};
exports.default = Realtime;
