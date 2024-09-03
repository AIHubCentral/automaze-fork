import * as Discord from 'discord.js';
import winston from 'winston';
import ICooldowns from '../Interfaces/Cooldowns';
import BotData from '../Interfaces/BotData';
import IDiscordIDs from '../Interfaces/DiscordIDs';
import { createInstance } from '../Database/dbManager';
import IBotConfigs from '../Interfaces/BotConfigs';
import IBotUtils from '../Interfaces/BotUtils';
import { Scheduler } from '../utils';
import { getThemes } from '../Utils/botUtilities';
import { IResource } from '../Services/resourcesService';

export interface ExtendedClientOptions {
    logger: winston.Logger;
    discordIDs: IDiscordIDs;
    prefix: string;
    botAdminIds: string[];
    botConfigs: IBotConfigs;
    botResponses: any;
    botUtils: IBotUtils;
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
    scheduler: any;
    knexInstance;

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
        this.knexInstance = createInstance(`${process.cwd()}/database/knex.sqlite`);

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

        // cron job
        this.scheduler = new Scheduler(this);

        // finish setup
        this.setupBot();
    }

    loadThemes(): void {
        const themes: any = getThemes();
        const selectedTheme = process.env.theme ?? 'defaultTheme';
        this.botConfigs.colors.theme = themes[selectedTheme];
    }

    setupBot(): void {
        const devMode = process.env.dev;
        if (!devMode) {
            // when in production environment, send a message on startup to the dev server
            this.botConfigs.messageOnStartup = true;
        }
        this.loadThemes();
    }
}

export default ExtendedClient;