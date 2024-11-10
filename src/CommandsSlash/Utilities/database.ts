/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import {
    SlashCommandBuilder,
    EmbedBuilder,
    ChatInputCommandInteraction,
    Colors,
    codeBlock,
    AttachmentBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    ComponentType,
    ButtonInteraction,
} from 'discord.js';
import { SlashCommand } from '../../Interfaces/Command';

import UserService from '../../Services/userService';
import CollaboratorService from '../../Services/collaboratorService';
import ResourceService from '../../Services/resourceService';

import knexInstance from '../../db';
import { generateRandomId } from '../../Utils/generalUtilities';
import SettingsService from '../../Services/settingsService';
import ModelService, { WeightsModelService } from '../../Services/modelService';
import { sendErrorLog } from '../../Utils/botUtilities';
import ExtendedClient from '../../Core/extendedClient';

enum DatabaseTables {
    Collaborators = 'collaborators',
    Resources = 'resources',
    Settings = 'settings',
    Users = 'users',
    Models = 'models',
    WeightsModel = 'weights_models',
}

const choices = [
    { name: 'Collaborators', value: DatabaseTables.Collaborators },
    { name: 'Models', value: DatabaseTables.Models },
    { name: 'Resources', value: DatabaseTables.Resources },
    { name: 'Settings', value: DatabaseTables.Settings },
    { name: 'Users', value: DatabaseTables.Users },
    { name: 'Weights', value: DatabaseTables.WeightsModel },
];

type ServiceTypes =
    | UserService
    | CollaboratorService
    | ResourceService
    | SettingsService
    | ModelService
    | WeightsModelService;

const Database: SlashCommand = {
    category: 'Utilities',
    data: new SlashCommandBuilder()
        .setName('database')
        .setDescription('Manage database operations')
        .addSubcommand((subcommand) =>
            subcommand
                .setName('create')
                .setDescription('Create a new entry in the database')
                .addAttachmentOption((option) =>
                    option.setName('file').setDescription('JSON file to upload').setRequired(true)
                )
                .addStringOption((option) =>
                    option
                        .setName('source')
                        .setDescription('The source table')
                        .addChoices(choices)
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('read')
                .setDescription('Read entries from the database')
                .addStringOption((option) =>
                    option
                        .setName('source')
                        .setDescription('The source table')
                        .addChoices(choices)
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('update')
                .setDescription('Update an existing entry in the database')
                .addStringOption((option) =>
                    option.setName('id').setDescription('Record ID').setRequired(true)
                )
                .addAttachmentOption((option) =>
                    option.setName('file').setDescription('JSON file to upload').setRequired(true)
                )
                .addStringOption((option) =>
                    option
                        .setName('source')
                        .setDescription('The source table')
                        .addChoices(choices)
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('delete')
                .setDescription('Delete an entry from the database')
                .addStringOption((option) =>
                    option.setName('id').setDescription('Record ID').setRequired(true)
                )
                .addStringOption((option) =>
                    option
                        .setName('source')
                        .setDescription('The source table')
                        .addChoices(choices)
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('import')
                .setDescription('Import data into the database')
                .addStringOption((option) =>
                    option
                        .setName('source')
                        .setDescription('The source table')
                        .addChoices(choices)
                        .setRequired(true)
                )
                .addAttachmentOption((option) =>
                    option.setName('file').setDescription('JSON data to import').setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('export')
                .setDescription('Export data from the database')
                .addStringOption((option) =>
                    option
                        .setName('source')
                        .setDescription('The source table')
                        .addChoices(choices)
                        .setRequired(true)
                )
        ),
    async execute(interaction) {
        const subCommand = interaction.options.getSubcommand();
        const source = interaction.options.getString('source', true);

        let service: ServiceTypes | null = null;

        if (source === DatabaseTables.Users) {
            service = new UserService(knexInstance);
        } else if (source === DatabaseTables.Collaborators) {
            service = new CollaboratorService(knexInstance);
        } else if (source === DatabaseTables.Resources) {
            service = new ResourceService(knexInstance);
        } else if (source === DatabaseTables.Settings) {
            service = new SettingsService(knexInstance);
        } else if (source === DatabaseTables.Models) {
            service = new ModelService(knexInstance);
        } else if (source === DatabaseTables.WeightsModel) {
            service = new WeightsModelService(knexInstance);
        }

        if (!service) {
            await interaction.reply({ content: 'Failed to select a database service', ephemeral: true });
            return;
        }

        try {
            await interaction.deferReply({ ephemeral: true });

            if (subCommand === 'create') {
                const attachment = interaction.options.getAttachment('file', true);

                try {
                    const response = await axios.get(attachment.url);
                    const jsonData = response.data as unknown;

                    await handleDatabaseCreate(interaction, service, jsonData);
                } catch (error) {
                    console.error('Error reading JSON file:', error);
                    return interaction.reply('Failed to process JSON file.');
                }
            } else if (subCommand === 'read') {
                await handleDatabaseRead(interaction, service);
            } else if (subCommand === 'update') {
                const attachment = interaction.options.getAttachment('file', true);
                const id = interaction.options.getString('id', true);

                try {
                    const response = await axios.get(attachment.url);
                    const jsonData = response.data as unknown;

                    await handleDatabaseUpdate(interaction, service, id, jsonData);
                } catch (error) {
                    console.error('Error reading JSON file:', error);
                    return interaction.reply('Failed to process JSON file.');
                }
            } else if (subCommand === 'delete') {
                const userId = interaction.options.getString('id', true);
                await handleDatabaseDelete(interaction, service, userId);
            } else if (subCommand === 'import') {
                const attachment = interaction.options.getAttachment('file', true);

                try {
                    const response = await axios.get(attachment.url);
                    const jsonData = response.data as unknown;

                    await handleDatabaseImport(interaction, service, jsonData);
                } catch (error) {
                    console.error('Error reading JSON file:', error);
                    return interaction.reply('Failed to process JSON file.');
                }
            } else if (subCommand === 'export') {
                await handleDatabaseExport(interaction, service);
            }
        } catch (error) {
            await sendErrorLog(interaction.client as ExtendedClient, error, {
                command: `/${interaction.commandName}`,
                message: 'Failure on /database',
                guildId: interaction.guildId ?? '',
                channelId: interaction.channelId,
            });
        }
    },
};

export default Database;

async function handleDatabaseCreate(
    interaction: ChatInputCommandInteraction,
    service: ServiceTypes,
    newData: any
) {
    let fetchedData = await service.find(newData.id);
    if (fetchedData) {
        return await interaction.editReply({ content: `Record with ID ${newData.id} already exists` });
    }

    const savedId = await service.create(newData);
    fetchedData = await service.find(savedId);

    const embed = new EmbedBuilder().setColor(Colors.LightGrey).setTitle('Database - Create');
    embed.setDescription(codeBlock(JSON.stringify(fetchedData, null, 4)));

    await interaction.editReply({ embeds: [embed] });
}

async function handleDatabaseRead(interaction: ChatInputCommandInteraction, service: ServiceTypes) {
    let offset = 0;
    let currentPage = 1;
    const limit = 2;

    let resources = await service.findAll({
        offset,
        limit,
    });

    if (!resources.data.length) {
        return await interaction.editReply({ content: 'No records' });
    }

    const totalResources = resources.data.length;

    if (totalResources === 0) {
        await interaction.reply({ content: 'No resource was found.' });
        return;
    }

    const embed = new EmbedBuilder().setTitle('📋 Resources - Show').setColor(Colors.Blurple);

    embed.setFields([
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

    const message = await interaction.editReply({
        embeds: [embed],
        components: [actionRow],
    });

    const collector = message.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: 2 * 60 * 1000, // expires after 5 minutes
    });

    collector.on('collect', async (buttonInteraction: ButtonInteraction) => {
        // Check which button was pressed and update the embed accordingly
        if (buttonInteraction.customId === prevButtonId) {
            offset -= limit;

            resources = await service.findAll({
                offset,
                limit,
            });

            currentPage--;
        } else if (buttonInteraction.customId === nextButtonId) {
            offset += limit;

            resources = await service.findAll({
                offset,
                limit,
            });

            currentPage++;
        }

        embed.setFields([
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
}

async function handleDatabaseUpdate(
    interaction: ChatInputCommandInteraction,
    service: ServiceTypes,
    id: string,
    newData: any
) {
    let fetchedData = await service.find(id);
    if (!fetchedData) {
        return await interaction.editReply({ content: `Record with ID ${id} not found` });
    }

    const affectedRows = await service.update(id, newData);
    if (affectedRows < 1) {
        return await interaction.editReply({ content: `Failed to update record with ID ${id}` });
    }

    fetchedData = await service.find(id);

    const embed = new EmbedBuilder().setColor(Colors.Orange).setTitle('Database - Update');
    embed.setDescription(codeBlock(JSON.stringify(fetchedData, null, 4)));

    await interaction.editReply({ embeds: [embed] });
}

async function handleDatabaseDelete(
    interaction: ChatInputCommandInteraction,
    service: ServiceTypes,
    id: string
) {
    const fetchedData = await service.find(id);
    if (!fetchedData) {
        return await interaction.editReply({ content: `Record with ID ${id} not found` });
    }

    const affectedRows = await service.delete(id);
    if (affectedRows < 1) {
        return await interaction.editReply({ content: `Failed to delete record with ID ${id}` });
    }

    const embed = new EmbedBuilder().setColor(Colors.Red).setTitle('Database - Delete');
    embed.setDescription(`Deleted record with ID ${id}`);

    await interaction.editReply({ embeds: [embed] });
}

async function handleDatabaseImport(
    interaction: ChatInputCommandInteraction,
    service: ServiceTypes,
    newData: any
) {
    await service.clearAll();

    for (const item of newData as Array<any>) {
        await service.create(item);
    }

    const fetchedData = await service.findAll();

    const embed = new EmbedBuilder().setColor(Colors.LightGrey).setTitle('Database - Import');

    const jsonOutput = codeBlock(JSON.stringify(fetchedData.data, null, 4));

    if (jsonOutput.length > 4000) {
        embed.setDescription(`Imported ${fetchedData.data.length} items`);
    } else {
        embed.setDescription(jsonOutput);
    }

    await interaction.editReply({ embeds: [embed] });
}

async function handleDatabaseExport(interaction: ChatInputCommandInteraction, service: ServiceTypes) {
    const allRecords = await service.findAll();

    const buffer = Buffer.from(JSON.stringify(allRecords.data), 'utf-8');
    const attachment = new AttachmentBuilder(buffer, { name: 'exported.json' });
    await interaction.editReply({ files: [attachment] });
}
