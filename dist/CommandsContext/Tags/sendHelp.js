"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const i18next_1 = __importDefault(require("i18next"));
const SendHelp = {
    category: 'Tags',
    data: new discord_js_1.ContextMenuCommandBuilder()
        .setName('Send help')
        .setType(discord_js_1.ApplicationCommandType.User),
    async execute(interaction) {
        const { targetUser } = interaction;
        if (targetUser.bot)
            return await interaction.reply({ content: 'That user is a bot.', ephemeral: true });
        const client = interaction.client;
        const embedTitle = 'Things you can try';
        const channelIds = client.discordIDs.Channel;
        const embedDescription = i18next_1.default.t('faq.unknown.embedData.description', {
            returnObjects: true,
            okadaChannel: (0, discord_js_1.channelMention)(channelIds.HelpWOkada),
            helpChannel: (0, discord_js_1.channelMention)(channelIds.HelpRVC),
            helpAiArtChannel: (0, discord_js_1.channelMention)(channelIds.HelpAiArt),
        });
        await interaction.reply({
            content: 'Suggestions for' + (0, discord_js_1.userMention)(targetUser.id) + '\n',
            embeds: [
                new discord_js_1.EmbedBuilder()
                    .setTitle(`✍ ${embedTitle}`)
                    .setColor(discord_js_1.Colors.DarkAqua)
                    .setDescription((0, discord_js_1.unorderedList)(embedDescription)),
            ],
        });
    },
};
exports.default = SendHelp;
