"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const i18next_1 = __importDefault(require("i18next"));
const discordUtilities_1 = require("../../Utils/discordUtilities");
const pretty_ms_1 = __importDefault(require("pretty-ms"));
const SendHelp = {
    category: 'Tags',
    data: new discord_js_1.ContextMenuCommandBuilder()
        .setName('Send help')
        .setType(discord_js_1.ApplicationCommandType.User),
    async execute(interaction) {
        const logData = {
            guildId: interaction.guildId,
            channelId: interaction.channelId,
            commandName: interaction.commandName,
            executionTime: '',
        };
        const client = interaction.client;
        const { targetUser } = interaction;
        const { logger } = client;
        if (targetUser.bot) {
            logger.warn(`tried sending ${interaction.commandName} to a bot user`);
            return await interaction.reply({
                content: i18next_1.default.t('general.bot_user', { lng: interaction.locale }),
                ephemeral: true,
            });
        }
        const embedDescription = i18next_1.default.t('faq.unknown.embedData.description', {
            returnObjects: true,
        });
        const startTime = Date.now();
        try {
            await interaction.reply({
                content: i18next_1.default.t('general.suggestions_for_user', { userId: targetUser.id }),
                embeds: [
                    new discord_js_1.EmbedBuilder()
                        .setTitle(`✍ Things you can try`)
                        .setColor(discord_js_1.Colors.Greyple)
                        .setDescription((0, discord_js_1.unorderedList)(embedDescription)),
                ],
            });
        }
        catch (error) {
            if (error instanceof discord_js_1.DiscordAPIError) {
                (0, discordUtilities_1.handleDiscordError)(client.logger, error);
            }
        }
        finally {
            const executionTime = Date.now() - startTime;
            logData.executionTime = (0, pretty_ms_1.default)(executionTime);
            client.logger.info('sent help with a context command', logData);
        }
    },
};
exports.default = SendHelp;
