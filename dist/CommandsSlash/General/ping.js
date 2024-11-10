"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const pretty_ms_1 = __importDefault(require("pretty-ms"));
const botUtilities_1 = require("../../Utils/botUtilities");
const Ping = {
    category: 'General',
    data: new discord_js_1.SlashCommandBuilder().setName('ping').setDescription('Pong!'),
    async execute(interaction) {
        const { client } = interaction;
        if (!interaction.client.uptime)
            return;
        try {
            const embed = new discord_js_1.EmbedBuilder()
                .setTitle(`<:aismug:1159365471368400948> WHO PINGED GRRR!!!!`)
                .setDescription([
                `- ${(0, discord_js_1.bold)("Client's average ping")}: ${client.ws.ping}ms`,
                `- ${(0, discord_js_1.bold)('Time passed since last ready')}: ${(0, pretty_ms_1.default)(client.uptime, { verbose: true })}`,
            ].join('\n'))
                .setColor(discord_js_1.Colors.Aqua);
            interaction.reply({ embeds: [embed] });
        }
        catch (error) {
            await (0, botUtilities_1.sendErrorLog)(interaction.client, error, {
                command: `/${interaction.commandName}`,
                message: 'failed to banan',
                guildId: interaction.guildId ?? '',
                channelId: interaction.channelId,
            });
        }
    },
};
exports.default = Ping;
