"use strict";
/* eslint-disable */
// @ts-nocheck
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
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = __importStar(require("discord.js"));
const dbManager_1 = require("../Database/dbManager");
const utils_1 = require("../utils");
const botUtilities_1 = require("../Utils/botUtilities");
class ExtendedClient extends Discord.Client {
    commands;
    slashCommands;
    contextMenuCommands;
    use;
    doxx;
    forumSpammer;
    botData;
    discordIDs;
    cooldowns;
    prefix;
    logger;
    botAdminIds;
    botConfigs;
    botUtils;
    botResponses;
    botCache;
    scheduler;
    knexInstance;
    repliedUsers;
    constructor(options, extendedOptions) {
        super(options);
        this.commands = new Discord.Collection();
        this.slashCommands = new Discord.Collection();
        this.contextMenuCommands = new Discord.Collection();
        this.use = new Discord.Collection();
        this.doxx = new Discord.Collection();
        this.cooldowns = {
            banana: new Discord.Collection(),
            slashCommands: new Discord.Collection(),
            reactions: new Discord.Collection(),
        };
        this.forumSpammer = null;
        this.logger = extendedOptions.logger;
        // database
        this.knexInstance = (0, dbManager_1.createInstance)(`${process.cwd()}/database/knex.sqlite`);
        this.botData = {
            embeds: require('../../JSON/embeds.json'),
            reactionKeywords: require('../../JSON/reactionKeywords.json'),
            cooldownImmuneUsers: new Discord.Collection(),
        };
        this.prefix = extendedOptions.prefix;
        this.discordIDs = extendedOptions.discordIDs;
        this.botAdminIds = extendedOptions.botAdminIds;
        this.botConfigs = extendedOptions.botConfigs;
        this.botResponses = extendedOptions.botResponses;
        this.botUtils = extendedOptions.botUtils;
        this.botCache = new Discord.Collection();
        this.repliedUsers = extendedOptions.repliedUsers;
        // cron job
        this.scheduler = new utils_1.Scheduler(this);
        // finish setup
        this.setupBot();
    }
    loadThemes() {
        const themes = (0, botUtilities_1.getThemes)();
        const selectedTheme = process.env.theme ?? 'defaultTheme';
        this.botConfigs.colors.theme = themes[selectedTheme];
    }
    setupBot() {
        const devMode = process.env.dev;
        if (!devMode) {
            // when in production environment, send a message on startup to the dev server
            this.botConfigs.messageOnStartup = true;
        }
        this.loadThemes();
    }
}
exports.default = ExtendedClient;
