"use strict";
/* eslint-disable */
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
const Discord = __importStar(require("discord.js"));
const db_1 = __importDefault(require("../db"));
const settingsService_1 = __importDefault(require("../Services/settingsService"));
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
    //scheduler: any;
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
        this.knexInstance = db_1.default;
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
        //this.scheduler = new Scheduler(this);
        // finish setup
        this.setupBot();
    }
    setupBot() {
        const devMode = process.env.dev;
        if (!devMode) {
            // when in production environment, send a message on startup to the dev server
            this.botConfigs.messageOnStartup = true;
        }
        (async () => {
            // add settings to cache
            const settingsService = new settingsService_1.default(this.knexInstance);
            const currentSettings = await settingsService.find('main_settings');
            if (!currentSettings) {
                this.logger.warn('Could not find a settings configuration');
                return;
            }
            this.botCache.set('settings', currentSettings);
            this.logger.debug('Added settings to cache');
        })();
    }
}
exports.default = ExtendedClient;
