const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, StringSelectMenuBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = {
    category: 'Utilities',
    type: 'slash',

    data: new SlashCommandBuilder()
        .setName('find')
        .setDescription('find a voice model')
        .addStringOption(option => option
            .setName('name')
            .setDescription('name of model to search for')
            .setRequired(true))
        .addBooleanOption(option => option
            .setName('compact')
            .setDescription('make output compact (false by default)'))
        .addBooleanOption(option => option
            .setName('private')
            .setDescription('hide message from others (true by default)'))
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),

    async execute(interaction) {
        const client = interaction.client;
        if(interaction.options.getBoolean('compact')) {
            compactDisplay(client, interaction);
        } else {
            fullDisplay(client, interaction)
        }
    },
};

async function compactDisplay(interaction) {
    let allResults = interaction.client.modelSearchEngine.search(interaction.options.getString('name'), { fuzzy: 0.2 }).filter(result => result.downloadURL && result.downloadURL.length);

    allResults.sort((a, b) => b.score - a.score);

    let results;
    let resultsLeft;

    if (!allResults.length) {
        return void interaction.reply({ embeds: [new EmbedBuilder().setTitle('No result found.').setColor(`Red`)], ephemeral: interaction.options.getBoolean('private') ?? true });
    }

    if (allResults.length > 3) {
        results = allResults.slice(0, 3);
        resultsLeft = allResults.length - 3;
    } else {
        results = allResults;
    }

    const resultEmbed = new EmbedBuilder()
        .setTitle(`${allResults.length} results found - Search mode: R-D, fuzzy: 0.2, compact`)
        .setDescription(results.map(result => `- [${result.title}](${result.downloadURL[0]}) ${result.tags.map(tag => `${tag ? tag.icon : `Deleted Icon`}`).join(``)} - ${result.creator}`).join(`\n`))
        .setColor(`Green`);

    if (resultsLeft) {
        resultEmbed.setFooter({ text: `And ${resultsLeft} more results...` })
    }

    interaction.reply({ embeds: [resultEmbed], ephemeral: interaction.options.getBoolean('private') ?? true });
}


async function fullDisplay(client, interaction) {
    let fuzzyValue = 0;
        
    let allResults = client.modelSearchEngine.search(interaction.options.getString('name'), { fuzzy: fuzzyValue }).filter(result => result.downloadURL && result.downloadURL.length);

    allResults.sort((a, b) => b.score - a.score);

    let results;
    let resultsLeft;
    let page = 1;
    let order = 'descending'
    let possiblePages = Math.ceil(allResults.length / 3);
    let attributeToSortBy = { attribute: 'score', type: 'number' };

    let displayOrder = 'D';
    let displayAttribute = 'R'

    const availableSuggestions = client.modelSearchEngine.autoSuggest(interaction.options.getString('name'), {fuzzy: 0.2});

    if (!allResults.length) {
        return void interaction.reply({ embeds: [new EmbedBuilder().setTitle('No result found.').setDescription(availableSuggestions.length ? `## Did you mean...?\n${availableSuggestions.map(sugg => `### ‣ \`${sugg.suggestion}\` - ${Math.round(sugg.score * 10)}% match`).join(`\n`)}` : `No available suggestions for this query.`).setColor(`Red`)], ephemeral: interaction.options.getBoolean('private') ?? true });
    }

    results = getSubarrayByPage(allResults, page);
    resultsLeft = allResults.length - 3;

    let resultEmbed = new EmbedBuilder()
        .setTitle(`${allResults.length} results found - Search mode: ${displayAttribute}-${displayOrder}, fuzzy: ${fuzzyValue}`)
        .setDescription(results.map(result => `### ‣ ${result.title}\n**Creator**: ${result.creator}\n**Download URLs**: ${result.downloadURL.map(url => `[${new URL(url).host}](${url})`).join(', ')}\n**Tags**: ${result.tags.map(tag => `${tag ? tag.name : `Deleted Tag`} ${tag ? tag.icon : `Deleted Icon`}`).join(`, `)}\n**Created**: <t:${Math.round(result.creationTimestamp / 1000)}:R>`).join(`\n\n`))
        .setColor(`Green`);

    if (resultsLeft) {
        resultEmbed.setFooter({ text: `Page ${page}/${possiblePages}` })
    }

    if (allResults.length <= 3) {
        scrollRightButton.setDisabled();
    }

    const msg = await interaction.reply({ embeds: [resultEmbed], components: [GUI, sortDropdownGUI], ephemeral: interaction.options.getBoolean('private') ?? true });

    const filter = i => i.user.id === interaction.author.id;
    const collector = msg.createMessageComponentCollector({ filter, idle: 60000, time: 300000 });

    collector.on('collect', async i => {
        if (i.customId === 'left') {
            page--;
            results = getSubarrayByPage(allResults, page);

            updateScroll();

            i.update({ embeds: [updatedEmbed(allResults)], components: [GUI, sortDropdownGUI] }).catch(() => console.log(`fail`));
        }

        if (i.customId === 'right') {
            page++;
            results = getSubarrayByPage(allResults, page);

            updateScroll();

            i.update({ embeds: [updatedEmbed(allResults)], components: [GUI, sortDropdownGUI] }).catch(() => console.log(`fail`));
        }

        if (i.customId === 'order') {
            const switched = ['ascending', 'descending'].filter(h => h !== order)[0];
            order = switched;
            displayOrder = switched.charAt(0).toUpperCase();

            changeSortOrder(allResults, order, attributeToSortBy);
            results = getSubarrayByPage(allResults, page);

            i.update({ embeds: [updatedEmbed(allResults)], components: [GUI, sortDropdownGUI] }).catch(() => console.log(`fail`));
        }

        if (i.customId === 'settings') {
            const fuzzyActionRow = new ActionRowBuilder().addComponents(fuzzyValueInput);
            const strictSearchActionRow = new ActionRowBuilder().addComponents(strictSearchValueInput);

            settingsModal.addComponents([fuzzyActionRow, strictSearchActionRow]);

            await i.showModal(settingsModal);

            const modalFilter = interaction => interaction.customId === 'settingsModal';
            const submission = await i.awaitModalSubmit({ filter: modalFilter, time: 60000 }).catch(m => {
                return;
            });

            if (!submission) {
                return;
            }

            let fuzzyInputValue = !Number.isNaN(+submission.fields.getTextInputValue(`fuzzy`)) ? +submission.fields.getTextInputValue(`fuzzy`) : 0;
            let strictSearchInputValue = submission.fields.getTextInputValue(`strictSearch`);

            if (fuzzyInputValue > 0.2 || fuzzyInputValue < 0) {
                return void submission.reply({ content: `Fuzzy value must be in 0 - 0.2 range.`, ephemeral: true })
            }

            if (!['title', 'creator', 'downloadURL'].includes(strictSearchInputValue) && strictSearchInputValue !== '') {
                return void submission.reply({ content: `Specified strict search parameter is invalid.`, ephemeral: true })
            }

            if (strictSearchInputValue === '') {
                strictSearchInputValue = ['title', 'creator', 'downloadURL'];
            } else {
                strictSearchInputValue = [strictSearchInputValue]
            }

            fuzzyValue = fuzzyInputValue;

            allResults = client.modelSearchEngine.search(interaction.options.getString('name'), { fuzzy: fuzzyValue, fields: strictSearchInputValue }).filter(result => result.downloadURL && result.downloadURL.length);

            if (!allResults.length) {
                return await submission.update({ embeds: [new EmbedBuilder().setTitle('No result found.').setDescription(availableSuggestions.length ? `## Did you mean...?\n${availableSuggestions.map(sugg => `### ‣ \`${sugg.suggestion}\` - ${Math.round(sugg.score * 10)}% match`).join(`\n`)}` : `No available suggestions for this query.`).setColor(`Red`)] });
            }

            allResults.sort((a, b) => b.score - a.score); // GPT-generated code, sort the results in descending order

            page = 1;
            order = 'descending';
            possiblePages = Math.ceil(allResults.length / 3);
            attributeToSortBy = { attribute: 'score', type: 'number' };

            displayOrder = 'D';
            displayAttribute = 'R';

            results = getSubarrayByPage(allResults, page);
            resultsLeft = allResults.length - 3;

            updateScroll();

            await submission.update({ embeds: [updatedEmbed(allResults)], components: [GUI, sortDropdownGUI] });
        }

        if (i.customId === 'sortDropdown') {
            if (i.values[0] === 'relevance') {
                attributeToSortBy.attribute = 'score';
                attributeToSortBy.type = 'number';

                changeSortOrder(allResults, order, attributeToSortBy);
                results = getSubarrayByPage(allResults, page);

                displayAttribute = 'R';

                i.update({ embeds: [updatedEmbed(resultEmbed)], components: [GUI, sortDropdownGUI] }).catch(() => console.log(`fail`));
            }

            if (i.values[0] === 'date') {
                attributeToSortBy.attribute = 'creationTimestamp';
                attributeToSortBy.type = 'number';

                changeSortOrder(allResults, order, attributeToSortBy);
                results = getSubarrayByPage(allResults, page);

                displayAttribute = 'D';

                i.update({ embeds: [updatedEmbed(resultEmbed)], components: [GUI, sortDropdownGUI] }).catch(() => console.log(`fail`));
            }

            if (i.values[0] === 'alphabet') {
                attributeToSortBy.attribute = 'title';
                attributeToSortBy.type = 'string';

                changeSortOrder(allResults, order, attributeToSortBy);
                results = getSubarrayByPage(allResults, page);

                displayAttribute = 'A';

                i.update({ embeds: [updatedEmbed(resultEmbed)], components: [GUI, sortDropdownGUI] }).catch(() => console.log(`fail`));
            }
        }
    });
}

function updateScroll() {
    if (page === 1) {
        scrollLeftButton.setDisabled();
    } else {
        scrollLeftButton.setDisabled(false);
    }

    if (page === possiblePages) {
        scrollRightButton.setDisabled();
    } else {
        scrollRightButton.setDisabled(false);
    }
}

function updatedEmbed(embed) {
    return EmbedBuilder.from(embed).setTitle(`${allResults.length} results found - Search mode: ${displayAttribute}-${displayOrder}, fuzzy: ${fuzzyValue}`).setDescription(results.map(result => `### ‣ ${result.title}\n**Creator**: ${result.creator}\n**Download URLs**: ${result.downloadURL.map(url => `[${new URL(url).host}](${url})`).join(', ')}\n**Tags**: ${result.tags.map(tag => `${tag ? tag.name : `Deleted Tag`} ${tag ? tag.icon : `Deleted Icon`}`).join(`, `)}\n**Created**: <t:${Math.round(result.creationTimestamp / 1000)}:R>`).join(`\n\n`)).setFooter({ text: `Page ${page}/${possiblePages}` }).setColor(`Green`);
}

function getSubarrayByPage(arr, page) {
    const itemsPerPage = 3;
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return arr.slice(startIndex, endIndex);
}

function changeSortOrder(arr, option, attr) {
    if (option === 'descending') {
        if (attr.type === 'number') {
            arr.sort((a, b) => b[attr.attribute] - a[attr.attribute]);
        }

        if (attr.type === 'string') {
            arr.sort((a, b) => b[attr.attribute].localeCompare(a[attr.attribute]));
        }
    }

    if (option === 'ascending') {
        if (attr.type === 'number') {
            arr.sort((a, b) => a[attr.attribute] - b[attr.attribute]);
        }

        if (attr.type === 'string') {
            arr.sort((a, b) => a[attr.attribute].localeCompare(b[attr.attribute]));
        }
    }
}

const scrollLeftButton = new ButtonBuilder()
    .setCustomId(`left`)
    .setStyle(ButtonStyle.Primary)
    .setDisabled()
    .setEmoji(`👈`);

const scrollRightButton = new ButtonBuilder()
    .setCustomId(`right`)
    .setStyle(ButtonStyle.Primary)
    .setEmoji(`👉`);

const changeSortOrderButton = new ButtonBuilder()
    .setCustomId(`order`)
    .setStyle(ButtonStyle.Primary)
    .setEmoji(`🔃`);

const settingsButton = new ButtonBuilder()
    .setCustomId(`settings`)
    .setStyle(ButtonStyle.Secondary)
    .setEmoji(`⚙`);

const settingsModal = new ModalBuilder()
    .setCustomId(`settingsModal`)
    .setTitle(`Models search settings`);

const fuzzyValueInput = new TextInputBuilder()
    .setCustomId(`fuzzy`)
    .setLabel(`Fuzzy value`)
    .setStyle(TextInputStyle.Short)
    .setPlaceholder(`0 - 0.2`)
    .setRequired();

const strictSearchValueInput = new TextInputBuilder()
    .setCustomId(`strictSearch`)
    .setLabel(`Strictly search only one property`)
    .setStyle(TextInputStyle.Short)
    .setPlaceholder(`Leave blank to search all (title, creator, downloadURL)`)
    .setRequired(false);

const sortDropdown = new StringSelectMenuBuilder()
    .setCustomId('sortDropdown')
    .setPlaceholder(`Sort by...`)
    .addOptions(
        {
            label: '🔗 Relevance',
            description: 'Sort by how close the results match with the query',
            value: 'relevance'
        },
        {
            label: '📅 Date',
            description: 'Sort by model\'s creation date',
            value: 'date'
        },
        {
            label: '🔤 Alphabet',
            description: 'Sort in alphabetical order',
            value: 'alphabet'
        }
    );

const GUI = new ActionRowBuilder().addComponents([scrollLeftButton, scrollRightButton, changeSortOrderButton, settingsButton]);
const sortDropdownGUI = new ActionRowBuilder().addComponents([sortDropdown]);