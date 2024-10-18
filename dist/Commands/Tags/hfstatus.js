"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const botUtilities_1 = require("../../Utils/botUtilities");
const generalUtilities_1 = require("../../Utils/generalUtilities");
const discord_js_1 = require("discord.js");
const HFStatus = {
    name: 'hfstatus',
    description: 'Check hugginface status for the spaces',
    aliases: [],
    async run(client, message) {
        const { botCache, logger } = client;
        const resources = await (0, botUtilities_1.getResourceData)('hf', botCache, logger);
        if (resources.length === 0)
            return;
        const embed = new discord_js_1.EmbedBuilder().setTitle('⏳ Checking...').setColor(discord_js_1.Colors.Yellow);
        embed.setDescription(resources.map((resource) => `- ❔ ${resource.url}`).join('\n'));
        const botReply = await message.reply({ embeds: [embed] });
        const results = [];
        for (const resource of resources) {
            let statusEmoji = '❔';
            if (await checkSpaceStatus(resource.url, logger)) {
                statusEmoji = '🟢';
            }
            else {
                statusEmoji = '❌';
                embed.setColor(discord_js_1.Colors.DarkOrange);
            }
            results.push(`- ${statusEmoji} ${resource.url}`);
        }
        embed.setTitle('🤗 Hugginface Status');
        embed.setDescription(results.join('\n'));
        embed.setURL('https://status.huggingface.co/');
        await botReply.edit({ embeds: [embed] });
    },
};
exports.default = HFStatus;
async function checkSpaceStatus(url, logger) {
    logger.info(`Checking HF spaces status for ${url}...`);
    await (0, generalUtilities_1.delay)(1_500);
    try {
        const response = await axios_1.default.get(url);
        // If request is successful, space is up and running
        if (response.status === 200) {
            logger.info('Space is up and running.');
            return true;
        }
        else {
            logger.info('Space might be down.');
            return false;
        }
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            if (error.response && error.response.status === 404) {
                logger.error('Space not found. Ensure the Space ID is correct.');
            }
            else {
                logger.error('Error checking space status:', error.message);
            }
        }
        else {
            logger.error('Unexpected error:', error);
        }
        return false;
    }
}
