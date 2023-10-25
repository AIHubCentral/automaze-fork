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
                                username: record.username
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
            const lbUnsorted = JSON.parse(client.banana.export()).keys;

            // get the top 20 banan result
            const lbSorted = lbUnsorted.sort(byValue(i => i.value, byNumber({ desc: true }))).slice(0, 20);

            const jsonData = [];

            for (const entry of lbSorted) {
                const entryVal = Object.values(entry);
                const user = await interaction.client.users.fetch(entryVal[0]);
                jsonData.push({ userId: user.id, username: `${user.username}`, bananaCount: entryVal[1] });
            }

            const data = JSON.stringify(jsonData);
            const buffer = Buffer.from(data, 'utf-8');
            const attachment = new AttachmentBuilder(buffer, { name: 'database.json' });
            await interaction.editReply({ files: [attachment] });
        }
    }
}