import { bold, Colors, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { SlashCommand } from '../../Interfaces/Command';
import ms from 'pretty-ms';
import { sendErrorLog } from '../../Utils/botUtilities';
import ExtendedClient from '../../Core/extendedClient';

const Ping: SlashCommand = {
    category: 'General',
    data: new SlashCommandBuilder().setName('ping').setDescription('Pong!'),
    async execute(interaction) {
        const { client } = interaction;
        if (!interaction.client.uptime) return;

        try {
            const embed = new EmbedBuilder()
                .setTitle(`<:aismug:1159365471368400948> WHO PINGED GRRR!!!!`)
                .setDescription(
                    [
                        `- ${bold("Client's average ping")}: ${client.ws.ping}ms`,
                        `- ${bold('Time passed since last ready')}: ${ms(client.uptime, { verbose: true })}`,
                    ].join('\n')
                )
                .setColor(Colors.Aqua);
            interaction.reply({ embeds: [embed] });
        } catch (error) {
            await sendErrorLog(interaction.client as ExtendedClient, error, {
                command: `/${interaction.commandName}`,
                message: 'failed to banan',
                guildId: interaction.guildId ?? '',
                channelId: interaction.channelId,
            });
        }
    },
};

export default Ping;
