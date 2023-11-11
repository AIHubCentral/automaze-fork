// Libraries needed
const fs = require('fs');
const path = require('node:path');
const { EmbedBuilder } = require('discord.js');

// Will give you all the files in a folder recursively
function getAllFiles(currentPath) {
    let currentFiles = [];
    for (const thatFile of fs.readdirSync(currentPath)) {
        let filePath = currentPath + '/' + thatFile;
        if (fs.lstatSync(filePath).isDirectory()) {
            currentFiles = currentFiles.concat(currentFiles, getAllFiles(filePath));
        } else {
            currentFiles.push(filePath);
        }
    }
    return [...new Set(currentFiles)];
}
exports.getAllFiles = getAllFiles;

// Create delay async in the script
async function delay(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}
exports.delay = delay;

function getRandomNumber(min, max) {
    /* gets a random number between min and max */
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

exports.getRandomNumber = getRandomNumber;

function getRandomFromArray(arr) {
    /* gets a random value from an array */
    if (arr.length === 0) return null;
    if (arr.length === 1) return arr[0];
    const randomIndex = getRandomNumber(0, arr.length - 1);
    return arr[randomIndex];
}

exports.getRandomFromArray = getRandomFromArray;

function getCommands(basePath, subPath) {
    /* get an array of commands converted to json ready to be sent to discord API */
    const commands = [];

    const foldersPath = path.join(basePath, subPath);
    let commandFolders = fs.readdirSync(foldersPath);

    for (const folder of commandFolders) {
        const commandsPath = path.join(foldersPath, folder);
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
        // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            const command = require(filePath);
            if ('data' in command && 'execute' in command) {
                commands.push(command.data.toJSON());
            }
            else {
                console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
            }
        }
    }

    return commands;
}

exports.getCommands = getCommands;


function createEmbed(data, color = '') {
    /**
     * Creates a discord embed from an object passed as `data` argument
     */
    const embed = new EmbedBuilder();

    // if the color not provided as an argument, try to use from data
    if (!color) {
        color = data.color;
    }
    embed.setColor(color ?? 'Yellow');  // defaults to Yellow

    if (data.title) {
        embed.setTitle(data.title);
    }

    if (data.description) {
        embed.setDescription(data.description.join('\n'));
    }

    if (data.fields) {
        embed.setFields(data.fields);
    }

    if (data.image) {
        embed.setImage(data.image);
    }

    if (data.footer) {
        embed.setFooter({ text: data.footer });
    }

    if (data.timestamp) {
        embed.setTimestamp();
    }

    return embed;
}

exports.createEmbed = createEmbed;


function createEmbeds(contents, colors) {
    /* create embeds from an array of objects and assign colors */
    let colorIndex = 0;
    let embeds = contents.map(item => {
        if (colorIndex >= colors.length) {
            colorIndex = 0;  // goes back to the start of the array after reaching the end
        }
        const selectedColor = item.color ?? colors[colorIndex++];
        return createEmbed(item, selectedColor);
    });
    return embeds;
}

exports.createEmbeds = createEmbeds;

function getAvailableColors(configs) {
    return Object.values(configs.colors.theme);
}

exports.getAvailableColors = getAvailableColors;

async function banan(interaction, targetUser) {
    const { client, user } = interaction;

    // check if user is on cooldown
    if (Date.now() <= client.cooldowns.banana.get(user.id)) {
        return interaction.reply(`dumbass yuo alredy banan ppl, wait GRRRRRRRRRRRRRRR!!!!!!!!!!!!!!!!!!!!!!!! yu gto ${client.cooldowns.banana.get(interaction.user.id) - Date.now()} milliseconds left im too lazy to do math do it yourself GRRRRRRRRRR`)
    }

    if (client.disallowedChannelIds.includes(interaction.channelId)) {
        return await interaction.reply({ content: 'This command is not available here.', ephemeral: true });
    }

    let member = targetUser;
    let botRevenge = false; // if its true automaze banan the user instead
    const botResponses = client.botResponses.responses.banana;
    let selectedResponse = null;

    if (!member) return interaction.reply(botResponses.targetNone);

    if (member.bot) {
        const responses = botResponses.targetBot;
        selectedResponse = responses[Math.floor(Math.random() * responses.length)];
        if (!selectedResponse.startsWith('NO,')) {
            return interaction.reply(selectedResponse);
        }

        // change the banan target to the user who tried to banan automaze or any other bot
        member = interaction.user;
        botRevenge = true;
    }

    // check if user is in database
    let dbResult = await client.knexInstance('user').where('id', `${member.id}`);

    if (dbResult.length === 0) {
        console.log('User not found in database');
        await client.knexInstance('user').insert({
            id: `${member.id}`,
            username: member.username
        });
        console.log(`${member.username} added to database`);
    }

    // check if banana is in the user inventory
    dbResult = await client.knexInstance('inventory').where({
        'user_id': `${member.id}`,
        'item_id': 1, // banana id
    });

    if (dbResult.length === 0) {
        // add banana to inventory
        await client.knexInstance('inventory').insert({
            'user_id': `${member.id}`,
            'item_id': 1,
            quantity: 1
        });
    } else {
        // if already have banana, increment the value
        await client.knexInstance('inventory').update({
            quantity: dbResult[0].quantity + 1
        }).where({
            'user_id': `${member.id}`,
            'item_id': 1,
        });
    }

    // last query to check how much bananas
    dbResult = await client.knexInstance('inventory').where({
        'user_id': `${member.id}`,
        'item_id': 1,
    });

    // copy embed data
    const embedData = JSON.parse(JSON.stringify(client.botData.embeds.banana));
    embedData.title = embedData.title.replace('$username', member.displayName);
    embedData.description[0] = embedData.description[0].replaceAll('$member', member);
    embedData.footer = embedData.footer.replace('$quantity', dbResult[0].quantity);

    if (dbResult[0].quantity > 1) {
        embedData.footer = embedData.footer.replace('TIME', 'TIMES');
    }

    const embed = client.botUtils.createEmbed(embedData, "Yellow");

    // cooldown expires in 1 minute
    client.cooldowns.banana.set(interaction.user.id, Date.now() + (1 * 60 * 1000));

    if (botRevenge) {
        await interaction.reply(selectedResponse);
        return interaction.followUp({ embeds: [embed] });
    }

    interaction.reply({ embeds: [embed] });
}

exports.banan = banan;


function saveJSON(filename, data) {
    let success = false;
    const dateString = new Date().toISOString().slice(0, 10);
    const filepath = path.join(process.cwd(), 'Debug', `${filename}-${dateString}.json`);
    try {
        let content = [];
        if (fs.existsSync(filepath)) {
            content = JSON.parse(fs.readFileSync(filepath, 'utf-8'));
        }
        content.push(data);
        fs.writeFileSync(filepath, JSON.stringify(content, null, 4));
        success = true;
    }
    catch (error) {
        console.log(`Failed to save ${filepath}`);
        console.error(error);
    }
    return success;
}

exports.saveJSON = saveJSON;