require('dotenv').config();

import * as Discord from 'discord.js';
import Logger from './logger';
import ExtendedClient, { ExtendedClientOptions } from './Core/extendedClient';
import registerEvents from './Handlers/eventHandler';
import registerCommands from './Handlers/commandHandler';
import registerProcesses from './Handlers/processHandler';
import { initI18n } from './i18n';

// Exports
const { getAvailableColors, getRandomNumber, getRandomFromArray } = require('./utils');

// JSONs
const DiscordIDs = {
    prod: '../JSON/configs/idsDiscordProd.json',
    dev: '../JSON/configs/idsDiscordDev.json',
};

const botConfigs = require('../JSON/botConfigs.json');
const botResponses = require('../JSON/botResponses.json');

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
        getAvailableColors,
        getRandomNumber,
        getRandomFromArray,
    },
};

if (!devMode) {
    extendedOptions.botConfigs.messageOnStartup = true;
}

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
    },
    extendedOptions
);

(async () => {
    registerCommands(client);
    registerEvents(client);
    registerProcesses(client);

    await initI18n();

    client.login(process.env.token);
})();
