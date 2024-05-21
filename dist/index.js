"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
// Libraries
const Discord = __importStar(require("discord.js"));
const logger_1 = __importDefault(require("./logger"));
const extendedClient_1 = __importDefault(require("./Core/extendedClient"));
const eventHandler_1 = __importDefault(require("./Handlers/eventHandler"));
const commandHandler_1 = __importDefault(require("./Handlers/commandHandler"));
// Exports
const { createEmbed, createEmbeds, getAvailableColors, getRandomNumber, getRandomFromArray } = require('./utils');
// JSONs
const DiscordIDs = {
    prod: '../JSON/configs/idsDiscordProd.json',
    dev: '../JSON/configs/idsDiscordDev.json',
};
const botConfigs = require('../JSON/botConfigs.json');
const botResponses = require('../JSON/bot_responses.json');
// set dev=true in .env to use the development guild ids
const devMode = process.env.dev;
/* Discord Client initialization */
const extendedOptions = {
    prefix: devMode ? botConfigs.prefix.dev : botConfigs.prefix.prod, // set the command prefix based on the environment
    discordIDs: require(devMode ? DiscordIDs.dev : DiscordIDs.prod),
    logger: logger_1.default,
    botConfigs: botConfigs,
    botResponses: botResponses,
    botAdminIds: process.env.developerIds ? process.env.developerIds.split(',') : [],
    botUtils: {
        createEmbed, createEmbeds,
        getAvailableColors, getRandomNumber, getRandomFromArray
    }
};
const client = new extendedClient_1.default({
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
(0, commandHandler_1.default)(client);
(0, eventHandler_1.default)(client);
client.login(process.env.token);
