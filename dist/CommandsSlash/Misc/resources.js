"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const resourcesService_1 = __importDefault(require("../../Services/resourcesService"));
const collaboratorService_1 = __importDefault(require("../../Services/collaboratorService"));
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
        .addChoices({ name: 'colab', value: 'colab' }, { name: 'huggingface', value: 'hf' }, { name: 'kaggle', value: 'kaggle' }, { name: 'lightning', value: 'lightning_ai' })
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
        .addChoices({ name: 'colab', value: 'colab' }, { name: 'huggingface', value: 'hf' }, { name: 'kaggle', value: 'kaggle' }, { name: 'lightning', value: 'lightning_ai' })
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
        .addChoices({ name: 'colab', value: 'colab' }, { name: 'huggingface', value: 'hf' }, { name: 'kaggle', value: 'kaggle' }, { name: 'lightning', value: 'lightning_ai' })
        .setRequired(true)))
        .addSubcommand(subcommand => subcommand
        .setName('refresh')
        .setDescription('Refresh bot data')
        .setDescriptionLocalizations({
        'pt-BR': 'Atualiza dados do bot'
    })),
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
            const category = interaction.options.getString('category', true);
            const url = interaction.options.getString('url', true);
            const title = interaction.options.getString('title') ?? '';
            const authors = interaction.options.getString('authors') ?? '';
            const emoji = interaction.options.getString('emoji') ?? '';
            const resourceId = await service.insert({
                category,
                url,
                authors,
                emoji,
                displayTitle: title,
            });
            const embed = new discord_js_1.EmbedBuilder();
            if (resourceId === -1) {
                embed.setTitle("Failed to add resource");
                embed.setColor(discord_js_1.Colors.Red);
            }
            else {
                embed.setTitle("Resource added!");
                embed.setDescription(`ID: **${resourceId}**, URL: ${url}`);
                embed.setColor(discord_js_1.Colors.DarkGreen);
            }
            await interaction.reply({ embeds: [embed] });
        }
        else if (interaction.options.getSubcommand() === 'delete') {
            const id = interaction.options.getInteger('id', true);
            const resource = await service.findById(id);
            const embed = new discord_js_1.EmbedBuilder();
            if (!resource) {
                embed.setTitle("Invalid resource");
                embed.setDescription(`Coudn't find resource with ID ${id}`);
                embed.setColor(discord_js_1.Colors.Red);
                await interaction.reply({ embeds: [embed] });
                return;
            }
            const deletedSuccessfully = await service.delete(id);
            if (deletedSuccessfully) {
                embed.setTitle("Resource deleted");
                embed.setDescription(`ID: ${id}, URL: ${resource.url}`);
                embed.setColor(discord_js_1.Colors.DarkGreen);
            }
            else {
                embed.setTitle("Failed to delete");
                embed.setDescription(`ID: ${id}, URL: ${resource.url}`);
                embed.setColor(discord_js_1.Colors.Red);
            }
            await interaction.reply({ embeds: [embed] });
        }
        else if (interaction.options.getSubcommand() === 'show') {
            const category = interaction.options.getString('category', true);
            const resources = await service.findByCategory(category);
            const embed = new discord_js_1.EmbedBuilder()
                .setTitle(`${category} resources`);
            if (resources.length === 0) {
                embed.setColor(discord_js_1.Colors.DarkRed);
                embed.setDescription('> No resource found');
            }
            else {
                embed.setColor(discord_js_1.Colors.DarkBlue);
                const embedDescription = [];
                resources.forEach((resource) => {
                    embedDescription.push(`- ID: **${resource.id}** | Category: **${resource.category}** | URL: **${resource.url}** | title: **${resource.displayTitle || 'None'}** | authors: **${resource.authors || 'None'}** | emoji: **${resource.emoji || 'None'}**`);
                });
                embed.setDescription(embedDescription.join('\n'));
            }
            await interaction.reply({ embeds: [embed] });
        }
        else if (interaction.options.getSubcommand() === 'update') {
            const id = interaction.options.getInteger('id', true);
            const resource = await service.findById(id);
            const embed = new discord_js_1.EmbedBuilder();
            if (!resource) {
                embed.setTitle("Invalid resource");
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
            const updatedSuccessfully = await service.update(id, updatedData);
            if (updatedSuccessfully) {
                embed.setTitle("Resource updated");
                embed.setDescription(`**ID**: \`${id}\`, **URL**: ${url}`);
                embed.setColor(discord_js_1.Colors.DarkAqua);
            }
            else {
                embed.setTitle("Failed to update");
                embed.setDescription(`**ID**: ${id}, **URL**: ${resource.url}`);
                embed.setColor(discord_js_1.Colors.Red);
            }
            await interaction.reply({ embeds: [embed] });
        }
        else if (interaction.options.getSubcommand() === 'refresh') {
            client.botCache.clear();
            await interaction.reply({
                embeds: [
                    new discord_js_1.EmbedBuilder()
                        .setTitle("🔃 Data refreshed")
                        .setColor(discord_js_1.Colors.DarkBlue)
                ]
            });
        }
    }
};
exports.default = Resources;
