// Remember I will create the .env file if it is not already created
require('dotenv').config();

// Libraries
// const Enmap = require('enmap');
const Discord = require('discord.js');
const logger = require('./logger');

// Exports
const {
    getAllFiles, createEmbed, createEmbeds,
    getAvailableColors, getRandomNumber, getRandomFromArray,
    Scheduler,
    getThemes,
} = require('./utils');

// JSONs
const DiscordIDs = {
    prod: './JSON/configs/idsDiscordProd.json',
    dev: './JSON/configs/idsDiscordDev.json',
};

// Discord Client initialization
const client = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.GuildMessageReactions,
        Discord.GatewayIntentBits.MessageContent,
        Discord.GatewayIntentBits.GuildModeration,
        Discord.GatewayIntentBits.GuildMembers,
    ],
    allowedMentions: {
        parse: ['users'],
    },
});

// winston logger
client.logger = logger;

// set dev=true in .env to use the development guild ids
const devMode = process.env.dev;

// Discord IDs JSON
client.discordIDs = require(devMode ? DiscordIDs.dev : DiscordIDs.prod);

// Discord Tables
client.forumSpammer = {};

// Discord Collections
client.commands = new Discord.Collection();
client.slashCommands = new Discord.Collection();
client.contextMenuCommands = new Discord.Collection();
client.use = new Discord.Collection();
client.doxx = new Discord.Collection();

/*
client.snipes = new Discord.Collection();
client.esnipes = new Discord.Collection();
*/

client.cooldowns = {
    banana: new Discord.Collection(),
    slashCommands: new Discord.Collection(),
    reactions: new Discord.Collection(),
};

const botConfigs = require('./JSON/botConfigs.json');

// Enmap's creation
/*
client.items = new Enmap({ name: 'items' });
client.currencies = new Enmap({ name: 'currencies' });
client.equipments = new Enmap({ name: 'equipments' });
client.models = new Enmap({ name: 'models' });
client.levels = new Enmap({ name: 'levels' });
client.exp = new Enmap({ name: 'exp' });
client.epochs = new Enmap({ name: 'epochs' });
client.banana = new Enmap({ name: 'banana' });
client.scourCD = new Enmap();

client.prefix = new Enmap({ name: 'prefix' });
*/

// set the command prefix based on the environment
client.prefix = devMode ? botConfigs.prefix.dev : botConfigs.prefix.prod;

client.botAdminIds = process.env.developerIds.split(',');

client.botConfigs = botConfigs;
if (!devMode) {
    // when in production environment, send a message on startup to the dev server
    client.botConfigs.messageOnStartup = true;
}

// Utility functions and JSON data
client.botData = {
    embeds: require('./JSON/embeds.json'),
    reactionKeywords: require('./JSON/reactionKeywords.json'),
    cooldownImmuneUsers: new Discord.Collection(),
};

client.botUtils = {
    createEmbed,
    createEmbeds,
    getAvailableColors,
    getRandomNumber,
    getRandomFromArray,
};

// load themes on startup
const themes = getThemes();
const selectedTheme = process.env.theme ?? 'defaultTheme';
client.botConfigs.colors.theme = themes[selectedTheme];

// knex database
client.knexInstance = require('./database/dbManager.js').createInstance('./database/knex.sqlite');

// cron job
client.scheduler = new Scheduler(client);

// bot responses loaded on startup
client.botResponses = require('./JSON/bot_responses.json');

// disallow -find and -cfind in these channels
client.disallowedChannelIds = [];
client.disallowedChannelIds.push(client.discordIDs.Channel.GetModelMakerRole);
client.disallowedChannelIds.push(client.discordIDs.Channel.MakingModels);

// Read all handlers of the folder
const handlerFiles = getAllFiles('./Handlers').filter(file => file.endsWith('.js'));
for (const handler of handlerFiles) {
    require(handler)(client, Discord);
}

// Add your bot token in the token variable in the .env file (create it if it doesn't exist)
// Then use dotenv to read the token from that file
client.login(process.env.token);