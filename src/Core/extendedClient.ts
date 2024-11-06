/* eslint-disable */

import * as Discord from 'discord.js';
import winston from 'winston';
import ICooldowns from '../Interfaces/Cooldowns';
import BotData from '../Interfaces/BotData';
import IDiscordIDs from '../Interfaces/DiscordIDs';
import IBotConfigs from '../Interfaces/BotConfigs';
import IBotUtils from '../Interfaces/BotUtils';
//import { getTheme } from '../Utils/botUtilities';
import { IResource } from '../Services/resourceService';

import Knex from 'knex';
import knexInstance from '../db';


export interface ExtendedClientOptions {
    logger: winston.Logger;
    discordIDs: IDiscordIDs;
    prefix: string;
    botAdminIds: string[];
    botConfigs: IBotConfigs;
    botResponses: any;
    botUtils: IBotUtils;
    repliedUsers: Discord.Collection<string, number>;
}

class ExtendedClient extends Discord.Client {
    commands: Discord.Collection<string, any>;
    slashCommands: Discord.Collection<string, any>;
    contextMenuCommands: Discord.Collection<string, any>;
    use: Discord.Collection<string, any>;
    doxx: Discord.Collection<string, any>;
    forumSpammer: any;
    botData: BotData;
    discordIDs: IDiscordIDs;
    cooldowns: ICooldowns;
    prefix: string;

    logger: winston.Logger;

    botAdminIds: string[];
    botConfigs: IBotConfigs;
    botUtils: IBotUtils;
    botResponses: any;
    botCache: Discord.Collection<string, any>;
    //scheduler: any;
    knexInstance: Knex.Knex;
    repliedUsers: Discord.Collection<string, number>;

    constructor(options: Discord.ClientOptions, extendedOptions: ExtendedClientOptions) {
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
        this.knexInstance = knexInstance;

        this.botData = {
            embeds: require('../../JSON/embeds.json'),
            reactionKeywords: require('../../JSON/reactionKeywords.json'),
            cooldownImmuneUsers: new Discord.Collection<string, any>(),
        };

        this.prefix = extendedOptions.prefix;
        this.discordIDs = extendedOptions.discordIDs;
        this.botAdminIds = extendedOptions.botAdminIds;
        this.botConfigs = extendedOptions.botConfigs;
        this.botResponses = extendedOptions.botResponses;
        this.botUtils = extendedOptions.botUtils;
        this.botCache = new Discord.Collection<string, any>();
        this.repliedUsers = extendedOptions.repliedUsers;

        // cron job
        //this.scheduler = new Scheduler(this);

        // finish setup
        this.setupBot();
    }

    setupBot(): void {
        const devMode = process.env.dev;
        if (!devMode) {
            // when in production environment, send a message on startup to the dev server
            this.botConfigs.messageOnStartup = true;
        }
    }
}

export default ExtendedClient;
