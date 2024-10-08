import { EmbedBuilder } from 'discord.js';
import { PrefixCommand } from '../../Interfaces/Command';
import ms from 'pretty-ms';

const Ping: PrefixCommand = {
    name: 'ping',
    category: 'Info',
    description: 'pong!',
    aliases: [],
    syntax: 'ping',
    async run(client, message) {
        if (!client.uptime) return;
        const pingEmbed = new EmbedBuilder()
            .setTitle(`<:aismug:1159365471368400948> WHO PINGED GRRR!!!!`)
            .setDescription(
                `- **Client's average ping**: ${client.ws.ping}ms\n- **Time passed since last ready**: ${ms(client.uptime, { verbose: true })}`
            )
            .setColor(client.botConfigs.colors.theme.primary);
        message?.reply({ embeds: [pingEmbed] });
    },
};

export default Ping;
