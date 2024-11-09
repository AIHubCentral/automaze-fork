"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const discordUtilities_1 = require("../../Utils/discordUtilities");
const i18n_1 = __importDefault(require("../../i18n"));
const pretty_ms_1 = __importDefault(require("pretty-ms"));
const SendRVCGuides = {
    category: 'Tags',
    data: new discord_js_1.ContextMenuCommandBuilder()
        .setName('Send RVC guides')
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
                content: i18n_1.default.t('general.bot_user', { lng: interaction.locale }),
                ephemeral: true,
            });
        }
        const content = i18n_1.default.t('tags.rvc.embeds', { returnObjects: true });
        const startTime = Date.now();
        try {
            let selectedTheme = null;
            const settings = client.botCache.get('main_settings');
            if (!settings) {
                selectedTheme = discordUtilities_1.ColorThemes.Default;
            }
            else {
                selectedTheme = settings.theme;
            }
            const apiEmbedData = content.map((item) => {
                return {
                    title: item.title,
                    description: item.description?.join('\n'),
                };
            });
            const botResponse = {
                content: `Hello, ${targetUser}! Here are some recommended resources for you!`,
                embeds: (0, discordUtilities_1.createThemedEmbeds)(apiEmbedData, selectedTheme),
            };
            interaction.reply(botResponse);
        }
        catch (error) {
            if (error instanceof discord_js_1.DiscordAPIError) {
                (0, discordUtilities_1.handleDiscordError)(client.logger, error);
            }
        }
        finally {
            const executionTime = Date.now() - startTime;
            logData.executionTime = (0, pretty_ms_1.default)(executionTime);
            client.logger.info('sent rvc guides with a context command', logData);
        }
    },
};
exports.default = SendRVCGuides;
