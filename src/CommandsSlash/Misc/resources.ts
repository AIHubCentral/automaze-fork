import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    codeBlock,
    Colors,
    ComponentType,
    EmbedBuilder,
    SlashCommandBuilder,
} from 'discord.js';
import { SlashCommand } from '../../Interfaces/Command';
import ExtendedClient from '../../Core/extendedClient';
import ResourceService, { IResource } from '../../Services/resourceService';
import CollaboratorService from '../../Services/collaboratorService';
import slashCommandData from '../../../JSON/slashCommandData.json';
import { createStringOption } from '../../Utils/discordUtilities';
import knexInstance from '../../db';
import { generateRandomId } from '../../Utils/generalUtilities';

const commandData = slashCommandData.resources;

const Resources: SlashCommand = {
    category: 'Misc',
    cooldown: 5,
    data: createSlashCommandData(),
    async execute(interaction) {
        const client = interaction.client as ExtendedClient;
        const service = new ResourceService(knexInstance);

        const logData = {
            guildId: interaction.guildId,
            channelId: interaction.channelId,
            userId: interaction.user.id,
            userName: interaction.user.username,
        };

        client.logger.debug('/resources', logData);

        const collaboratorsService = new CollaboratorService(knexInstance);
        const collaboratorUser = await collaboratorsService.find(interaction.user.id);

        if (!collaboratorUser) {
            await interaction.reply({
                content: 'Ask **RayTracer** if you want to use this command!',
                ephemeral: true,
            });
            return;
        }

        if (interaction.options.getSubcommand() === 'add') {
            const category = interaction.options.getString('category', true);
            const url = interaction.options.getString('url', true);
            const title = interaction.options.getString('title') ?? '';
            const authors = interaction.options.getString('authors') ?? '';
            const emoji = interaction.options.getString('emoji') ?? '';

            const resourceId = await service.create({
                category,
                url,
                authors,
                emoji,
                displayTitle: title,
            });

            const embed = new EmbedBuilder();
            embed.setTitle('Resource added!');
            embed.setDescription(`ID: **${resourceId}**, URL: ${url}`);
            embed.setColor(Colors.DarkGreen);

            await interaction.reply({ embeds: [embed] });
        } else if (interaction.options.getSubcommand() === 'delete') {
            const id = interaction.options.getInteger('id', true);

            const resource = await service.find(id);

            const embed = new EmbedBuilder();

            if (!resource) {
                embed.setTitle('Invalid resource');
                embed.setDescription(`Coudn't find resource with ID ${id}`);
                embed.setColor(Colors.Red);
                await interaction.reply({ embeds: [embed] });
                return;
            }

            const affectedRows = await service.delete(id);

            if (affectedRows === 1) {
                embed.setTitle('Resource deleted');
                embed.setDescription(`ID: ${id}, URL: ${resource.url}`);
                embed.setColor(Colors.DarkGreen);
            } else {
                embed.setTitle('Failed to delete');
                embed.setDescription(`ID: ${id}, URL: ${resource.url}`);
                embed.setColor(Colors.Red);
            }

            await interaction.reply({ embeds: [embed] });
        } else if (interaction.options.getSubcommand() === 'show') {
            const category = interaction.options.getString('category', true);

            let offset = 0;
            let currentPage = 1;
            const limit = 2;

            let resources = await service.findAll({
                offset,
                limit,
                filter: { column: 'category', value: category },
            });

            const totalResources = resources.data.length;

            if (totalResources === 0) {
                await interaction.reply({ content: 'No resource was found.' });
                return;
            }

            const embed = new EmbedBuilder().setTitle('📋 Resources - Show').setColor(Colors.Blurple);

            embed.setFields([
                {
                    name: 'Category',
                    value: category,
                    inline: false,
                },
                {
                    name: 'Items',
                    value: codeBlock('json', JSON.stringify(resources.data, null, 2)),
                    inline: false,
                },
            ]);
            embed.setTimestamp();

            const prevButtonId = `btn_prev_${generateRandomId(6)}`;
            const nextButtonId = `btn_next_${generateRandomId(6)}`;

            const btnPrevious = new ButtonBuilder()
                .setCustomId(prevButtonId)
                .setStyle(ButtonStyle.Primary)
                .setLabel('Previous')
                .setDisabled(true);

            const btnNext = new ButtonBuilder()
                .setCustomId(nextButtonId)
                .setStyle(ButtonStyle.Primary)
                .setLabel('Next');

            const actionRow = new ActionRowBuilder<ButtonBuilder>();
            actionRow.addComponents(btnPrevious, btnNext);

            embed.setFooter({ text: `Page ${offset + 1} of ?` });

            const message = await interaction.reply({
                embeds: [embed],
                components: [actionRow],
                fetchReply: true,
            });

            const collector = message.createMessageComponentCollector({
                componentType: ComponentType.Button,
                time: 10 * 60 * 1000, // expires after 10 minutes
            });

            collector.on('collect', async (buttonInteraction: ButtonInteraction) => {
                // Check which button was pressed and update the embed accordingly
                if (buttonInteraction.customId === prevButtonId) {
                    offset -= limit;

                    resources = await service.findAll({
                        offset,
                        limit,
                        filter: { column: 'category', value: category },
                    });

                    currentPage--;
                } else if (buttonInteraction.customId === nextButtonId) {
                    offset += limit;

                    resources = await service.findAll({
                        offset,
                        limit,
                        filter: { column: 'category', value: category },
                    });

                    currentPage++;
                }

                embed.setFields([
                    {
                        name: 'Category',
                        value: category,
                        inline: false,
                    },
                    {
                        name: 'Items',
                        value: codeBlock('json', JSON.stringify(resources.data, null, 2)),
                        inline: false,
                    },
                ]);

                embed.setFooter({ text: `Page ${currentPage} of ?` });
                btnPrevious.setDisabled(offset === 0);
                btnNext.setDisabled(!resources.hasNext);

                // Update the message with the new embed
                await buttonInteraction.update({ embeds: [embed], components: [actionRow] });
            });

            collector.on('end', async () => {
                // After 5 minutes, disable the buttons
                const disabledRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
                    btnPrevious.setDisabled(true),
                    btnNext.setDisabled(true)
                );

                // Update the message to show the disabled buttons
                await interaction.editReply({
                    components: [disabledRow],
                });
            });
        } else if (interaction.options.getSubcommand() === 'update') {
            const id = interaction.options.getInteger('id', true);

            const resource = await service.find(id);

            const embed = new EmbedBuilder();

            if (!resource) {
                embed.setTitle('Invalid resource');
                embed.setDescription(`Coudn't find resource with ID ${id}`);
                embed.setColor(Colors.Red);
                await interaction.reply({ embeds: [embed] });
                return;
            }

            const category = interaction.options.getString('category', true);
            const url = interaction.options.getString('url', true);
            const title = interaction.options.getString('title') ?? '';
            const authors = interaction.options.getString('authors') ?? '';
            const emoji = interaction.options.getString('emoji') ?? '';

            const updatedData: Partial<IResource> = {
                ...(category && { category }),
                ...(url && { url }),
                ...(title && { displayTitle: title }),
                ...(emoji && { emoji }),
                ...(authors && { authors }),
            };

            const affectedRows = await service.update(id, updatedData);
            const updatedSuccessfully = affectedRows === 1;

            if (updatedSuccessfully) {
                embed.setTitle('Resource updated');
                embed.setDescription(`**ID**: \`${id}\`, **URL**: ${url}`);
                embed.setColor(Colors.DarkAqua);
            } else {
                embed.setTitle('Failed to update');
                embed.setDescription(`**ID**: ${id}, **URL**: ${resource.url}`);
                embed.setColor(Colors.Red);
            }

            await interaction.reply({ embeds: [embed] });
        } else if (interaction.options.getSubcommand() === 'refresh') {
            client.botCache.clear();
            await interaction.reply({
                embeds: [new EmbedBuilder().setTitle('🔃 Data refreshed').setColor(Colors.DarkBlue)],
            });
        }
    },
};

export default Resources;

// helper functions
function createSlashCommandData() {
    return new SlashCommandBuilder()
        .setName(commandData.name)
        .setNameLocalizations(commandData.nameLocalizations)
        .setDescription(commandData.description)
        .setDescriptionLocalizations(commandData.descriptionLocalizations)
        .addSubcommand((subcommand) =>
            subcommand
                .setName(commandData.subcommands.add.name)
                .setNameLocalizations(commandData.subcommands.add.nameLocalizations)
                .setDescription(commandData.subcommands.add.description)
                .setDescriptionLocalizations(commandData.subcommands.add.descriptionLocalizations)
                .addStringOption(createStringOption(commandData.commonOptions.category))
                .addStringOption(createStringOption(commandData.commonOptions.url))
                .addStringOption(createStringOption(commandData.commonOptions.title))
                .addStringOption(createStringOption(commandData.commonOptions.authors))
                .addStringOption(createStringOption(commandData.commonOptions.emoji))
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName(commandData.subcommands.update.name)
                .setNameLocalizations(commandData.subcommands.update.nameLocalizations)
                .setDescription(commandData.subcommands.update.description)
                .setDescriptionLocalizations(commandData.subcommands.update.descriptionLocalizations)
                .addIntegerOption((option) =>
                    option
                        .setName(commandData.commonOptions.id.name)
                        .setDescription(commandData.commonOptions.id.description)
                        .setDescriptionLocalizations(commandData.commonOptions.id.descriptionLocalizations)
                        .setRequired(true)
                )
                .addStringOption(createStringOption(commandData.commonOptions.category))
                .addStringOption(createStringOption(commandData.commonOptions.url))
                .addStringOption(createStringOption(commandData.commonOptions.title))
                .addStringOption(createStringOption(commandData.commonOptions.authors))
                .addStringOption(createStringOption(commandData.commonOptions.emoji))
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName(commandData.subcommands.delete.name)
                .setNameLocalizations(commandData.subcommands.delete.nameLocalizations)
                .setDescription(commandData.subcommands.delete.description)
                .setDescriptionLocalizations(commandData.subcommands.delete.descriptionLocalizations)
                .addIntegerOption((option) =>
                    option
                        .setName(commandData.commonOptions.id.name)
                        .setDescription(commandData.commonOptions.id.description)
                        .setDescriptionLocalizations(commandData.commonOptions.id.descriptionLocalizations)
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName(commandData.subcommands.show.name)
                .setNameLocalizations(commandData.subcommands.show.nameLocalizations)
                .setDescription(commandData.subcommands.show.description)
                .setDescriptionLocalizations(commandData.subcommands.show.descriptionLocalizations)
                .addStringOption(createStringOption(commandData.commonOptions.category))
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName(commandData.subcommands.refresh.name)
                .setDescription(commandData.subcommands.refresh.description)
                .setDescriptionLocalizations(commandData.subcommands.refresh.descriptionLocalizations)
        );
}
