import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    Colors,
    EmbedBuilder,
    SlashCommandBuilder,
} from 'discord.js';
import { SlashCommand } from '../../Interfaces/Command';
import ExtendedClient from '../../Core/extendedClient';
import ResourceService, { IResource } from '../../Services/resourcesService';
import CollaboratorService from '../../Services/collaboratorService';
import { createPaginatedEmbed, getPaginatedData } from '../../Utils/botUtilities';

const Resources: SlashCommand = {
    category: 'Misc',
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('resources')
        .setNameLocalizations({
            'pt-BR': 'recursos',
        })
        .setDescription('Configure resources (links / docs)')
        .setDescriptionLocalizations({
            'pt-BR': 'Configure recursos (links / documentação)',
        })
        .addSubcommand((subcommand) =>
            subcommand
                .setName('add')
                .setNameLocalizations({
                    'pt-BR': 'adicionar',
                })
                .setDescription('Adds a resource')
                .setDescriptionLocalizations({
                    'pt-BR': 'Adicione um recurso',
                })
                .addStringOption((option) =>
                    option
                        .setName('category')
                        .setNameLocalizations({
                            'pt-BR': 'categoria',
                        })
                        .setDescription('Resource category')
                        .setDescriptionLocalizations({
                            'pt-BR': 'Categoria do recurso',
                        })
                        .addChoices(
                            { name: 'audio', value: 'audio' },
                            { name: 'colab', value: 'colab' },
                            { name: 'huggingface', value: 'hf' },
                            { name: 'kaggle', value: 'kaggle' },
                            { name: 'lightning', value: 'lightning_ai' }
                        )
                        .setRequired(true)
                )
                .addStringOption((option) =>
                    option
                        .setName('url')
                        .setDescription('URL for the resource')
                        .setDescriptionLocalizations({
                            'pt-BR': 'URL do recurso',
                        })
                        .setRequired(true)
                )
                .addStringOption((option) =>
                    option
                        .setName('title')
                        .setNameLocalizations({
                            'pt-BR': 'titulo',
                        })
                        .setDescription('Title to mask the URL')
                        .setDescriptionLocalizations({
                            'pt-BR': 'Título para esconder a URL',
                        })
                        .setRequired(false)
                )
                .addStringOption((option) =>
                    option
                        .setName('authors')
                        .setNameLocalizations({
                            'pt-BR': 'autores',
                        })
                        .setDescription('(Optional) Authors who made the content')
                        .setDescriptionLocalizations({
                            'pt-BR': '(Opcional) Autores que criaram o conteúdo',
                        })
                        .setRequired(false)
                )
                .addStringOption((option) =>
                    option
                        .setName('emoji')
                        .setDescription('(Optional) Emoji to display before the link')
                        .setDescriptionLocalizations({
                            'pt-BR': '(Opcional) Emoji para mostrar antes do link',
                        })
                        .setRequired(false)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('update')
                .setNameLocalizations({
                    'pt-BR': 'atualiza',
                })
                .setDescription('Updates a resource')
                .setDescriptionLocalizations({
                    'pt-BR': 'Atualiza um recurso',
                })
                .addIntegerOption((option) =>
                    option
                        .setName('id')
                        .setDescription('ID of the resource')
                        .setDescriptionLocalizations({
                            'pt-BR': 'ID do recurso',
                        })
                        .setRequired(true)
                )
                .addStringOption((option) =>
                    option
                        .setName('category')
                        .setNameLocalizations({
                            'pt-BR': 'categoria',
                        })
                        .setDescription('Resource category')
                        .setDescriptionLocalizations({
                            'pt-BR': 'Categoria do recurso',
                        })
                        .addChoices(
                            { name: 'audio', value: 'audio' },
                            { name: 'colab', value: 'colab' },
                            { name: 'huggingface', value: 'hf' },
                            { name: 'kaggle', value: 'kaggle' },
                            { name: 'lightning', value: 'lightning_ai' }
                        )
                        .setRequired(true)
                )
                .addStringOption((option) =>
                    option
                        .setName('url')
                        .setDescription('URL for the resource')
                        .setDescriptionLocalizations({
                            'pt-BR': 'URL do recurso',
                        })
                        .setRequired(true)
                )
                .addStringOption((option) =>
                    option
                        .setName('title')
                        .setNameLocalizations({
                            'pt-BR': 'título',
                        })
                        .setDescription('Title to mask the URL')
                        .setDescriptionLocalizations({
                            'pt-BR': 'Título para esconder a URL',
                        })
                        .setRequired(false)
                )
                .addStringOption((option) =>
                    option
                        .setName('authors')
                        .setNameLocalizations({
                            'pt-BR': 'autores',
                        })
                        .setDescription('(Optional) Authors who made the content')
                        .setDescriptionLocalizations({
                            'pt-BR': '(Opcional) Autores que criaram o conteúdo',
                        })
                        .setRequired(false)
                )
                .addStringOption((option) =>
                    option
                        .setName('emoji')
                        .setDescription('(Optional) Emoji to display before the link')
                        .setDescriptionLocalizations({
                            'pt-BR': '(Opcional) Emoji para mostrar antes do link',
                        })
                        .setRequired(false)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('delete')
                .setNameLocalizations({
                    'pt-BR': 'deletar',
                })
                .setDescription('Deletes a database')
                .setDescriptionLocalizations({
                    'pt-BR': 'Deleta um recurso',
                })
                .addIntegerOption((option) =>
                    option
                        .setName('id')
                        .setDescription('Resource ID')
                        .setDescriptionLocalizations({
                            'pt-BR': 'ID do recurso',
                        })
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('show')
                .setNameLocalizations({
                    'pt-BR': 'mostrar',
                })
                .setDescription('Show resources')
                .setDescriptionLocalizations({
                    'pt-BR': 'Mostra os recursos',
                })
                .addStringOption((option) =>
                    option
                        .setName('category')
                        .setNameLocalizations({
                            'pt-BR': 'categoria',
                        })
                        .setDescription('Resource category')
                        .setDescriptionLocalizations({
                            'pt-BR': 'Categoria do recurso',
                        })
                        .addChoices(
                            { name: 'audio', value: 'audio' },
                            { name: 'colab', value: 'colab' },
                            { name: 'huggingface', value: 'hf' },
                            { name: 'kaggle', value: 'kaggle' },
                            { name: 'lightning', value: 'lightning_ai' }
                        )
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand.setName('refresh').setDescription('Refresh bot data').setDescriptionLocalizations({
                'pt-BR': 'Atualiza dados do bot',
            })
        ),
    async execute(interaction) {
        const client = interaction.client as ExtendedClient;
        const service = new ResourceService(client.logger);

        const logData = {
            guildId: interaction.guildId,
            channelId: interaction.channelId,
            userId: interaction.user.id,
            userName: interaction.user.username,
        };

        client.logger.debug('/resources', logData);

        const collaboratorsService = new CollaboratorService(client.logger);
        const collaboratorUser = await collaboratorsService.findById(interaction.user.id);

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

            const resourceId = await service.insert({
                category,
                url,
                authors,
                emoji,
                displayTitle: title,
            });

            const embed = new EmbedBuilder();

            if (resourceId === -1) {
                embed.setTitle('Failed to add resource');
                embed.setColor(Colors.Red);
            } else {
                embed.setTitle('Resource added!');
                embed.setDescription(`ID: **${resourceId}**, URL: ${url}`);
                embed.setColor(Colors.DarkGreen);
            }

            await interaction.reply({ embeds: [embed] });
        } else if (interaction.options.getSubcommand() === 'delete') {
            const id = interaction.options.getInteger('id', true);

            const resource = await service.findById(id);

            const embed = new EmbedBuilder();

            if (!resource) {
                embed.setTitle('Invalid resource');
                embed.setDescription(`Coudn't find resource with ID ${id}`);
                embed.setColor(Colors.Red);
                await interaction.reply({ embeds: [embed] });
                return;
            }

            const deletedSuccessfully: boolean = await service.delete(id);

            if (deletedSuccessfully) {
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
            const pageNumber = 1;

            const { data, totalPages } = await getPaginatedData(pageNumber, service, {
                column: 'category',
                value: category,
            });

            if (!data || data.length === 0) {
                await interaction.reply({ content: 'No resource was found.' });
                return;
            }

            const embed = createPaginatedEmbed(data, pageNumber, totalPages);

            const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder()
                    .setCustomId(`prev_0`)
                    .setLabel('Previous')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(true),
                new ButtonBuilder()
                    .setCustomId(`next_2`)
                    .setLabel('Next')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(pageNumber === totalPages)
            );

            const sentMessage = await interaction.reply({
                embeds: [embed],
                components: [row],
                fetchReply: true,
            });

            // show for 5 minutes (300k ms)
            const collector = sentMessage.createMessageComponentCollector({ time: 300_000 });

            collector.on('collect', async (i) => {
                if (!i.isButton()) return;

                const currentPage = parseInt(i.customId.split('_')[1]);
                const { data, totalPages } = await getPaginatedData(currentPage, service, {
                    column: 'category',
                    value: category,
                });

                const embed = createPaginatedEmbed(data, currentPage, totalPages);

                const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
                    new ButtonBuilder()
                        .setCustomId(`prev_${currentPage - 1}`)
                        .setLabel('Previous')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(currentPage === 1),
                    new ButtonBuilder()
                        .setCustomId(`next_${currentPage + 1}`)
                        .setLabel('Next')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(currentPage === totalPages)
                );

                await i.update({ embeds: [embed], components: [row] });
            });

            collector.on('end', async () => {
                const disabledRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
                    new ButtonBuilder()
                        .setCustomId('prev_0')
                        .setLabel('Previous')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(true),
                    new ButtonBuilder()
                        .setCustomId('next_2')
                        .setLabel('Next')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(true)
                );

                await sentMessage.edit({ components: [disabledRow] });
            });

            // `- ID: **${resource.id}** | Category: **${resource.category}** | URL: **${resource.url}** | title: **${resource.displayTitle || 'None'}** | authors: **${resource.authors || 'None'}** | emoji: **${resource.emoji || 'None'}**`
        } else if (interaction.options.getSubcommand() === 'update') {
            const id = interaction.options.getInteger('id', true);

            const resource = await service.findById(id);

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

            const updatedSuccessfully: boolean = await service.update(id, updatedData);

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
