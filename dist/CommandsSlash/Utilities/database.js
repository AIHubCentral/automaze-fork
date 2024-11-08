"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
const axios_1 = __importDefault(require("axios"));
const discord_js_1 = require("discord.js");
const userService_1 = __importDefault(require("../../Services/userService"));
const collaboratorService_1 = __importDefault(require("../../Services/collaboratorService"));
const resourceService_1 = __importDefault(require("../../Services/resourceService"));
const db_1 = __importDefault(require("../../db"));
const generalUtilities_1 = require("../../Utils/generalUtilities");
const settingsService_1 = __importDefault(require("../../Services/settingsService"));
const modelService_1 = __importStar(require("../../Services/modelService"));
var DatabaseTables;
(function (DatabaseTables) {
    DatabaseTables["Collaborators"] = "collaborators";
    DatabaseTables["Resources"] = "resources";
    DatabaseTables["Settings"] = "settings";
    DatabaseTables["Users"] = "users";
    DatabaseTables["Models"] = "models";
    DatabaseTables["WeightsModel"] = "weights_models";
})(DatabaseTables || (DatabaseTables = {}));
const choices = [
    { name: 'Collaborators', value: DatabaseTables.Collaborators },
    { name: 'Models', value: DatabaseTables.Models },
    { name: 'Resources', value: DatabaseTables.Resources },
    { name: 'Settings', value: DatabaseTables.Settings },
    { name: 'Users', value: DatabaseTables.Users },
    { name: 'Weights', value: DatabaseTables.WeightsModel },
];
const Database = {
    category: 'Utilities',
    data: new discord_js_1.SlashCommandBuilder()
        .setName('database')
        .setDescription('Manage database operations')
        .addSubcommand((subcommand) => subcommand
        .setName('create')
        .setDescription('Create a new entry in the database')
        .addAttachmentOption((option) => option.setName('file').setDescription('JSON file to upload').setRequired(true))
        .addStringOption((option) => option
        .setName('source')
        .setDescription('The source table')
        .addChoices(choices)
        .setRequired(true)))
        .addSubcommand((subcommand) => subcommand
        .setName('read')
        .setDescription('Read entries from the database')
        .addStringOption((option) => option
        .setName('source')
        .setDescription('The source table')
        .addChoices(choices)
        .setRequired(true)))
        .addSubcommand((subcommand) => subcommand
        .setName('update')
        .setDescription('Update an existing entry in the database')
        .addStringOption((option) => option.setName('id').setDescription('Record ID').setRequired(true))
        .addAttachmentOption((option) => option.setName('file').setDescription('JSON file to upload').setRequired(true))
        .addStringOption((option) => option
        .setName('source')
        .setDescription('The source table')
        .addChoices(choices)
        .setRequired(true)))
        .addSubcommand((subcommand) => subcommand
        .setName('delete')
        .setDescription('Delete an entry from the database')
        .addStringOption((option) => option.setName('id').setDescription('Record ID').setRequired(true))
        .addStringOption((option) => option
        .setName('source')
        .setDescription('The source table')
        .addChoices(choices)
        .setRequired(true)))
        .addSubcommand((subcommand) => subcommand
        .setName('import')
        .setDescription('Import data into the database')
        .addStringOption((option) => option
        .setName('source')
        .setDescription('The source table')
        .addChoices(choices)
        .setRequired(true))
        .addAttachmentOption((option) => option.setName('file').setDescription('JSON data to import').setRequired(true)))
        .addSubcommand((subcommand) => subcommand
        .setName('export')
        .setDescription('Export data from the database')
        .addStringOption((option) => option
        .setName('source')
        .setDescription('The source table')
        .addChoices(choices)
        .setRequired(true))),
    async execute(interaction) {
        const subCommand = interaction.options.getSubcommand();
        const source = interaction.options.getString('source', true);
        let service = null;
        if (source === DatabaseTables.Users) {
            service = new userService_1.default(db_1.default);
        }
        else if (source === DatabaseTables.Collaborators) {
            service = new collaboratorService_1.default(db_1.default);
        }
        else if (source === DatabaseTables.Resources) {
            service = new resourceService_1.default(db_1.default);
        }
        else if (source === DatabaseTables.Settings) {
            service = new settingsService_1.default(db_1.default);
        }
        else if (source === DatabaseTables.Models) {
            service = new modelService_1.default(db_1.default);
        }
        else if (source === DatabaseTables.WeightsModel) {
            service = new modelService_1.WeightsModelService(db_1.default);
        }
        if (!service) {
            await interaction.reply({ content: 'Failed to select a database service', ephemeral: true });
            return;
        }
        await interaction.deferReply({ ephemeral: true });
        if (subCommand === 'create') {
            const attachment = interaction.options.getAttachment('file', true);
            try {
                const response = await axios_1.default.get(attachment.url);
                const jsonData = response.data;
                await handleDatabaseCreate(interaction, service, jsonData);
            }
            catch (error) {
                console.error('Error reading JSON file:', error);
                return interaction.reply('Failed to process JSON file.');
            }
        }
        else if (subCommand === 'read') {
            await handleDatabaseRead(interaction, service);
        }
        else if (subCommand === 'update') {
            const attachment = interaction.options.getAttachment('file', true);
            const id = interaction.options.getString('id', true);
            try {
                const response = await axios_1.default.get(attachment.url);
                const jsonData = response.data;
                await handleDatabaseUpdate(interaction, service, id, jsonData);
            }
            catch (error) {
                console.error('Error reading JSON file:', error);
                return interaction.reply('Failed to process JSON file.');
            }
        }
        else if (subCommand === 'delete') {
            const userId = interaction.options.getString('id', true);
            await handleDatabaseDelete(interaction, service, userId);
        }
        else if (subCommand === 'import') {
            const attachment = interaction.options.getAttachment('file', true);
            try {
                const response = await axios_1.default.get(attachment.url);
                const jsonData = response.data;
                await handleDatabaseImport(interaction, service, jsonData);
            }
            catch (error) {
                console.error('Error reading JSON file:', error);
                return interaction.reply('Failed to process JSON file.');
            }
        }
        else if (subCommand === 'export') {
            await handleDatabaseExport(interaction, service);
        }
    },
};
exports.default = Database;
async function handleDatabaseCreate(interaction, service, newData) {
    let fetchedData = await service.find(newData.id);
    if (fetchedData) {
        return await interaction.editReply({ content: `Record with ID ${newData.id} already exists` });
    }
    const savedId = await service.create(newData);
    fetchedData = await service.find(savedId);
    const embed = new discord_js_1.EmbedBuilder().setColor(discord_js_1.Colors.LightGrey).setTitle('Database - Create');
    embed.setDescription((0, discord_js_1.codeBlock)(JSON.stringify(fetchedData, null, 4)));
    await interaction.editReply({ embeds: [embed] });
}
async function handleDatabaseRead(interaction, service) {
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
    const embed = new discord_js_1.EmbedBuilder().setTitle('📋 Resources - Show').setColor(discord_js_1.Colors.Blurple);
    embed.setFields([
        {
            name: 'Items',
            value: (0, discord_js_1.codeBlock)('json', JSON.stringify(resources.data, null, 2)),
            inline: false,
        },
    ]);
    embed.setTimestamp();
    const prevButtonId = `btn_prev_${(0, generalUtilities_1.generateRandomId)(6)}`;
    const nextButtonId = `btn_next_${(0, generalUtilities_1.generateRandomId)(6)}`;
    const btnPrevious = new discord_js_1.ButtonBuilder()
        .setCustomId(prevButtonId)
        .setStyle(discord_js_1.ButtonStyle.Primary)
        .setLabel('Previous')
        .setDisabled(true);
    const btnNext = new discord_js_1.ButtonBuilder()
        .setCustomId(nextButtonId)
        .setStyle(discord_js_1.ButtonStyle.Primary)
        .setLabel('Next');
    const actionRow = new discord_js_1.ActionRowBuilder();
    actionRow.addComponents(btnPrevious, btnNext);
    embed.setFooter({ text: `Page ${offset + 1} of ?` });
    const message = await interaction.editReply({
        embeds: [embed],
        components: [actionRow],
    });
    const collector = message.createMessageComponentCollector({
        componentType: discord_js_1.ComponentType.Button,
        time: 2 * 60 * 1000, // expires after 5 minutes
    });
    collector.on('collect', async (buttonInteraction) => {
        // Check which button was pressed and update the embed accordingly
        if (buttonInteraction.customId === prevButtonId) {
            offset -= limit;
            resources = await service.findAll({
                offset,
                limit,
            });
            currentPage--;
        }
        else if (buttonInteraction.customId === nextButtonId) {
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
                value: (0, discord_js_1.codeBlock)('json', JSON.stringify(resources.data, null, 2)),
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
        const disabledRow = new discord_js_1.ActionRowBuilder().addComponents(btnPrevious.setDisabled(true), btnNext.setDisabled(true));
        // Update the message to show the disabled buttons
        await interaction.editReply({
            components: [disabledRow],
        });
    });
}
async function handleDatabaseUpdate(interaction, service, id, newData) {
    let fetchedData = await service.find(id);
    if (!fetchedData) {
        return await interaction.editReply({ content: `Record with ID ${id} not found` });
    }
    const affectedRows = await service.update(id, newData);
    if (affectedRows < 1) {
        return await interaction.editReply({ content: `Failed to update record with ID ${id}` });
    }
    fetchedData = await service.find(id);
    const embed = new discord_js_1.EmbedBuilder().setColor(discord_js_1.Colors.Orange).setTitle('Database - Update');
    embed.setDescription((0, discord_js_1.codeBlock)(JSON.stringify(fetchedData, null, 4)));
    await interaction.editReply({ embeds: [embed] });
}
async function handleDatabaseDelete(interaction, service, id) {
    const fetchedData = await service.find(id);
    if (!fetchedData) {
        return await interaction.editReply({ content: `Record with ID ${id} not found` });
    }
    const affectedRows = await service.delete(id);
    if (affectedRows < 1) {
        return await interaction.editReply({ content: `Failed to delete record with ID ${id}` });
    }
    const embed = new discord_js_1.EmbedBuilder().setColor(discord_js_1.Colors.Red).setTitle('Database - Delete');
    embed.setDescription(`Deleted record with ID ${id}`);
    await interaction.editReply({ embeds: [embed] });
}
async function handleDatabaseImport(interaction, service, newData) {
    await service.clearAll();
    for (const item of newData) {
        await service.create(item);
    }
    const fetchedData = await service.findAll();
    const embed = new discord_js_1.EmbedBuilder().setColor(discord_js_1.Colors.LightGrey).setTitle('Database - Import');
    const jsonOutput = (0, discord_js_1.codeBlock)(JSON.stringify(fetchedData.data, null, 4));
    if (jsonOutput.length > 4000) {
        embed.setDescription(`Imported ${fetchedData.data.length} items`);
    }
    else {
        embed.setDescription(jsonOutput);
    }
    await interaction.editReply({ embeds: [embed] });
}
async function handleDatabaseExport(interaction, service) {
    const allRecords = await service.findAll();
    const buffer = Buffer.from(JSON.stringify(allRecords.data), 'utf-8');
    const attachment = new discord_js_1.AttachmentBuilder(buffer, { name: 'exported.json' });
    await interaction.editReply({ files: [attachment] });
}
