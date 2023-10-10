// Remember I will create the .env file if it is not already created
const Env = require('dotenv').config();

// Libraries
const Enmap = require("enmap");
const Discord = require(`discord.js`);

// database instance
const { sequelize } = require('./database/models.js');

// Exports
const { getAllFiles, createEmbed, getRandomNumber } = require('./utils');

// JSONs
const DiscordIDs = {
    prod: "./Configs/idsDiscordProd.json",
    dev: "./Configs/idsDiscordDev.json"
}

const itemsData = require('./JSON/items.json');

// Discord Client initialization
const client = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.MessageContent,
        Discord.GatewayIntentBits.GuildModeration,
        Discord.GatewayIntentBits.GuildMembers
    ],
    allowedMentions: {
        parse: [`users`]
    }
});

// set dev=true in .env to use the development guild ids
const devMode = process.env.dev;

// Discord IDs JSON
client.discordIDs = require(devMode ? DiscordIDs.dev : DiscordIDs.prod);

// Discord Tables
client.forumSpammer = {}

// Discord Collections 
client.commands = new Discord.Collection();
client.slashCommands = new Discord.Collection();
client.contextMenuCommands = new Discord.Collection();
client.snipes = new Discord.Collection();
client.esnipes = new Discord.Collection();
client.deprecationCD = new Discord.Collection();
client.use = new Discord.Collection();
client.doxx = new Discord.Collection();

// Enmap's creation
client.items = new Enmap({name: 'items'});
client.currencies = new Enmap({name: 'currencies'});
client.equipments = new Enmap({name: 'equipments'});
client.models = new Enmap({name: 'models'});
client.levels = new Enmap({name: 'levels'});
client.exp = new Enmap({name: 'exp'});
client.epochs = new Enmap({name: 'epochs'});
client.banana = new Enmap({name: 'banana'});
client.bananaCD = new Enmap();
client.scourCD = new Enmap();
client.prefix = new Enmap({name: 'prefix'});

// banana data as an object instead of enmap
client.bananaData = {};

client.botAdminIds = process.env.developerIds.split(',');

client.botConfigs = {
    commissions: {
        sendMessages: true,
        deleteMessages: true
    },
    general: {
        reactions: true,
    }
};

// Utility functions and JSON data
client.botData = {
    embeds: require('./JSON/embeds.json')
};

client.botUtils = {
    createEmbed,
    getRandomNumber
};

// init database
client.databaseInfo = {
    active: false,
    message: 'Unable to connect to the database.'
};

client.sequelize = sequelize;

(async () => {
    try {
        await client.sequelize.authenticate();
        const message = 'Connection has been estabilished successfully.';

        await client.sequelize.sync({ force: true });
        console.log("All models were synchronized successfully.");

        client.databaseInfo.active = true;
        client.databaseInfo.message = message;
        console.log(message);

        // add game items to db
        for (let key in itemsData) {
            let currentItem = itemsData[key]
            await client.sequelize.Item.create({
                id: currentItem.id,
                name: currentItem.name,
                keyName: currentItem.keyName
            });
            //console.log('Added', currentItem.name);
        }

        // query
        //const items = await client.sequelize.Item.findAll();
        //console.log('All items:', JSON.stringify(items, null, 2));

    } catch(error) {
        client.databaseInfo.message = error.message;
        console.error(error.message);
    }
})();

// bot responses loaded on startup
client.botResponses = require('./JSON/bot_responses.json');

// disallow -find and -cfind in these channels
client.disallowedChannelIds = [];
client.disallowedChannelIds.push(client.discordIDs.Channel.GetModelMakerRole);
client.disallowedChannelIds.push(client.discordIDs.Channel.MakingModels);

// Read all handlers of the folder
const handlerFiles = getAllFiles('./Handlers').filter(file => file.endsWith('.js'));
for(const handler of handlerFiles) {
    require(handler)(client, Discord);
};

// Add your bot token in the token variable in the .env file (create it if it doesn't exist)
// Then use dotenv to read the token from that file
client.login(process.env.token);
