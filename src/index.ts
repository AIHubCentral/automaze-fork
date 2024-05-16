require('dotenv').config();

// Libraries
import * as Discord from 'discord.js';
import Logger from './logger';
import ExtendedClient, { ExtendedClientOptions } from './Core/extendedClient';

// Exports
const {
    getAllFiles, createEmbed, createEmbeds,
    getAvailableColors, getRandomNumber, getRandomFromArray
} = require('./utils');

// JSONs
const DiscordIDs = {
    prod: '../JSON/configs/idsDiscordProd.json',
    dev: '../JSON/configs/idsDiscordDev.json',
};

const botConfigs = require('../JSON/botConfigs.json');
const botResponses = require('../JSON/bot_responses.json')

// set dev=true in .env to use the development guild ids
const devMode = process.env.dev;

/* Discord Client initialization */

const extendedOptions: ExtendedClientOptions = {
    prefix: devMode ? botConfigs.prefix.dev : botConfigs.prefix.prod, // set the command prefix based on the environment
    discordIDs: require(devMode ? DiscordIDs.dev : DiscordIDs.prod),
    logger: Logger,
    botConfigs: botConfigs,
    botResponses: botResponses,
    botAdminIds: process.env.developerIds ? process.env.developerIds.split(',') : [],
    botUtils: {
        createEmbed, createEmbeds,
        getAvailableColors, getRandomNumber, getRandomFromArray
    }
};

const client = new ExtendedClient(
    {
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
    }, extendedOptions);

// Read all handlers of the folder
const handlerFiles: string[] = getAllFiles(`${process.cwd()}/dist/Handlers`).filter((file: string) => file.endsWith('.js'));

for (const handler of handlerFiles) {
    require(handler)(client, Discord);
}

client.login(process.env.token);
