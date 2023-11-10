const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js");
const { byValue, byNumber } = require('sort-es');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const delay = require('node:timers/promises').setTimeout;

module.exports = {
    category: `Utilities`,
    type: `slash`,
    data: new SlashCommandBuilder()
        .setName('database')
        .setDescription('Imports or exports bot database data')
        .addSubcommand(subcommand =>
            subcommand
                .setName('import')
                .setDescription('Imports data to database')
                .addAttachmentOption(option =>
                    option
                        .setName('file')
                        .setDescription('The JSON file containing the data')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('export')
                .setDescription('Downloads the bot data as a JSON file')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('delete')
                .setDescription('Deletes a user from the database')
                .addStringOption(option =>
                    option
                        .setName('user_id')
                        .setDescription('The discord user ID')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('update')
                .setDescription('Updates a user in the database')
                .addStringOption(option =>
                    option
                        .setName('userid')
                        .setDescription('The discord user ID')
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option
                        .setName('display_name')
                        .setDescription('New user display name')
                )
                .addStringOption(option =>
                    option
                        .setName('username')
                        .setDescription('New username')
                )
                .addIntegerOption(option =>
                    option
                        .setName('bananas')
                        .setDescription('Banana count')
                )
        ),
    async execute(interaction) {
        // usable on dev server only
        const client = interaction.client;
        const userId = interaction.user.id;
        const commandAllowed = userId == '676731895647567882';
        if (!commandAllowed) {
            return await interaction.reply({ content: 'You are not allowed to use this command.', ephemeral: true });
        }

        await interaction.deferReply({ ephemeral: true });
        await delay(1000);

        if (interaction.options.getSubcommand() === 'import') {
            const file = interaction.options.getAttachment('file');

            if (file.contentType.includes('application/json')) {
                try {
                    const response = await fetch(file.url);

                    if (response.ok) {
                        const data = await response.json();

                        for (let record of data) {
                            let dataToInsert = {
                                'user_id': record.userId,
                                'item_id': 1, // banana item id
                                quantity: record.bananaCount
                            };
                            await client.knexInstance('inventory').insert(dataToInsert);
                            await client.knexInstance('user').insert({
                                id: record.userId,
                                username: record.userName
                            })
                        }
                        await interaction.editReply({ content: 'JSON data updated!' });
                    }
                    else {
                        await interaction.editReply({ content: 'Failed to fetch JSON' });
                    }
                }
                catch (error) {
                    await interaction.editReply({ content: `Invalid JSON:\n> ${error.message}` });
                }
            }
            else {
                await interaction.editReply({ content: 'Not a JSON file' });
            }

        } else if (interaction.options.getSubcommand() === 'export') {
            /*
            // old enmap
            const lbUnsorted = JSON.parse(client.banana.export()).keys;

            // get the top 20 banan result
            const lbSorted = lbUnsorted.sort(byValue(i => i.value, byNumber({ desc: true }))).slice(0, 20);

            const jsonData = [];

            for (const entry of lbSorted) {
                const entryVal = Object.values(entry);
                const user = await interaction.client.users.fetch(entryVal[0]);
                jsonData.push({ userId: user.id, username: `${user.username}`, bananaCount: entryVal[1] });
            }
            */

            const jsonData = [];
            const inventory = await client.knexInstance('inventory').orderBy('quantity', 'desc').limit(15);

            if (inventory.length === 0) {
                return await interaction.editReply({ content: "The leaderboard is empty." });
            }

            for (const entry of inventory) {
                let user = await client.knexInstance('user').where('id', entry['user_id']);
                jsonData.push({
                    userId: user[0].id,
                    userName: user[0].username,
                    bananaCount: entry.quantity
                });
            }

            const data = JSON.stringify(jsonData);
            const buffer = Buffer.from(data, 'utf-8');
            const attachment = new AttachmentBuilder(buffer, { name: 'database.json' });
            await interaction.editReply({ files: [attachment] });
        }
        else if (interaction.options.getSubcommand() === 'delete') {
            const userId = interaction.options.getString('user_id');
            const botResponse = {};

            const User = await client.knexInstance('user').where('id', userId).first();

            if (!User) {
                botResponse.content = `User with ID ${userId} not found.`;
                return interaction.editReply(botResponse);
            }

            botResponse.embeds = client.botUtils.createEmbeds([
                {
                    title: 'User deleted from database',
                    description: [
                        `ID: ${User.id}`,
                        `Username: ${User.username}`,
                        `Display Name: ${User.display_name}`,
                    ]
                }], ['Red']
            );

            // delete user
            await client.knexInstance('user').where('id', userId).del();

            // delete user inventory if not empty
            const UserInventory = await client.knexInstance('inventory').where('user_id', userId).first();

            if (UserInventory) {
                await client.knexInstance('inventory').where('user_id', userId).del();
            }

            await interaction.editReply(botResponse);
        }
        else if (interaction.options.getSubcommand() === 'update') {
            const userId = interaction.options.getString('userid');
            const displayName = interaction.options.getString('display_name');
            const userName = interaction.options.getString('username');
            const bananas = interaction.options.getInteger('bananas');

            const User = await client.knexInstance('user').where('id', userId).first();

            const botResponse = {};

            if (!User) {
                botResponse.content = `User with ID ${userId} not found.`;
            }
            else {
                const Inventory = await client.knexInstance('inventory').where('user_id', userId).first();

                if (!Inventory) {
                    botResponse.content = `${User.username} inventory is empty.`;
                } else {
                    const userUpdatedData = {};
                    const inventoryUpdatedData = {};
                    botResponse.content = [`ID: ${userId}`];

                    if (displayName) {
                        userUpdatedData.display_name = displayName;
                        botResponse.content.push(`display name: ${displayName}`);
                    }

                    if (userName) {
                        userUpdatedData.username = userName;
                        botResponse.content.push(`username: ${userName}`);
                    }

                    if (Object.values(userUpdatedData).length) {
                        await client.knexInstance('user')
                            .update(userUpdatedData)
                            .where('id', userId);
                    }


                    if (bananas) {
                        inventoryUpdatedData.quantity = bananas;
                        botResponse.content.push(`bananas: ${bananas}`);
                    }

                    if (Object.values(inventoryUpdatedData).length) {
                        await client.knexInstance('inventory')
                            .update(inventoryUpdatedData)
                            .where('user_id', userId);
                    }

                    botResponse.content = botResponse.content.join('\n');
                }
            }

            await interaction.editReply(botResponse);
        }
    }
}