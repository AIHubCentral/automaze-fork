"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const resourcesService_1 = __importDefault(require("../../Services/resourcesService"));
const Resources = {
    category: 'Utilities',
    cooldown: 15,
    data: new discord_js_1.SlashCommandBuilder()
        .setName('resources')
        .setDescription('Configure resources (links / docs)')
        .addSubcommand(subcommand => subcommand
        .setName('create')
        .setDescription('Creates the database'))
        .addSubcommand(subcommand => subcommand
        .setName('drop')
        .setDescription('Drops the database'))
        .addSubcommand(subcommand => subcommand
        .setName('insert')
        .setDescription('Create a new record in the database')
        .addStringOption(option => option
        .setName('category')
        .setDescription('Resource category')
        .setRequired(true))
        .addStringOption(option => option
        .setName('url')
        .setDescription('Resource URL')
        .setRequired(true))
        .addStringOption(option => option
        .setName('display_title')
        .setDescription('Friendly title for the URL')
        .setRequired(false))
        .addStringOption(option => option
        .setName('emoji')
        .setDescription('Emoji for the the URL title')
        .setRequired(false))
        .addStringOption(option => option
        .setName('authors')
        .setDescription('Resource authors')
        .setRequired(false)))
        .addSubcommand(subcommand => subcommand
        .setName('find_all')
        .setDescription('Returns all the resources'))
        .addSubcommand(subcommand => subcommand
        .setName('find_by_category')
        .setDescription('Gets a resource')
        .addStringOption(option => option.setName('category').setDescription('Resource category').setRequired(true)))
        .addSubcommand(subcommand => subcommand
        .setName('update')
        .setDescription('Update a record in the database')
        .addIntegerOption(option => option.setName('id').setDescription('Resource ID').setRequired(true))
        .addStringOption(option => option
        .setName('category')
        .setDescription('Resource category')
        .setRequired(false))
        .addStringOption(option => option
        .setName('url')
        .setDescription('Resource URL')
        .setRequired(false))
        .addStringOption(option => option
        .setName('display_title')
        .setDescription('Friendly title for the URL')
        .setRequired(false))
        .addStringOption(option => option
        .setName('emoji')
        .setDescription('Emoji for the the URL title')
        .setRequired(false))
        .addStringOption(option => option
        .setName('authors')
        .setDescription('Resource authors')
        .setRequired(false)))
        .addSubcommand(subcommand => subcommand
        .setName('delete')
        .setDescription('Delete a resource')
        .addIntegerOption(option => option.setName('id').setDescription('Resource ID').setRequired(true)))
        .addSubcommand(subcommand => subcommand
        .setName('clear')
        .setDescription('Deletes all the resources'))
        .addSubcommand(subcommand => subcommand
        .setName('import_data')
        .setDescription('Imports data from a JSON file to the database')
        .addAttachmentOption(option => option.setName('file')
        .setDescription('Upload a JSON file')
        .setRequired(true)))
        .addSubcommand(subcommand => subcommand
        .setName('export_data')
        .setDescription('Exports data from database to a JSON file')),
    async execute(interaction) {
        const client = interaction.client;
        const service = new resourcesService_1.default(client.logger);
        const id = interaction.options.getInteger('id') ?? 1; // defaults to 1
        if (interaction.options.getSubcommand() === 'create') {
            const databaseCreated = await service.createDatabase();
            if (databaseCreated) {
                await interaction.reply({ content: 'Database created.' });
            }
            else {
                await interaction.reply({ content: 'Failed to create database.' });
            }
        }
        else if (interaction.options.getSubcommand() === 'drop') {
            const databaseDropped = await service.dropDatabase();
            if (databaseDropped) {
                await interaction.reply({ content: 'Database dropped.' });
            }
            else {
                await interaction.reply({ content: 'Failed to drop database.' });
            }
        }
        else if (interaction.options.getSubcommand() === 'find_all') {
            const resources = await service.findAll();
            if (resources.length === 0) {
                await interaction.reply({ content: 'No resource was found.' });
            }
            else {
                await interaction.reply({ content: (0, discord_js_1.codeBlock)('javascript', JSON.stringify(resources, null, 4)) });
            }
        }
        else if (interaction.options.getSubcommand() === 'find_by_category') {
            const category = interaction.options.getString('category') ?? 'rvc';
            const resource = await service.findByCategory(category);
            if (!resource) {
                await interaction.reply({ content: 'No resource was found.' });
            }
            else {
                await interaction.reply({ content: (0, discord_js_1.codeBlock)('javascript', JSON.stringify(resource, null, 4)) });
            }
        }
        else if (interaction.options.getSubcommand() === 'delete') {
            await service.delete(id);
            await interaction.reply({ content: `Deleted resource with id ${id}` });
        }
        else if (interaction.options.getSubcommand() === 'clear') {
            await service.clear();
            await interaction.reply({ content: 'Done.' });
        }
        else if (interaction.options.getSubcommand() === 'insert') {
            const resourceCategory = interaction.options.getString('category') ?? '';
            const url = interaction.options.getString('url') ?? '';
            const displayTitle = interaction.options.getString('display_title') ?? '';
            const emoji = interaction.options.getString('emoji') ?? '';
            const authors = interaction.options.getString('authors') ?? '';
            const result = {
                category: resourceCategory,
                url,
                displayTitle,
                emoji,
                authors
            };
            const resourceId = await service.insert(result);
            if (resourceId == -1) {
                await interaction.reply({ content: 'Failed to insert data', ephemeral: true });
            }
            else {
                await interaction.reply({ content: `Inserted new resource with id ${resourceId}`, ephemeral: true });
            }
        }
        else if (interaction.options.getSubcommand() === 'update') {
            const resourceCategory = interaction.options.getString('category');
            const url = interaction.options.getString('url');
            const displayTitle = interaction.options.getString('display_title');
            const emoji = interaction.options.getString('emoji');
            const authors = interaction.options.getString('authors');
            const result = {
                ...(resourceCategory && { category: resourceCategory }),
                ...(url && { url }),
                ...(displayTitle && { displayTitle }),
                ...(emoji && { emoji }),
                ...(authors && { authors }),
            };
            const resourceUpdated = await service.update(id, result);
            if (!resourceUpdated) {
                await interaction.reply({ content: 'Failed to update data', ephemeral: true });
            }
            else {
                await interaction.reply({ content: `Updated resource with id ${id}`, ephemeral: true });
            }
        }
        else if (interaction.options.getSubcommand() === 'export_data') {
            const resources = await service.findAll();
            if (resources.length === 0) {
                await interaction.reply({ content: `No resource found`, ephemeral: true });
            }
            else {
                const jsonResult = JSON.stringify(resources, null, 4);
                const buffer = Buffer.from(jsonResult, 'utf-8');
                const attachment = new discord_js_1.AttachmentBuilder(buffer, { name: 'resources.json' });
                await interaction.reply({ files: [attachment], ephemeral: true });
            }
        }
        else if (interaction.options.getSubcommand() === 'import_data') {
            const file = interaction.options.getAttachment('file');
            if (!file?.name.endsWith('.json')) {
                await interaction.reply({ content: 'Not a valid JSON file', ephemeral: true });
                return;
            }
            const response = await fetch(file.url);
            const jsonResult = await response.json();
            const insertedValues = await service.importData(jsonResult);
            const replyMessage = insertedValues ? `Data imported` : 'No data provided';
            await interaction.reply({ content: replyMessage, ephemeral: true });
        }
    }
};
exports.default = Resources;
