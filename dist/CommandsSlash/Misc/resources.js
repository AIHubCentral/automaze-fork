"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const resourceService_1 = __importDefault(require("../../Services/resourceService"));
const collaboratorService_1 = __importDefault(require("../../Services/collaboratorService"));
const slashCommandData_json_1 = __importDefault(require("../../../JSON/slashCommandData.json"));
const discordUtilities_1 = require("../../Utils/discordUtilities");
const db_1 = __importDefault(require("../../db"));
const commandData = slashCommandData_json_1.default.resources;
const Resources = {
    category: 'Misc',
    cooldown: 5,
    data: createSlashCommandData(),
    async execute(interaction) {
        const client = interaction.client;
        const service = new resourceService_1.default(db_1.default);
        const logData = {
            guildId: interaction.guildId,
            channelId: interaction.channelId,
            userId: interaction.user.id,
            userName: interaction.user.username,
        };
        client.logger.debug('/resources', logData);
        const collaboratorsService = new collaboratorService_1.default(db_1.default);
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
            const embed = new discord_js_1.EmbedBuilder();
            embed.setTitle('Resource added!');
            embed.setDescription(`ID: **${resourceId}**, URL: ${url}`);
            embed.setColor(discord_js_1.Colors.DarkGreen);
            await interaction.reply({ embeds: [embed] });
        }
        else if (interaction.options.getSubcommand() === 'delete') {
            const id = interaction.options.getInteger('id', true);
            const resource = await service.find(id);
            const embed = new discord_js_1.EmbedBuilder();
            if (!resource) {
                embed.setTitle('Invalid resource');
                embed.setDescription(`Coudn't find resource with ID ${id}`);
                embed.setColor(discord_js_1.Colors.Red);
                await interaction.reply({ embeds: [embed] });
                return;
            }
            const affectedRows = await service.delete(id);
            if (affectedRows === 1) {
                embed.setTitle('Resource deleted');
                embed.setDescription(`ID: ${id}, URL: ${resource.url}`);
                embed.setColor(discord_js_1.Colors.DarkGreen);
            }
            else {
                embed.setTitle('Failed to delete');
                embed.setDescription(`ID: ${id}, URL: ${resource.url}`);
                embed.setColor(discord_js_1.Colors.Red);
            }
            await interaction.reply({ embeds: [embed] });
        }
        else if (interaction.options.getSubcommand() === 'show') {
            const category = interaction.options.getString('category', true);
            const allResources = await service.findAll({
                filter: { column: 'category', value: category },
            });
            const totalResources = allResources.data.length;
            if (totalResources === 0) {
                await interaction.reply({ content: 'No resource was found.' });
                return;
            }
            const embed = new discord_js_1.EmbedBuilder().setTitle('📋 Resources - Show').setColor(discord_js_1.Colors.Blurple);
            embed.setDescription((0, discord_js_1.codeBlock)(JSON.stringify(allResources.data, null, 4)));
            await interaction.reply({ embeds: [embed] });
            // `- ID: **${resource.id}** | Category: **${resource.category}** | URL: **${resource.url}** | title: **${resource.displayTitle || 'None'}** | authors: **${resource.authors || 'None'}** | emoji: **${resource.emoji || 'None'}**`
        }
        else if (interaction.options.getSubcommand() === 'update') {
            const id = interaction.options.getInteger('id', true);
            const resource = await service.find(id);
            const embed = new discord_js_1.EmbedBuilder();
            if (!resource) {
                embed.setTitle('Invalid resource');
                embed.setDescription(`Coudn't find resource with ID ${id}`);
                embed.setColor(discord_js_1.Colors.Red);
                await interaction.reply({ embeds: [embed] });
                return;
            }
            const category = interaction.options.getString('category', true);
            const url = interaction.options.getString('url', true);
            const title = interaction.options.getString('title') ?? '';
            const authors = interaction.options.getString('authors') ?? '';
            const emoji = interaction.options.getString('emoji') ?? '';
            const updatedData = {
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
                embed.setColor(discord_js_1.Colors.DarkAqua);
            }
            else {
                embed.setTitle('Failed to update');
                embed.setDescription(`**ID**: ${id}, **URL**: ${resource.url}`);
                embed.setColor(discord_js_1.Colors.Red);
            }
            await interaction.reply({ embeds: [embed] });
        }
        else if (interaction.options.getSubcommand() === 'refresh') {
            client.botCache.clear();
            await interaction.reply({
                embeds: [new discord_js_1.EmbedBuilder().setTitle('🔃 Data refreshed').setColor(discord_js_1.Colors.DarkBlue)],
            });
        }
    },
};
exports.default = Resources;
// helper functions
function createSlashCommandData() {
    return new discord_js_1.SlashCommandBuilder()
        .setName(commandData.name)
        .setNameLocalizations(commandData.nameLocalizations)
        .setDescription(commandData.description)
        .setDescriptionLocalizations(commandData.descriptionLocalizations)
        .addSubcommand((subcommand) => subcommand
        .setName(commandData.subcommands.add.name)
        .setNameLocalizations(commandData.subcommands.add.nameLocalizations)
        .setDescription(commandData.subcommands.add.description)
        .setDescriptionLocalizations(commandData.subcommands.add.descriptionLocalizations)
        .addStringOption((0, discordUtilities_1.createStringOption)(commandData.commonOptions.category))
        .addStringOption((0, discordUtilities_1.createStringOption)(commandData.commonOptions.url))
        .addStringOption((0, discordUtilities_1.createStringOption)(commandData.commonOptions.title))
        .addStringOption((0, discordUtilities_1.createStringOption)(commandData.commonOptions.authors))
        .addStringOption((0, discordUtilities_1.createStringOption)(commandData.commonOptions.emoji)))
        .addSubcommand((subcommand) => subcommand
        .setName(commandData.subcommands.update.name)
        .setNameLocalizations(commandData.subcommands.update.nameLocalizations)
        .setDescription(commandData.subcommands.update.description)
        .setDescriptionLocalizations(commandData.subcommands.update.descriptionLocalizations)
        .addIntegerOption((option) => option
        .setName(commandData.commonOptions.id.name)
        .setDescription(commandData.commonOptions.id.description)
        .setDescriptionLocalizations(commandData.commonOptions.id.descriptionLocalizations)
        .setRequired(true))
        .addStringOption((0, discordUtilities_1.createStringOption)(commandData.commonOptions.category))
        .addStringOption((0, discordUtilities_1.createStringOption)(commandData.commonOptions.url))
        .addStringOption((0, discordUtilities_1.createStringOption)(commandData.commonOptions.title))
        .addStringOption((0, discordUtilities_1.createStringOption)(commandData.commonOptions.authors))
        .addStringOption((0, discordUtilities_1.createStringOption)(commandData.commonOptions.emoji)))
        .addSubcommand((subcommand) => subcommand
        .setName(commandData.subcommands.delete.name)
        .setNameLocalizations(commandData.subcommands.delete.nameLocalizations)
        .setDescription(commandData.subcommands.delete.description)
        .setDescriptionLocalizations(commandData.subcommands.delete.descriptionLocalizations)
        .addIntegerOption((option) => option
        .setName(commandData.commonOptions.id.name)
        .setDescription(commandData.commonOptions.id.description)
        .setDescriptionLocalizations(commandData.commonOptions.id.descriptionLocalizations)
        .setRequired(true)))
        .addSubcommand((subcommand) => subcommand
        .setName(commandData.subcommands.show.name)
        .setNameLocalizations(commandData.subcommands.show.nameLocalizations)
        .setDescription(commandData.subcommands.show.description)
        .setDescriptionLocalizations(commandData.subcommands.show.descriptionLocalizations)
        .addStringOption((0, discordUtilities_1.createStringOption)(commandData.commonOptions.category)))
        .addSubcommand((subcommand) => subcommand
        .setName(commandData.subcommands.refresh.name)
        .setDescription(commandData.subcommands.refresh.description)
        .setDescriptionLocalizations(commandData.subcommands.refresh.descriptionLocalizations));
}
