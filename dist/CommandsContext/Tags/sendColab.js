"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const discordUtilities_1 = require("../../Utils/discordUtilities");
const botUtilities_1 = require("../../Utils/botUtilities");
const i18n_1 = __importDefault(require("../../i18n"));
const pretty_ms_1 = __importDefault(require("pretty-ms"));
const SendColabLinks = {
    category: 'Tags',
    data: new discord_js_1.ContextMenuCommandBuilder()
        .setName('Send Colab links')
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
        const { botCache, logger } = client;
        if (targetUser.bot) {
            logger.warn(`tried sending ${interaction.commandName} to a bot user`);
            return await interaction.reply({
                content: i18n_1.default.t('general.bot_user', { lng: interaction.locale }),
                ephemeral: true,
            });
        }
        const resources = await (0, botUtilities_1.getResourceData)('colab', botCache, logger);
        if (resources.length === 0) {
            await interaction.reply({
                content: i18n_1.default.t('general.not_available', { lng: interaction.locale }),
                ephemeral: true,
            });
            return;
        }
        const startTime = Date.now();
        try {
            await interaction.reply({
                content: i18n_1.default.t('general.suggestions_for_user', { userId: targetUser.id }),
                embeds: [
                    (0, discordUtilities_1.createEmbed)({
                        title: i18n_1.default.t('tags.colab.embed.title'),
                        color: 'f9ab00',
                        description: [(0, botUtilities_1.resourcesToUnorderedList)(resources)],
                    }),
                    (0, discordUtilities_1.createEmbed)({
                        title: i18n_1.default.t('tags.colab.notice.embed.title'),
                        description: [i18n_1.default.t('tags.colab.notice.embed.description')],
                        footer: i18n_1.default.t('tags.colab.embed.footer'),
                    }),
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
            client.logger.info('sent colab links', logData);
        }
    },
};
exports.default = SendColabLinks;
