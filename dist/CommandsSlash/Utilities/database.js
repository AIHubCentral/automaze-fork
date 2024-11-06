"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const db_1 = __importDefault(require("../../db"));
const userService_1 = __importDefault(require("../../Services/userService"));
const axios_1 = __importDefault(require("axios"));
const collaboratorService_1 = __importDefault(require("../../Services/collaboratorService"));
var DatabaseTables;
(function (DatabaseTables) {
    DatabaseTables["Collaborators"] = "collaborators";
    DatabaseTables["Resources"] = "resources";
    DatabaseTables["Settings"] = "settings";
    DatabaseTables["Users"] = "users";
})(DatabaseTables || (DatabaseTables = {}));
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
        .addChoices({ name: 'Users', value: DatabaseTables.Users }, { name: 'Collaborators', value: DatabaseTables.Collaborators }, { name: 'Resources', value: DatabaseTables.Resources }, { name: 'Settings', value: DatabaseTables.Settings })
        .setRequired(true)))
        .addSubcommand((subcommand) => subcommand
        .setName('read')
        .setDescription('Read entries from the database')
        .addStringOption((option) => option
        .setName('source')
        .setDescription('The source table')
        .addChoices({ name: 'Users', value: DatabaseTables.Users }, { name: 'Collaborators', value: DatabaseTables.Collaborators }, { name: 'Resources', value: DatabaseTables.Resources }, { name: 'Settings', value: DatabaseTables.Settings })
        .setRequired(true)))
        .addSubcommand((subcommand) => subcommand
        .setName('update')
        .setDescription('Update an existing entry in the database')
        .addStringOption((option) => option.setName('id').setDescription('Record ID').setRequired(true))
        .addAttachmentOption((option) => option.setName('file').setDescription('JSON file to upload').setRequired(true))
        .addStringOption((option) => option
        .setName('source')
        .setDescription('The source table')
        .addChoices({ name: 'Users', value: DatabaseTables.Users }, { name: 'Collaborators', value: DatabaseTables.Collaborators }, { name: 'Resources', value: DatabaseTables.Resources }, { name: 'Settings', value: DatabaseTables.Settings })
        .setRequired(true)))
        .addSubcommand((subcommand) => subcommand
        .setName('delete')
        .setDescription('Delete an entry from the database')
        .addStringOption((option) => option.setName('id').setDescription('Record ID').setRequired(true))
        .addStringOption((option) => option
        .setName('source')
        .setDescription('The source table')
        .addChoices({ name: 'Users', value: DatabaseTables.Users }, { name: 'Collaborators', value: DatabaseTables.Collaborators }, { name: 'Resources', value: DatabaseTables.Resources }, { name: 'Settings', value: DatabaseTables.Settings })
        .setRequired(true)))
        .addSubcommand((subcommand) => subcommand
        .setName('import')
        .setDescription('Import data into the database')
        .addStringOption((option) => option
        .setName('source')
        .setDescription('The source table')
        .addChoices({ name: 'Users', value: DatabaseTables.Users }, { name: 'Collaborators', value: DatabaseTables.Collaborators }, { name: 'Resources', value: DatabaseTables.Resources }, { name: 'Settings', value: DatabaseTables.Settings })
        .setRequired(true))
        .addAttachmentOption((option) => option.setName('file').setDescription('JSON data to import').setRequired(true)))
        .addSubcommand((subcommand) => subcommand
        .setName('export')
        .setDescription('Export data from the database')
        .addStringOption((option) => option
        .setName('source')
        .setDescription('The source table')
        .addChoices({ name: 'Users', value: DatabaseTables.Users }, { name: 'Collaborators', value: DatabaseTables.Collaborators }, { name: 'Resources', value: DatabaseTables.Resources }, { name: 'Settings', value: DatabaseTables.Settings })
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
        //if (source === DatabaseTables.Users) {
        //const userService = new UserService(knexInstance);
        /* await interaction.deferReply({ ephemeral: true });
            await delay(1000);
    
            const subcommandGroup = interaction.options.getSubcommandGroup();
            const subcommand = interaction.options.getSubcommand();
            const { client } = interaction;
    
            if (subcommandGroup === 'manage') {
                if (subcommand === 'import') {
                    const file = interaction.options.getAttachment('file');
    
                    if (file.contentType.includes('application/json')) {
                        try {
                            const response = await fetch(file.url);
    
                            if (response.ok) {
                                const data = await response.json();
    
                                client.logger.info('Inserting records into database...');
    
                                for (const record of data) {
                                    const dataToInsert = {
                                        id: record.user_id,
                                        username: record.userName,
                                        bananas: record.bananaCount,
                                    };
                                    client.logger.debug(dataToInsert);
                                    await client.knexInstance('user').insert(dataToInsert);
                                }
    
                                client.logger.info('Records inserted!');
                                await interaction.editReply({ content: 'JSON data updated!' });
                            } else {
                                await interaction.editReply({ content: 'Failed to fetch JSON' });
                            }
                        } catch (error) {
                            await interaction.editReply({ content: `Invalid JSON:\n> ${error.message}` });
                        }
                    } else {
                        await interaction.editReply({ content: 'Not a JSON file' });
                    }
                } else if (subcommand === 'export') {
                    const jsonData = [];
                    const users = await client.knexInstance('user').orderBy('bananas', 'desc');
    
                    if (users.length === 0) {
                        return await interaction.editReply({ content: 'The leaderboard is empty.' });
                    }
    
                    for (const user of users) {
                        jsonData.push({
                            user_id: user.id,
                            userName: user.username,
                            bananaCount: user.bananas,
                        });
                    }
    
                    const data = JSON.stringify(jsonData);
                    const buffer = Buffer.from(data, 'utf-8');
                    const attachment = new AttachmentBuilder(buffer, { name: 'database.json' });
                    await interaction.editReply({ files: [attachment] });
                }
            } else if (subcommandGroup === 'users') {
                const userId = interaction.options.getString('user_id');
                let User;
    
                if (subcommand === 'create') {
                    const userName = interaction.options.getString('user_name').toLowerCase();
                    client.logger.debug(`/database users create user_id:${userId} user_name:${userName}`);
    
                    User = await client.knexInstance('user').where('id', userId).first();
                    if (!User) {
                        await client.knexInstance('user').insert({
                            id: userId,
                            username: userName,
                        });
                        return await interaction.editReply({ content: `User ${userId} added.` });
                    }
                    await interaction.editReply({ content: 'That user is already in database.' });
                } else if (subcommand === 'read') {
                    client.logger.debug(`/database users read user_id: ${userId}`);
                    User = await client.knexInstance('user').where('id', userId).first();
    
                    if (!User) {
                        return await interaction.editReply({ content: 'User not found.' });
                    }
    
                    const embedDescription = [
                        `- **ID**: ${User.id}`,
                        `- **Username**: ${User.username}`,
                        `- **Display**: ${User.display_name ?? 'N/A'}`,
                        `- **Bananas**: ${User.bananas}`,
                    ];
    
                    const embed = new EmbedBuilder()
                        .setTitle('User')
                        .setDescription(embedDescription.join('\n'))
                        .setColor('Blurple');
                    await interaction.editReply({ embeds: [embed] });
                } else if (subcommand === 'update') {
                    const userName = interaction.options.getString('username');
                    const displayName = interaction.options.getString('display_name');
                    const bananas = interaction.options.getInteger('bananas');
    
                    client.logger.debug(
                        `/database users update user_id: ${userId} username:${userName} display_name: ${displayName} bananas: ${bananas}`
                    );
    
                    User = await client.knexInstance('user').where('id', userId).first();
    
                    if (!User) {
                        return await interaction.editReply({ content: 'User not found.' });
                    }
    
                    const dataToUpdate = {};
    
                    if (userName) {
                        dataToUpdate['username'] = userName;
                    }
    
                    if (displayName) {
                        dataToUpdate['display_name'] = displayName;
                    }
    
                    if (bananas) {
                        dataToUpdate['bananas'] = bananas;
                    }
    
                    if (Object.keys(dataToUpdate).length === 0) {
                        return await interaction.editReply({ content: 'Nothing changed.' });
                    }
    
                    await client.knexInstance('user').where('id', userId).update(dataToUpdate);
                    await interaction.editReply({ content: `User ${userId} updated.` });
                } else if (subcommand === 'delete') {
                    client.logger.debug(`/database users delete user_id: ${userId}`);
                    User = await client.knexInstance('user').where('id', userId).first();
    
                    if (!User) {
                        return await interaction.editReply({ content: 'User not found.' });
                    }
    
                    await client.knexInstance('user').where('id', userId).del();
    
                    await interaction.editReply({ content: `User ${userId} deleted.` });
                } else if (subcommand === 'get_all') {
                    client.logger.debug('/database users get_all');
                    const users = await client.knexInstance.select('*').from('user');
    
                    if (users.length === 0) {
                        return await interaction.editReply({ content: 'No users in database.' });
                    }
    
                    const embedDescription = users.map((user) => `- ${user.id}: ${user.username}`);
    
                    const itemsPerPage = 10;
                    const pages = Math.ceil(embedDescription.length / itemsPerPage);
                    let currentPage = 1;
    
                    const getEmbed = (page) => {
                        const startIndex = (page - 1) * itemsPerPage;
                        const endIndex = Math.min(page * itemsPerPage, embedDescription.length);
                        const listedItems = embedDescription.slice(startIndex, endIndex);
    
                        const embed = new EmbedBuilder()
                            .setTitle('Users')
                            .setDescription(listedItems.join('\n'))
                            .setColor('Blurple')
                            .setFooter({ text: `Page ${currentPage} of ${pages}` });
    
                        const row = new ActionRowBuilder();
    
                        row.addComponents(
                            new ButtonBuilder()
                                .setCustomId('previous')
                                .setLabel('Previous')
                                .setStyle(ButtonStyle.Primary)
                                .setDisabled(currentPage === 1)
                        );
    
                        row.addComponents(
                            new ButtonBuilder()
                                .setCustomId('next')
                                .setLabel('Next')
                                .setStyle(ButtonStyle.Primary)
                                .setDisabled(currentPage === pages)
                        );
    
                        return { embeds: [embed], components: [row] };
                    };
    
                    const response = await interaction.editReply(getEmbed(currentPage));
                    const interactionDuration = 60_000;
    
                    const collector = response.createMessageComponentCollector({
                        componentType: ComponentType.Button,
                        time: interactionDuration,
                    });
    
                    collector.on('collect', async (buttonInteraction) => {
                        if (!buttonInteraction.isButton()) return;
                        await buttonInteraction.deferUpdate();
    
                        if (buttonInteraction.customId === 'previous') {
                            currentPage--;
                        } else if (buttonInteraction.customId === 'next') {
                            currentPage++;
                        }
    
                        await buttonInteraction.editReply(getEmbed(currentPage));
    
                        // Reset timeout on interaction
                        collector.resetTimer();
                    });
    
                    collector.on('end', async () => {
                        const embed = new EmbedBuilder()
                            .setTitle('Users')
                            .setDescription('Interaction timed out.')
                            .setColor('Red');
                        await interaction.editReply({ embeds: [embed], components: [] });
                    });
                }
            } */
        //}
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
    const records = await service.findAll();
    if (!records.data.length) {
        return await interaction.editReply({ content: 'No records' });
    }
    const embed = new discord_js_1.EmbedBuilder().setColor(discord_js_1.Colors.Navy).setTitle('Database - Read');
    embed.setDescription((0, discord_js_1.codeBlock)(JSON.stringify(records.data, null, 4)));
    await interaction.editReply({ embeds: [embed] });
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
    embed.setDescription((0, discord_js_1.codeBlock)(JSON.stringify(fetchedData, null, 4)));
    await interaction.editReply({ embeds: [embed] });
}
async function handleDatabaseExport(interaction, service) {
    const allRecords = await service.findAll();
    const buffer = Buffer.from(JSON.stringify(allRecords.data), 'utf-8');
    const attachment = new discord_js_1.AttachmentBuilder(buffer, { name: 'exported.json' });
    await interaction.editReply({ files: [attachment] });
}
