import { codeBlock, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../../Interfaces/Command";
import ExtendedClient from "../../Core/extendedClient";
import ResourceService from "../../Services/resourcesService";

const Resources: SlashCommand = {
    category: 'Utilities',
    cooldown: 15,
    data: new SlashCommandBuilder()
        .setName('resources')
        .setDescription('Configure resources (links / docs)')
        .addSubcommand(subcommand =>
            subcommand
                .setName('create')
                .setDescription('Creates the database')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('drop')
                .setDescription('Drops the database')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('find_all')
                .setDescription('Returns all the resources')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('find_by_category')
                .setDescription('Gets a resource')
                .addStringOption(option =>
                    option.setName('category').setDescription('Resource category').setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('delete')
                .setDescription('Delete a resource')
                .addIntegerOption(option =>
                    option.setName('id').setDescription('Resource ID').setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('clear')
                .setDescription('Deletes all the resources')
        ),
    async execute(interaction) {
        const client = interaction.client as ExtendedClient;
        const service = new ResourceService(client.logger);
        const id = interaction.options.getInteger('id') ?? 1;  // defaults to 1

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
                await interaction.reply({ content: codeBlock('javascript', JSON.stringify(resources, null, 4)) });
            }
        }
        else if (interaction.options.getSubcommand() === 'find_by_category') {
            const category = interaction.options.getString('category') ?? 'rvc';
            const resource = await service.findByCategory(category);
            if (!resource) {
                await interaction.reply({ content: 'No resource was found.' });
            }
            else {
                await interaction.reply({ content: codeBlock('javascript', JSON.stringify(resource, null, 4)) });
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
    }
}

export default Resources;