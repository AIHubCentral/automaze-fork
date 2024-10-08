"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const pretty_ms_1 = __importDefault(require("pretty-ms"));
const Ping = {
    name: 'ping',
    category: 'Info',
    description: 'pong!',
    aliases: [],
    syntax: 'ping',
    async run(client, message) {
        if (!client.uptime)
            return;
        const pingEmbed = new discord_js_1.EmbedBuilder()
            .setTitle(`<:aismug:1159365471368400948> WHO PINGED GRRR!!!!`)
            .setDescription(`- **Client's average ping**: ${client.ws.ping}ms\n- **Time passed since last ready**: ${(0, pretty_ms_1.default)(client.uptime, { verbose: true })}`)
            .setColor(client.botConfigs.colors.theme.primary);
        message?.reply({ embeds: [pingEmbed] });
    },
};
exports.default = Ping;
