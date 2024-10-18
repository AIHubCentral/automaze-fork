"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* context menu version of /banana */
const discord_js_1 = require("discord.js");
const botUtilities_1 = require("../../Utils/botUtilities");
const i18n_1 = __importDefault(require("../../i18n"));
const discordUtilities_1 = require("../../Utils/discordUtilities");
const pretty_ms_1 = __importDefault(require("pretty-ms"));
const Banan = {
    category: 'Fun',
    data: new discord_js_1.ContextMenuCommandBuilder()
        .setName('banan')
        .setType(discord_js_1.ApplicationCommandType.User),
    async execute(interaction) {
        const client = interaction.client;
        const targetUser = interaction.targetUser;
        const logData = {
            guildId: interaction.guildId,
            channelId: interaction.channelId,
            commandName: interaction.commandName,
            executionTime: '',
        };
        if (!interaction.guild) {
            client.logger.warn(`failed to get guild info`, logData);
            return await interaction.reply({
                content: i18n_1.default.t('general.failed_retrieving_guild'),
                ephemeral: true,
            });
        }
        const startTime = Date.now();
        try {
            const guildMember = await getGuildMember(interaction.guild, targetUser.id);
            if (!guildMember) {
                client.logger.warn(`Guild member ${targetUser.id} not found`, logData);
                return await interaction.reply({
                    content: i18n_1.default.t('banan.failed_fetching_user'),
                    ephemeral: true,
                });
            }
            await (0, botUtilities_1.banan)(interaction, targetUser, guildMember);
        }
        catch (error) {
            if (error instanceof discord_js_1.DiscordAPIError) {
                (0, discordUtilities_1.handleDiscordError)(client.logger, error);
            }
        }
        finally {
            const executionTime = Date.now() - startTime;
            logData.executionTime = (0, pretty_ms_1.default)(executionTime);
            client.logger.info("banan'd user", logData);
        }
    },
};
exports.default = Banan;
async function getGuildMember(guild, userId) {
    let guildMember = guild.members.cache.get(userId);
    if (!guildMember) {
        guildMember = await guild.members.fetch(userId);
    }
    return guildMember;
}
