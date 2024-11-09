/* eslint-disable */

import * as Discord from 'discord.js';
import winston from 'winston';
import ICooldowns from '../Interfaces/Cooldowns';
import BotData from '../Interfaces/BotData';
import IDiscordIDs from '../Interfaces/DiscordIDs';
import IBotConfigs from '../Interfaces/BotConfigs';
import IBotUtils from '../Interfaces/BotUtils';

import Knex from 'knex';
import knexInstance from '../db';
import SettingsService from '../Services/settingsService';


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
            reactionKeywords: require('../../JSON/reactionKeywords.json'),
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

        (async () => {
            // add settings to cache
            const settingsService = new SettingsService(this.knexInstance);
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

export default ExtendedClient;
