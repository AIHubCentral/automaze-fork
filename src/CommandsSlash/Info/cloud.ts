import { ColorResolvable, Colors, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { SlashCommand } from '../../Interfaces/Command';
import ExtendedClient from '../../Core/extendedClient';
import {
    CloudPlatform,
    getResourceData,
    resourcesToUnorderedList,
    sendErrorLog,
} from '../../Utils/botUtilities';

import slashCommandData from '../../../JSON/slashCommandData.json';

const cloudCommandData = slashCommandData.cloud;

const Cloud: SlashCommand = {
    category: 'Info',
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName(cloudCommandData.name)
        .setDescription(cloudCommandData.description)
        .setDescriptionLocalizations(cloudCommandData.descriptionLocalizations)
        .addStringOption((option) =>
            option
                .setName(cloudCommandData.options.platform.name)
                .setNameLocalizations(cloudCommandData.options.platform.nameLocalizations)
                .setDescription(cloudCommandData.options.platform.description)
                .setDescriptionLocalizations(cloudCommandData.options.platform.descriptionLocalizations)
                .addChoices(
                    { name: 'colab', value: CloudPlatform.Colab },
                    { name: 'huggingface', value: CloudPlatform.Huggingface },
                    { name: 'kaggle', value: CloudPlatform.Kaggle },
                    { name: 'lightning', value: CloudPlatform.Lightning }
                )
                .setRequired(true)
        ),
    async execute(interaction) {
        const client = interaction.client as ExtendedClient;

        const logData = {
            guildId: interaction.guildId,
            channelId: interaction.channelId,
            userId: interaction.user.id,
            userName: interaction.user.username,
        };

        client.logger.debug('/cloud', logData);
        const { botCache, logger } = client;

        const platform = interaction.options.getString('platform', true);

        try {
            const resources = await getResourceData(platform, botCache, logger);

            const embed = new EmbedBuilder()
                .setTitle('Not available yet')
                .setColor(Colors.Grey)
                .setDescription('Stay tuned!');

            if (resources.length === 0) {
                await interaction.reply({ embeds: [embed], ephemeral: true });
                return;
            }

            if (platform === CloudPlatform.Colab) {
                embed
                    .setTitle('☁️ Google Colabs')
                    .setColor('f9ab00' as ColorResolvable)
                    .setDescription(resourcesToUnorderedList(resources));
            } else if (platform === CloudPlatform.Huggingface) {
                embed
                    .setTitle('<:huggingface:1179800228946268270> Hugginface Spaces')
                    .setColor('ffcc4d' as ColorResolvable)
                    .setDescription(resourcesToUnorderedList(resources));
            } else if (platform === CloudPlatform.Kaggle) {
                embed
                    .setTitle('📘 Kaggle Notebooks')
                    .setColor(Colors.Blue)
                    .setDescription(resourcesToUnorderedList(resources));
            } else if (platform === CloudPlatform.Lightning) {
                embed
                    .setTitle('⚡ Lightning AI')
                    .setColor('b45aff' as ColorResolvable)
                    .setDescription(resourcesToUnorderedList(resources));
            }

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            await sendErrorLog(client, error, {
                command: `/${interaction.commandName}`,
                message: 'Failure on /cloud',
                guildId: interaction.guildId ?? '',
                channelId: interaction.channelId,
            });
        }
    },
};

export default Cloud;
