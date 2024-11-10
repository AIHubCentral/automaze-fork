"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BananManager = exports.TagResponseSender = exports.CloudPlatform = void 0;
exports.resourcesToUnorderedList = resourcesToUnorderedList;
exports.processResource = processResource;
exports.resourcesToUnorderedListAlt = resourcesToUnorderedListAlt;
exports.processResourceAlt = processResourceAlt;
exports.getFaqKeywords = getFaqKeywords;
exports.getFaqReply = getFaqReply;
exports.processFaqReply = processFaqReply;
exports.containsKeyword = containsKeyword;
exports.containsQuestionPattern = containsQuestionPattern;
exports.isAskingForAssistance = isAskingForAssistance;
exports.isAskingForGirlModel = isAskingForGirlModel;
exports.getResourceData = getResourceData;
exports.getThemeColors = getThemeColors;
exports.getThemes = getThemes;
exports.createPaginatedEmbed = createPaginatedEmbed;
exports.EmbedDataToAPI = EmbedDataToAPI;
exports.handleSendRealtimeGuides = handleSendRealtimeGuides;
exports.getLanguageByChannelId = getLanguageByChannelId;
exports.sendErrorLog = sendErrorLog;
/* eslint-disable @typescript-eslint/no-explicit-any */
const discord_js_1 = require("discord.js");
const discordUtilities_1 = require("./discordUtilities");
const userService_1 = __importDefault(require("../Services/userService"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const fileUtilities_1 = require("./fileUtilities");
const resourceService_1 = __importDefault(require("../Services/resourceService"));
const i18n_1 = __importDefault(require("../i18n"));
const generalUtilities_1 = require("./generalUtilities");
const natural_1 = __importDefault(require("natural"));
const db_1 = __importDefault(require("../db"));
/* Enums */
var CloudPlatform;
(function (CloudPlatform) {
    CloudPlatform["Colab"] = "colab";
    CloudPlatform["Huggingface"] = "hf";
    CloudPlatform["Kaggle"] = "kaggle";
    CloudPlatform["Lightning"] = "lightning_ai";
})(CloudPlatform || (exports.CloudPlatform = CloudPlatform = {}));
/* functions */
/**
 * Converts an array of resources into an unordered list in Markdown format.
 *
 * @param {IResource[]} resources - An array of resource objects to be processed.
 * @returns {string} - A string representing the unordered list in Markdown format.
 */
function resourcesToUnorderedList(resources, language = 'en') {
    const processedResources = [];
    resources.forEach((resource) => {
        const currentLine = processResource(resource, language);
        processedResources.push(currentLine);
    });
    return (0, discord_js_1.unorderedList)(processedResources);
}
/**
 * Processes a single resource into a formatted string for an unordered list.
 *
 * @param {IResource} resource - The resource object to be processed.
 * @param {string} language - A two character language code (defaults to 'en')
 * @returns {string} - A formatted string representing the resource.
 */
function processResource(resource, language = 'en') {
    const currentLine = [];
    if (resource.emoji && resource.emoji.toLowerCase() != 'none') {
        currentLine.push(`${resource.emoji} `);
    }
    if (resource.displayTitle) {
        currentLine.push((0, discord_js_1.bold)(resource.displayTitle));
        currentLine.push(', ');
    }
    if (resource.authors) {
        currentLine.push(`${i18n_1.default.t('general.by', { lng: language })} ${(0, discord_js_1.bold)(resource.authors)} `);
    }
    if (resource.displayTitle) {
        let category = resource.category;
        if (category === CloudPlatform.Colab) {
            category = 'Google Colab';
        }
        else if (category === CloudPlatform.Huggingface) {
            category = 'Huggingface Spaces';
        }
        else if (category === CloudPlatform.Kaggle) {
            category = 'Kaggle';
        }
        else if (category === CloudPlatform.Lightning) {
            category = 'Lightning AI';
        }
        else {
            category = 'Link';
        }
        currentLine.push((0, discord_js_1.hyperlink)(category, resource.url));
    }
    else {
        currentLine.push(resource.url);
    }
    return currentLine.join('');
}
/**
 * Alternative version of `resourcesToUnorderedList()`
 */
function resourcesToUnorderedListAlt(resources, language = 'en') {
    const processedResources = [];
    resources.forEach((resource) => {
        const currentLine = processResourceAlt(resource, language);
        processedResources.push(currentLine);
    });
    return (0, discord_js_1.unorderedList)(processedResources);
}
/**
 * Processes a single resource into a formatted string for an unordered list.
 * Alternative version of processResource()
 *
 * @param {IResource} resource - The resource object to be processed.
 * @returns {string} - A formatted string representing the resource.
 */
function processResourceAlt(resource, language = 'en') {
    const currentLine = [];
    if (resource.emoji && resource.emoji.toLowerCase() != 'none') {
        currentLine.push(`${resource.emoji} `);
    }
    if (resource.displayTitle) {
        currentLine.push((0, discord_js_1.hyperlink)(resource.displayTitle, resource.url));
    }
    else {
        currentLine.push(resource.url);
    }
    if (resource.authors) {
        currentLine.push(`, ${i18n_1.default.t('general.by', { lng: language })} ${(0, discord_js_1.bold)(resource.authors)}`);
    }
    return currentLine.join('');
}
function getFaqKeywords() {
    return [
        'cuda',
        'epoch',
        'epochs',
        'dataset',
        'datasets',
        'gradient',
        'gradio',
        'hubert',
        'index',
        'inference',
        'overtraining',
    ];
}
/**
 * Attempt to get a FAQ answer
 * @param keyword - The keyword to look for
 * @returns TranslationResult or null if not found
 */
function getFaqReply(keyword) {
    let stemmedKeyword = natural_1.default.PorterStemmer.stem(keyword);
    if (stemmedKeyword === 'infer') {
        stemmedKeyword = 'inference';
    }
    else if (stemmedKeyword === 'overtrain') {
        stemmedKeyword = 'overtraining';
    }
    const responseData = i18n_1.default.t(`faq.topics.${stemmedKeyword}`, {
        returnObjects: true,
    });
    if (typeof responseData === 'string' && responseData.startsWith('faq.topics'))
        return null;
    return responseData;
}
function processFaqReply(responseData) {
    const embed = new discord_js_1.EmbedBuilder().setColor(discord_js_1.Colors.LightGrey);
    const botResponse = { embeds: [embed], allowedMentions: { repliedUser: true } };
    const processedTranslation = (0, generalUtilities_1.processTranslation)(responseData);
    if (typeof processedTranslation === 'string') {
        embed.setDescription(processedTranslation);
    }
    else {
        if (processedTranslation.title) {
            embed.setTitle(processedTranslation.title);
        }
        if (processedTranslation.description) {
            embed.setDescription(processedTranslation.description.join('\n'));
        }
        if (processedTranslation.footer) {
            embed.setFooter({ text: processedTranslation.footer });
        }
        if (processedTranslation.buttons) {
            botResponse.components = [(0, discordUtilities_1.createButtons)(processedTranslation.buttons)];
        }
    }
    return botResponse;
}
/**
 * Checks if a keyword was found in the tokens and returns the matched keyword if found
 * @param tokens - array of tokens
 * @param keywords - array of keywords
 * @returns the matched keyword if found or null
 */
function containsKeyword(tokens, keywords) {
    for (const keyword of keywords) {
        if (tokens.includes(keyword.toLowerCase())) {
            return keyword;
        }
    }
    return null;
}
/**
 * Checks for the patterns to check if user is asking a faq question
 *
 * @param text {string} - the text to look for the pattern
 * @returns {boolean} - whether it matches the question pattern
 */
function containsQuestionPattern(text) {
    const patterns = [
        /what (?:is|are)(?:\s)?(?:a|an)? \b\w+\b/i,
        /not sure what \b\w+\b (?:is|are)/i,
        /(?:can)?(?:\s)?(?:you|anyone|someone) (?:explain|tell|teach) (?:to )?(?:me )?(?:what )?\b\w+\b (?:is|are|means)/i,
        /anyone knows what \b\w+\b (?:is|are)/i,
        /i(?:dk|\sdon't)(?:\s)?(?:know)? what \b\w+\b (?:is|are|means)/i,
        /is that what \b\w+\b is/i,
    ];
    return patterns.some((pattern) => pattern.test(text));
}
function isAskingForAssistance(text) {
    const patterns = [
        /(?:can|please)?(?:\s)?(?:you|someone|anyone) help(?:\s)?(?:me)?/i,
        /(?:i|it|its|it's)?(?:\s)?(?:got|givin|giving|showing)(?:\s)(?:a|an|some)?(?:\s)?error(?:s)?/i,
        /can i ask(?:\s)?(?:you)? (?:something|somethin|somethin')/i,
    ];
    return patterns.some((pattern) => pattern.test(text));
}
function isAskingForGirlModel(text) {
    const pattern = /(?=.*(girl|female))(?=.*(voice|model))/i;
    return pattern.test(text);
}
async function getResourceData(queryKey, cache, logger) {
    // try to get from cache first
    if (cache.has(queryKey)) {
        const cachedData = cache.get(queryKey) || [];
        return cachedData;
    }
    logger.debug(`Requesting ${queryKey} data from DB`);
    const resourceService = new resourceService_1.default(db_1.default);
    const resources = await resourceService.findAll({
        filter: { column: 'category', value: queryKey },
    });
    cache.set(queryKey, resources.data);
    return resources.data;
}
function getThemeColors(botConfigs) {
    const colors = [
        botConfigs.colors.theme.primary,
        botConfigs.colors.theme.secondary,
        botConfigs.colors.theme.tertiary,
    ];
    return colors;
}
function getThemes() {
    const themes = {};
    const themesDirectory = path_1.default.join(process.cwd(), 'JSON', 'themes');
    const themeFiles = (0, fileUtilities_1.getAllFiles)(themesDirectory).filter((file) => path_1.default.extname(file) === '.json');
    themeFiles.forEach((filePath) => {
        const themeData = fs_1.default.readFileSync(filePath).toString();
        // remove .json extension from file name
        const themeName = path_1.default.parse(filePath).name;
        themes[themeName] = JSON.parse(themeData);
    });
    return themes;
}
function createPaginatedEmbed(data, currentPage, totalPages) {
    return new discord_js_1.EmbedBuilder()
        .setTitle(`All Resources`)
        .setColor(discord_js_1.Colors.Greyple)
        .setDescription(data
        .map((record) => {
        const result = [
            `- **ID**: ${record.id} |`,
            `. **URL**: [Link](${record.url})`,
            ` | **Category**: ${record.category}`,
        ];
        if (record.displayTitle) {
            result.push(` | **Title**: ${record.displayTitle}`);
        }
        if (record.authors) {
            result.push(` | **Authors**: ${record.authors}`);
        }
        if (record.emoji && record.emoji != '' && record.emoji.toLowerCase() != 'none') {
            result.push(` | **Emoji**: ${record.authors}`);
        }
        return result.join('');
    })
        .join('\n'))
        .setFooter({ text: `Page ${currentPage} of ${totalPages}` });
}
/* Classes */
class TagResponseSender {
    /* utility class for sending tags responses like -rvc */
    //channel: null | TextBasedChannel;
    client;
    embeds;
    buttons;
    actionRow;
    channel;
    message;
    botResponse;
    sendAsReply;
    constructor(client) {
        this.client = client;
        this.embeds = [];
        this.buttons = [];
        this.actionRow = null;
        this.channel = null;
        this.message = null;
        this.botResponse = {};
        this.sendAsReply = true;
    }
    setEmbeds(embeds) {
        this.embeds = embeds;
    }
    setButtons(buttonsData) {
        if (!this.actionRow) {
            this.actionRow = new discord_js_1.ActionRowBuilder();
        }
        const buttons = buttonsData.map((btnData) => {
            return new discord_js_1.ButtonBuilder().setLabel(btnData.label).setURL(btnData.url).setStyle(discord_js_1.ButtonStyle.Link);
        });
        this.actionRow.addComponents(buttons);
        this.botResponse.components = [this.actionRow];
    }
    config(message) {
        this.message = message;
        this.channel = message.channel;
    }
    async send() {
        if (!this.channel || !this.message) {
            this.client.logger.error('Failed to send embed because the channel or message was not set');
            return;
        }
        if (this.embeds.length > 0) {
            this.botResponse.embeds = this.embeds;
        }
        const mentionedUser = this.message.mentions.members?.first();
        if (mentionedUser) {
            this.botResponse.content = `Suggestions for ${mentionedUser}`;
        }
        if (this.sendAsReply) {
            await this.message.reply(this.botResponse);
        }
        else {
            await this.channel.send(this.botResponse);
        }
    }
    /*
    constructor() {
        this.channel = null;
        this.response = new BotResponseBuilder();
        this.responseData = null;
        this.configs = null;
        this.guides = null;
        this.targetUser = null;
        this.languageChannelResponses = new Collection();
        this.isReply = false;
        this.mentionMessage = 'Suggestion for $user';
    }

    setChannel(channel) {
        this.channel = channel;
    }

    setDefaultResponse(responseData) {
        this.responseData = responseData;
    }

    setResponse(response) {
        this.response = response;
    }

    setConfigs(configs) {
        this.configs = configs;
    }

    setGuides(guides) {
        this.guides = guides;
    }

    setTargetUser(user) {
        if (user) {
            this.targetUser = user;
        }
    }

    setTargetMessage(message) {
        this.message = message;
        this.isReply = true;
    }
    */
    checkChannelType() {
        /* checks if channel is a language channel */
        /*
        const channel = this.channel ?? this.message.channel;
        if (!channel) throw new Error('Missing channel.');
        if (this.languageChannelResponses.has(channel.id)) {
            this.responseData = this.languageChannelResponses.get(channel.id);
        }
        */
    }
}
exports.TagResponseSender = TagResponseSender;
/*
class BotResponseBuilder {
    /* utility class for creating bot responses */
/*
constructor() {
    this.text = '';
    this.ephemeral = false;
    this.embeds = [];
    this.components = [];
}

setText(text) {
    this.text = text;
}

setEphemeral(isEphemeral) {
    this.ephemeral = isEphemeral;
}

addEmbeds(embedsData, configs) {
    // color theme to use on the embeds
    const availableColors = getAvailableColors(configs);
    this.embeds = createEmbeds(embedsData, availableColors);
}

addButtons(buttonsData) {
    const buttons = buttonsData.map(btnData => {
        return new ButtonBuilder().setLabel(btnData.label).setURL(btnData.url).setStyle(ButtonStyle.Link);
    });
    const actionRow = new ActionRowBuilder().addComponents(buttons);
    this.components.push(actionRow);
}

build() {
    const response = { content: this.text, ephemeral: this.ephemeral };
    if (this.embeds.length) {
        response.embeds = this.embeds;
    }
    if (this.components.length) {
        response.components = this.components;
    }
    return response;
}
}
*/
class BananManager {
    knex;
    authorId;
    cooldownCollection;
    embed;
    service;
    /**
     *
     * @param authorId {string} - Who used the command
     * @param cooldownCollection - Collection to store banan cooldowns
     */
    constructor(knex, authorId, cooldownCollection) {
        this.knex = knex;
        this.authorId = authorId;
        this.cooldownCollection = cooldownCollection;
        this.embed = new discord_js_1.EmbedBuilder().setColor(discord_js_1.Colors.Yellow);
        this.service = new userService_1.default(this.knex);
    }
    /**
     * Checks if the author of the command is on cooldown
     * @returns boolean
     */
    isAuthorOnCooldown() {
        const result = this.cooldownCollection.get(this.authorId);
        if (result)
            return true;
        return false;
    }
    addAuthorCooldown() {
        if (this.isAuthorOnCooldown())
            return;
        this.cooldownCollection.set(this.authorId, Date.now());
    }
    removeAuthorCooldown() {
        if (this.isAuthorOnCooldown()) {
            this.cooldownCollection.delete(this.authorId);
        }
    }
    /**
     * Checks if cooldown has expired
     * Cooldown lasts for 15 minutes
     */
    isCooldownExpired() {
        const timestamp = this.cooldownCollection.get(this.authorId);
        if (!timestamp)
            return true;
        const expireMinutes = 15;
        const minutesInMs = expireMinutes * 60 * 1000;
        return Date.now() > timestamp + minutesInMs;
    }
    /**
     * Increment banana count given a user id
     */
    async incrementCounter(userId) {
        await this.knex('users').where({ id: userId }).increment('bananas', 1);
        const updatedRow = await this.knex('users').where({ id: userId }).first();
        return updatedRow['bananas'];
    }
    async clearCounter(userId) {
        // check if user exists in database
        const fetchedUser = await this.service.find(userId);
        if (!fetchedUser)
            return;
        await this.service.update(userId, { bananas: 0 });
    }
    /**
     * Increments banana counter and constructs the final embed
     */
    async banan(targetUser) {
        // remove author from cooldown if it's expired
        if (this.isCooldownExpired()) {
            this.removeAuthorCooldown();
        }
        // check if target user is in database
        let fetchedUser = await this.service.find(targetUser.id);
        // otherwise create it
        if (!fetchedUser) {
            await this.service.create(targetUser);
            fetchedUser = await this.service.find(targetUser.id);
            if (!fetchedUser)
                throw new Error(`Couldn't add user with id ${targetUser.id}`);
        }
        else {
            // if already exists and display name changed, update the new display name in database
            if (fetchedUser.display_name !== targetUser.display_name) {
                await this.service.update(targetUser.id, { display_name: targetUser.display_name });
                fetchedUser.display_name = targetUser.display_name;
            }
        }
        // increment counter
        const bananaCounter = await this.incrementCounter(targetUser.id);
        // add author to cooldown
        this.addAuthorCooldown();
        // construct the embed and return it
        const embedDescriptionLines = [];
        for (let i = 1; i <= 3; i++) {
            embedDescriptionLines.push(`HEY YOU ${(0, discord_js_1.userMention)(targetUser.id)} YOU FUCKING GOT BANAN LMFAOOOOOOOOO`);
        }
        this.embed.setTitle(`${fetchedUser.display_name.length ? fetchedUser.display_name : fetchedUser.username} GOT BANANA LOL LOL LOL`);
        this.embed.setDescription(embedDescriptionLines.join('\n'));
        this.embed.setImage('https://media.tenor.com/29FOpiFsnn8AAAAC/banana-meme.gif');
        this.embed.setFooter({
            text: `BRO GOT BANAN'D ${bananaCounter > 1 ? bananaCounter + ' TIMES' : 'ONCE'} XDDDDDD`,
        });
        return this.embed;
    }
}
exports.BananManager = BananManager;
/**
 * Converts custom EmbedData type to APIEmbed
 */
function EmbedDataToAPI(oldData) {
    const convertedData = {};
    if (oldData.title) {
        convertedData.title = oldData.title;
    }
    if (oldData.description) {
        convertedData.description = oldData.description.join('\n');
    }
    if (oldData.footer) {
        convertedData.footer = { text: oldData.footer };
    }
    return convertedData;
}
function createMenuOptions(availableOptions) {
    const menuOptions = [];
    for (const option of availableOptions ?? []) {
        const optionBuilder = new discord_js_1.StringSelectMenuOptionBuilder()
            .setLabel(option.label)
            .setDescription(option.description)
            .setValue(option.value);
        if (option.emoji) {
            optionBuilder.setEmoji(option.emoji);
        }
        menuOptions.push(optionBuilder);
    }
    return menuOptions;
}
async function handleSendRealtimeGuides(message, targetUser, author, ephemeral = false, language = 'en') {
    const realtimeSelectOptions = i18n_1.default.t('tags.realtime.menuOptions', {
        lng: language,
        returnObjects: true,
    });
    // selects local RVC by default
    const selectedGuide = i18n_1.default.t('tags.realtime.local', {
        lng: language,
        returnObjects: true,
    });
    const menuOptions = createMenuOptions(realtimeSelectOptions);
    const menuId = `realtime_${(0, generalUtilities_1.generateRandomId)(6)}`;
    const realtimeGuidesSelectMenu = new discord_js_1.StringSelectMenuBuilder()
        .setCustomId(menuId)
        .setPlaceholder(i18n_1.default.t('tags.realtime.placeholder', { lng: language }))
        .addOptions(menuOptions);
    const row = new discord_js_1.ActionRowBuilder().addComponents(realtimeGuidesSelectMenu);
    let embeds = selectedGuide.embeds.map((item) => (0, discordUtilities_1.createEmbed)(item));
    const botResponse = {
        embeds,
        components: [row],
        content: '',
        ephemeral,
    };
    const selectMenuDisplayMinutes = 14; // allow interaction with the select menu for 14 minutes
    const mainUser = author;
    if (targetUser) {
        botResponse.content = i18n_1.default.t('general.suggestions_for_user', {
            userId: targetUser.id,
            lng: language,
        });
    }
    const botReply = await message.reply(botResponse);
    const currentChannel = message.channel;
    const filter = (i) => i.isStringSelectMenu() && i.customId === menuId;
    const collector = currentChannel.createMessageComponentCollector({
        filter,
        time: selectMenuDisplayMinutes * 60 * 1000,
    });
    collector.on('collect', async (i) => {
        let allowedToInteract = i.user.id === mainUser.id;
        // The mentioned user also can interact with the menu instead of only the user who used the command
        if (targetUser) {
            allowedToInteract = i.user.id === mainUser.id || i.user.id === targetUser.id;
        }
        if (allowedToInteract) {
            await i.deferUpdate();
            const selectMenuResult = i.values[0];
            const guideEmbeds = i18n_1.default.t(`tags.realtime.${selectMenuResult}.embeds`, {
                returnObjects: true,
                lng: language,
            });
            if (targetUser) {
                botResponse.content = i18n_1.default.t('general.suggestions_for_user', {
                    userId: targetUser.id,
                    lng: language,
                });
            }
            embeds = guideEmbeds.map((item) => (0, discordUtilities_1.createEmbed)(item));
            botResponse.embeds = embeds;
            i.editReply(botResponse);
        }
        else {
            i.reply({
                content: i18n_1.default.t('tags.realtime.not_allowed_to_interact', { lng: i.locale }),
                ephemeral: true,
            });
        }
    });
    collector.on('end', () => {
        botResponse.content = i18n_1.default.t('tags.realtime.expired', { lng: language });
        botResponse.embeds[0].setColor(discord_js_1.Colors.Red);
        botResponse.components = [];
        botReply.edit(botResponse);
    });
}
/**
 * Maps a channel ID to its corresponding language code.
 * If the channel ID is not found in the predefined language mappings,
 * the default language code 'en' (English) is returned.
 *
 * @param {string} channelId - The ID of the Discord channel.
 * @returns {string} The corresponding language code for the channel, or 'en' if not found.
 */
function getLanguageByChannelId(channelId) {
    const languages = {
        '1159369117854347276': 'es',
        '1159291287430778933': 'it',
        '1159572045043081247': 'pt',
    };
    return languages[channelId] || 'en';
}
/**
 * Sends error log to the debug guild
 * @param client Discord client
 */
async function sendErrorLog(client, errorData, extraInfo) {
    const settings = client.botCache.get('settings');
    if (!settings)
        return;
    if (!settings.send_logs)
        return;
    if (!settings.debug_guild_id || !settings.debug_guild_channel_id)
        return;
    const debugGuild = await (0, discordUtilities_1.getGuildById)(settings.debug_guild_id, client);
    if (!debugGuild)
        return;
    const debugChannel = await (0, discordUtilities_1.getChannelById)(settings.debug_guild_channel_id, debugGuild);
    if (!debugChannel)
        return;
    const targetChannel = debugChannel;
    const description = JSON.stringify(errorData, null, 4);
    const originalGuild = await (0, discordUtilities_1.getGuildById)(extraInfo.guildId, client);
    const originalGuildName = originalGuild ? originalGuild.name : extraInfo.guildId;
    const embedData = {
        color: discord_js_1.Colors.Red,
        title: 'Errored',
        fields: [
            {
                name: 'Guild',
                value: originalGuildName,
                inline: true,
            },
            { name: 'Channel', value: extraInfo.channelId, inline: true },
            { name: 'URL', value: (0, discord_js_1.channelLink)(extraInfo.channelId, extraInfo.guildId), inline: false },
            { name: 'Description', value: extraInfo.message, inline: false },
        ],
        // Trim description to 3000 characters
        description: description.length > 3_000 ? description.substring(0, 3_000) + '...' : description,
        footer: { text: `Command: ${extraInfo.command}` },
    };
    const logger = client.logger;
    if (errorData instanceof discord_js_1.DiscordAPIError) {
        embedData.title = 'Discord API Error';
        embedData.description = (0, discord_js_1.blockQuote)(errorData.message);
        embedData.fields?.push({ name: 'Code', value: String(errorData.code), inline: true });
        embedData.fields?.push({ name: 'Method', value: errorData.method, inline: true });
        embedData.fields?.push({ name: 'Status', value: String(errorData.status), inline: true });
        logger.error(errorData.message, errorData);
    }
    else if (errorData instanceof Error) {
        embedData.title = `Error: ${errorData.name}`;
        embedData.description = (0, discord_js_1.blockQuote)(errorData.message);
        embedData.fields?.push({ name: 'Stack', value: JSON.stringify(errorData, null, 4), inline: false });
        logger.error(errorData.message, errorData);
    }
    const embed = new discord_js_1.EmbedBuilder(embedData).setTimestamp();
    await targetChannel.send({ embeds: [embed] });
}
