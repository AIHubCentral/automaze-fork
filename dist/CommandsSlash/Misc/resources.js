"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const resourcesService_1 = __importDefault(require("../../Services/resourcesService"));
const collaboratorService_1 = __importDefault(require("../../Services/collaboratorService"));
const botUtilities_1 = require("../../Utils/botUtilities");
const Resources = {
    category: 'Misc',
    cooldown: 5,
    data: new discord_js_1.SlashCommandBuilder()
        .setName('resources')
        .setNameLocalizations({
        'pt-BR': 'recursos',
    })
        .setDescription('Configure resources (links / docs)')
        .setDescriptionLocalizations({
        'pt-BR': 'Configure recursos (links / documentação)'
    })
        .addSubcommand(subcommand => subcommand
        .setName('add')
        .setNameLocalizations({
        'pt-BR': 'adicionar'
    })
        .setDescription('Adds a resource')
        .setDescriptionLocalizations({
        'pt-BR': 'Adicione um recurso'
    })
        .addStringOption(option => option
        .setName('category')
        .setNameLocalizations({
        'pt-BR': 'categoria'
    })
        .setDescription('Resource category')
        .setDescriptionLocalizations({
        'pt-BR': 'Categoria do recurso'
    })
        .addChoices({ name: 'Colab', value: 'colab' }, { name: 'Kaggle', value: 'kaggle' })
        .setRequired(true))
        .addStringOption(option => option
        .setName('url')
        .setDescription('URL for the resource')
        .setDescriptionLocalizations({
        'pt-BR': 'URL do recurso'
    })
        .setRequired(true))
        .addStringOption(option => option
        .setName('title')
        .setNameLocalizations({
        'pt-BR': 'titulo'
    })
        .setDescription('Title to mask the URL')
        .setDescriptionLocalizations({
        'pt-BR': 'Título para esconder a URL'
    })
        .setRequired(false))
        .addStringOption(option => option
        .setName('authors')
        .setNameLocalizations({
        'pt-BR': 'autores'
    })
        .setDescription('(Optional) Authors who made the content')
        .setDescriptionLocalizations({
        'pt-BR': '(Opcional) Autores que criaram o conteúdo'
    })
        .setRequired(false))
        .addStringOption(option => option
        .setName('emoji')
        .setDescription('(Optional) Emoji to display before the link')
        .setDescriptionLocalizations({
        'pt-BR': '(Opcional) Emoji para mostrar antes do link'
    })
        .setRequired(false)))
        .addSubcommand(subcommand => subcommand
        .setName('update')
        .setNameLocalizations({
        'pt-BR': 'atualiza'
    })
        .setDescription('Updates a resource')
        .setDescriptionLocalizations({
        'pt-BR': 'Atualiza um recurso'
    })
        .addIntegerOption(option => option
        .setName('id')
        .setDescription('ID of the resource')
        .setDescriptionLocalizations({
        'pt-BR': 'ID do recurso'
    })
        .setRequired(true))
        .addStringOption(option => option
        .setName('category')
        .setNameLocalizations({
        'pt-BR': 'categoria'
    })
        .setDescription('Resource category')
        .setDescriptionLocalizations({
        'pt-BR': 'Categoria do recurso'
    })
        .addChoices({ name: 'Colab', value: 'colab' }, { name: 'Kaggle', value: 'kaggle' })
        .setRequired(true))
        .addStringOption(option => option
        .setName('url')
        .setDescription('URL for the resource')
        .setDescriptionLocalizations({
        'pt-BR': 'URL do recurso'
    })
        .setRequired(true))
        .addStringOption(option => option
        .setName('title')
        .setNameLocalizations({
        'pt-BR': 'título'
    })
        .setDescription('Title to mask the URL')
        .setDescriptionLocalizations({
        'pt-BR': 'Título para esconder a URL'
    })
        .setRequired(false))
        .addStringOption(option => option
        .setName('authors')
        .setNameLocalizations({
        'pt-BR': 'autores'
    })
        .setDescription('(Optional) Authors who made the content')
        .setDescriptionLocalizations({
        'pt-BR': '(Opcional) Autores que criaram o conteúdo'
    })
        .setRequired(false))
        .addStringOption(option => option
        .setName('emoji')
        .setDescription('(Optional) Emoji to display before the link')
        .setDescriptionLocalizations({
        'pt-BR': '(Opcional) Emoji para mostrar antes do link'
    })
        .setRequired(false)))
        .addSubcommand(subcommand => subcommand
        .setName('delete')
        .setNameLocalizations({
        'pt-BR': 'deletar'
    })
        .setDescription('Deletes a database')
        .setDescriptionLocalizations({
        'pt-BR': 'Deleta um recurso'
    })
        .addIntegerOption(option => option
        .setName('id')
        .setDescription('Resource ID')
        .setDescriptionLocalizations({
        'pt-BR': 'ID do recurso'
    })
        .setRequired(true)))
        .addSubcommand(subcommand => subcommand
        .setName('show')
        .setNameLocalizations({
        'pt-BR': 'mostrar'
    })
        .setDescription('Show resources')
        .setDescriptionLocalizations({
        'pt-BR': 'Mostra os recursos'
    })
        .addStringOption(option => option
        .setName('category')
        .setNameLocalizations({
        'pt-BR': 'categoria'
    })
        .setDescription('Resource category')
        .setDescriptionLocalizations({
        'pt-BR': 'Categoria do recurso'
    })
        .addChoices({ name: 'Colab', value: 'colab' }, { name: 'Kaggle', value: 'kaggle' })
        .setRequired(true))),
    async execute(interaction) {
        const client = interaction.client;
        const service = new resourcesService_1.default(client.logger);
        const logData = {
            guildId: interaction.guildId,
            channelId: interaction.channelId,
            userId: interaction.user.id,
            userName: interaction.user.username,
        };
        client.logger.debug('/resources', logData);
        const collaboratorsService = new collaboratorService_1.default(client.logger);
        const collaboratorUser = await collaboratorsService.findById(interaction.user.id);
        if (!collaboratorUser) {
            await interaction.reply({ content: 'Ask **RayTracer** if you want to use this command!', ephemeral: true });
            return;
        }
        if (interaction.options.getSubcommand() === 'add') {
            const category = '';
            const url = '';
            const title = '';
            const authors = '';
            const emoji = '';
            const databaseCreated = await service.createDatabase();
            if (databaseCreated) {
                await interaction.reply({ content: 'Database created.' });
            }
            else {
                await interaction.reply({ content: 'Failed to create database.' });
            }
        }
        else if (interaction.options.getSubcommand() === 'delete') {
            const embed = new discord_js_1.EmbedBuilder();
            const databaseDropped = await service.dropDatabase();
            if (databaseDropped) {
                await interaction.reply({ content: 'Database dropped.' });
            }
            else {
                await interaction.reply({ content: 'Failed to drop database.' });
            }
        }
        else if (interaction.options.getSubcommand() === 'show') {
            const category = interaction.options.getString('category', true);
            const resources = await service.findAll();
            const embed = new discord_js_1.EmbedBuilder()
                .setTitle(`${category} resources`);
            if (resources.length === 0) {
                embed.setColor(discord_js_1.Colors.DarkRed);
                embed.setDescription('> No resource found');
            }
            else {
                embed.setColor(discord_js_1.Colors.DarkBlue);
                embed.setDescription((0, botUtilities_1.resourcesToUnorderedList)(resources));
            }
            await interaction.reply({ embeds: [embed] });
        }
        /* else if (interaction.options.getSubcommand() === 'find_by_category') {
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

            const result: Partial<IResource> = {
                ...(resourceCategory && { category: resourceCategory }),
                ...(url && { url }),
                ...(displayTitle && { displayTitle }),
                ...(emoji && { emoji }),
                ...(authors && { authors }),
            };

            const resourceUpdated: boolean = await service.update(id, result);

            if (!resourceUpdated) {
                await interaction.reply({ content: 'Failed to update data', ephemeral: true });
            }
            else {
                await interaction.reply({ content: `Updated resource with id ${id}`, ephemeral: true });
            }
        }
        else if (interaction.options.getSubcommand() === 'export_data') {
            const resources: IResource[] = await service.findAll();

            if (resources.length === 0) {
                await interaction.reply({ content: `No resource found`, ephemeral: true });
            }
            else {
                const jsonResult = JSON.stringify(resources, null, 4);
                const buffer = Buffer.from(jsonResult, 'utf-8');
                const attachment = new AttachmentBuilder(buffer, { name: 'resources.json' });
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
            const jsonResult = await response.json() as IResource[];

            const insertedValues: boolean = await service.importData(jsonResult);
            const replyMessage = insertedValues ? `Data imported` : 'No data provided';
            await interaction.reply({ content: replyMessage, ephemeral: true });
        } */
    }
};
exports.default = Resources;
async function getPaginatedData(page, resourceService) {
    const perPage = 10;
    const offset = (page - 1) * perPage;
    const { data, counter } = await resourceService.getPaginatedResult(offset, perPage);
    const totalPages = Math.ceil(counter.count / perPage);
    return { data, totalPages };
}
function createPaginatedEmbed(data, currentPage, totalPages) {
    return new discord_js_1.EmbedBuilder()
        .setTitle(`All Resources`)
        .setColor(discord_js_1.Colors.Greyple)
        .setDescription(data.map((record) => {
        const result = [
            '- ', record.id, `. **URL**: ${record.url}`, ` | **Category**: ${record.category}`
        ];
        if (record.displayTitle) {
            result.push(` | **Title**: ${record.displayTitle}`);
        }
        if (record.authors) {
            result.push(` | **Authors**: ${record.authors}`);
        }
        return result.join('');
    }).join('\n'))
        .setFooter({ text: `Page ${currentPage} of ${totalPages}` });
}
