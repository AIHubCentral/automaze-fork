"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagResponseSender = exports.getThemeColors = void 0;
const discord_js_1 = require("discord.js");
const discordUtilities_1 = require("./discordUtilities");
function getThemeColors(botConfigs) {
    const colors = [
        botConfigs.colors.theme.primary,
        botConfigs.colors.theme.secondary,
        botConfigs.colors.theme.tertiary,
    ];
    return colors;
}
exports.getThemeColors = getThemeColors;
class TagResponseSender {
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
        const buttons = buttonsData.map(btnData => {
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
    ;
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
