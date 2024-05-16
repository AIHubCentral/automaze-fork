"use strict";
const { EmbedBuilder } = require("discord.js");
const ms = require(`pretty-ms`);
module.exports = {
    name: 'ping',
    category: 'Info',
    description: 'pong!',
    aliases: [],
    syntax: 'ping',
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
     * @param {String} prefix
     */
    run: (client, message, args, prefix) => {
        const pingEmbed = new EmbedBuilder()
            .setTitle(`<:aismug:1159365471368400948> WHO PINGED GRRR!!!!`)
            .setDescription(`- **Client's average ping**: ${client.ws.ping}ms\n- **Time passed since last ready**: ${ms(client.uptime, { verbose: true })}`)
            .setColor(client.botConfigs.colors.theme.primary);
        message.reply({ embeds: [pingEmbed] });
    }
};
