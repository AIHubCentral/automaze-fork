"use strict";
/* eslint-disable */
// @ts-nocheck
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagResponseSender = exports.CloudPlatform = void 0;
exports.resourcesToUnorderedList = resourcesToUnorderedList;
exports.processResource = processResource;
exports.resourcesToUnorderedListAlt = resourcesToUnorderedListAlt;
exports.processResourceAlt = processResourceAlt;
exports.getResourceData = getResourceData;
exports.getThemeColors = getThemeColors;
exports.getThemes = getThemes;
exports.banan = banan;
const discord_js_1 = require("discord.js");
const discordUtilities_1 = require("./discordUtilities");
const userService_1 = __importDefault(require("../Services/userService"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const fileUtilities_1 = require("./fileUtilities");
const resourcesService_1 = __importDefault(require("../Services/resourcesService"));
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
function resourcesToUnorderedList(resources) {
    const processedResources = [];
    resources.forEach((resource) => {
        const currentLine = processResource(resource);
        processedResources.push(currentLine);
    });
    return (0, discord_js_1.unorderedList)(processedResources);
}
/**
 * Processes a single resource into a formatted string for an unordered list.
 *
 * @param {IResource} resource - The resource object to be processed.
 * @returns {string} - A formatted string representing the resource.
 */
function processResource(resource) {
    const currentLine = [];
    if (resource.emoji && resource.emoji.toLowerCase() != 'none') {
        currentLine.push(`${resource.emoji} `);
    }
    if (resource.displayTitle) {
        currentLine.push((0, discord_js_1.bold)(resource.displayTitle));
        currentLine.push(', ');
    }
    if (resource.authors) {
        currentLine.push(`by ${resource.authors} `);
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
function resourcesToUnorderedListAlt(resources) {
    const processedResources = [];
    resources.forEach((resource) => {
        const currentLine = processResourceAlt(resource);
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
function processResourceAlt(resource) {
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
        currentLine.push(`, by ${(0, discord_js_1.bold)(resource.authors)}`);
    }
    return currentLine.join('');
}
async function getResourceData(queryKey, cache, logger) {
    //const now = Date.now();
    // try to get from cache first
    if (cache.has(queryKey)) {
        const cachedData = cache.get(queryKey) || [];
        return cachedData;
    }
    logger.debug(`Requesting ${queryKey} data from DB`);
    const resourceService = new resourcesService_1.default(logger);
    const resources = await resourceService.findByCategory(queryKey);
    cache.set(queryKey, resources);
    return resources;
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
        this.embeds = (0, discordUtilities_1.createEmbeds)(embeds, getThemeColors(this.client.botConfigs));
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
async function banan(interaction, targetUser, guildMember) {
    const user = interaction.user;
    const client = interaction.client;
    client.logger.debug('executing banan', {
        more: {
            guildId: interaction.guildId,
            channelId: interaction.channelId,
        },
    });
    // check if user is on cooldown
    if (Date.now() <= client.cooldowns.banana.get(user.id)) {
        return interaction.reply(`dumbass yuo alredy banan ppl, wait GRRRRRRRRRRRRRRR!!!!!!!!!!!!!!!!!!!!!!!! yu gto ${client.cooldowns.banana.get(interaction.user.id) - Date.now()} milliseconds left im too lazy to do math do it yourself GRRRRRRRRRR`);
    }
    let member = targetUser;
    const botResponses = client.botResponses.responses.banana;
    let selectedResponse = null;
    // if its true automaze banan the user instead
    let botRevenge = false;
    if (!member)
        return interaction.reply(botResponses.targetNone);
    if (member.bot) {
        const responses = botResponses.targetBot;
        selectedResponse = responses[Math.floor(Math.random() * responses.length)];
        if (!selectedResponse.startsWith('NO,')) {
            return interaction.reply(selectedResponse);
        }
        // change the banan target to the user who tried to banan a bot
        member = interaction.user;
        botRevenge = true;
    }
    /* check if user exists in database, otherwise add it */
    const userService = new userService_1.default(client.knexInstance);
    let userModel = await userService.getById(member.id);
    if (!userModel) {
        client.logger.debug(`User ${member.id} not found in database, creating...`);
        const newUser = {
            id: `${member.id}`,
            userName: member.username,
            displayName: guildMember.displayName ?? guildMember.nickname ?? member.username,
            bananas: 0,
        };
        userModel = await userService.add(newUser);
        client.logger.debug(`${userModel.userName} (${userModel.id}) added to database`);
    }
    // check if display name changed
    if (guildMember.displayName != null && guildMember.displayName !== userModel.displayName) {
        await userService.update(member.id, { display_name: guildMember.nickname ?? member.displayName });
        client.logger.debug(`Added ${guildMember.nickname ?? member.displayName} display name for ${member.username}`);
    }
    /* increment banana count */
    userModel = await userService.incrementBananaCount(member.id);
    if (!userModel) {
        client.logger.error(`Failed to update ${member.username} banan count`);
        return interaction.reply({ content: 'Failed to banan user.', ephemeral: true });
    }
    const embedData = JSON.parse(JSON.stringify(client.botData.embeds.banana));
    embedData.title = embedData.title.replace('$username', guildMember.nickname ?? member.displayName ?? member.username);
    embedData.description[0] = embedData.description[0].replaceAll('$member', member);
    embedData.footer = embedData.footer.replace('$quantity', userModel.bananas);
    if (userModel.bananas > 1) {
        embedData.footer = embedData.footer.replace('TIME', 'TIMES');
    }
    const embed = (0, discordUtilities_1.createEmbed)(embedData, 'Yellow');
    // cooldown expires in 1 minute
    client.cooldowns.banana.set(interaction.user.id, Date.now() + 1 * 60 * 1000);
    if (botRevenge) {
        await interaction.reply(selectedResponse);
        return await interaction.followUp({ embeds: [embed] });
    }
    await interaction.reply({ embeds: [embed] });
    client.logger.debug('Banan', {
        more: {
            targetUserId: targetUser.id,
        },
    });
    if (client.botConfigs.sendLogs &&
        client.botConfigs.debugGuild.id &&
        client.botConfigs.debugGuild.channelId) {
        const embedDescription = [
            `- **Guild**: ${interaction.guildId} (${interaction.guild?.name})`,
            `- **Channel**: ${interaction.channelId}`,
        ];
        const debugEmbed = new discord_js_1.EmbedBuilder()
            .setTitle('Banan')
            .setColor('Yellow')
            .setDescription(embedDescription.join('\n'));
        const guild = await (0, discordUtilities_1.getGuildById)(client.botConfigs.debugGuild.id, client);
        if (!guild)
            return;
        let channel = await (0, discordUtilities_1.getChannelById)(client.botConfigs.debugGuild.channelId, guild);
        if (!channel)
            return;
        channel = channel;
        await channel.send({ embeds: [debugEmbed] });
    }
}
