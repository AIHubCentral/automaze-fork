"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const discordUtilities_1 = require("../../Utils/discordUtilities");
const i18next_1 = __importDefault(require("i18next"));
const generalUtilities_1 = require("../../Utils/generalUtilities");
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
    description: 'RVC real-time conversion guide',
    aliases: ['rt', 'tts'],
    run: async (client, message) => {
        const { botConfigs, botUtils } = client;
        const availableColors = botUtils.getAvailableColors(botConfigs);
        const realtimeSelectOptions = i18next_1.default.t('tags.realtime.menuOptions', {
            returnObjects: true,
        });
        // selects local RVC by default
        const selectedGuide = i18next_1.default.t('tags.realtime.local', {
            returnObjects: true,
        });
        const menuOptions = createMenuOptions(realtimeSelectOptions);
        const menuId = `realtime_${(0, generalUtilities_1.generateRandomId)(6)}`;
        const realtimeGuidesSelectMenu = new discord_js_1.StringSelectMenuBuilder()
            .setCustomId(menuId)
            .setPlaceholder(i18next_1.default.t('tags.realtime.placeholder'))
            .addOptions(menuOptions);
        const row = new discord_js_1.ActionRowBuilder().addComponents(realtimeGuidesSelectMenu);
        const botResponse = {
            embeds: (0, discordUtilities_1.createEmbeds)(selectedGuide.embeds, availableColors),
            components: [row],
        };
        const selectMenuDisplayMinutes = 10; // allow interaction with the select menu for 10 minutes
        const targetUser = message.mentions.members?.first();
        const mainUser = message.author;
        if (targetUser) {
            botResponse.content = i18next_1.default.t('general.suggestions_for_user', { userId: targetUser.id });
        }
        const botReply = await message.reply(botResponse);
        const currentChannel = message.channel;
        const filter = (i) => i.isStringSelectMenu() && i.customId === menuId;
        const collector = currentChannel.createMessageComponentCollector({
            filter,
            time: selectMenuDisplayMinutes * 60 * 1000,
        });
        collector.on('collect', async (i) => {
            let allowedToInteract = i.user.id === mainUser.id;
            if (targetUser) {
                allowedToInteract = i.user.id === mainUser.id || i.user.id === targetUser.id;
            }
            if (allowedToInteract) {
                await i.deferUpdate();
                const selectMenuResult = i.values[0];
                const guideEmbeds = i18next_1.default.t(`tags.realtime.${selectMenuResult}.embeds`, {
                    returnObjects: true,
                });
                if (targetUser) {
                    botResponse.content = i18next_1.default.t('general.suggestions_for_user', {
                        userId: targetUser.id,
                    });
                }
                botResponse.embeds = (0, discordUtilities_1.createEmbeds)(guideEmbeds, availableColors);
                i.editReply(botResponse);
            }
            else {
                i.reply({
                    content: i18next_1.default.t('tags.realtime.not_allowed_to_interact'),
                    ephemeral: true,
                });
            }
        });
        collector.on('end', () => {
            botResponse.content = i18next_1.default.t('tags.realtime.expired');
            botResponse.embeds = [];
            botResponse.components = [];
            botReply.edit(botResponse);
        });
    },
};
exports.default = Realtime;
