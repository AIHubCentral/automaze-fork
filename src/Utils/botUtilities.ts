import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ColorResolvable, EmbedBuilder, Message, TextBasedChannel } from "discord.js";
import IBotConfigs from "../Interfaces/BotConfigs";
import ExtendedClient from "../Core/extendedClient";
import { ButtonData, EmbedData } from "../Interfaces/BotData";
import { createEmbeds } from "./discordUtilities";

export function getThemeColors(botConfigs: IBotConfigs): ColorResolvable[] {
    const colors = [
        botConfigs.colors.theme.primary,
        botConfigs.colors.theme.secondary,
        botConfigs.colors.theme.tertiary,
    ];
    return colors;
}

export class TagResponseSender {
    /* utility class for sending tags responses like -rvc */
    //channel: null | TextBasedChannel;

    client: ExtendedClient;
    embeds: EmbedBuilder[];
    buttons: ButtonBuilder[];
    actionRow: ActionRowBuilder | null;
    channel: TextBasedChannel | null;
    message: Message | null;
    botResponse: any;
    sendAsReply: boolean;

    constructor(client: ExtendedClient) {
        this.client = client;
        this.embeds = [];
        this.buttons = [];
        this.actionRow = null;
        this.channel = null;
        this.message = null;
        this.botResponse = {};
        this.sendAsReply = true;
    }

    setEmbeds(embeds: EmbedData[]): void {
        this.embeds = createEmbeds(embeds, getThemeColors(this.client.botConfigs));
    }

    setButtons(buttonsData: ButtonData[]): void {
        if (!this.actionRow) {
            this.actionRow = new ActionRowBuilder();
        }

        const buttons = buttonsData.map(btnData => {
            return new ButtonBuilder().setLabel(btnData.label).setURL(btnData.url).setStyle(ButtonStyle.Link);
        });

        this.actionRow.addComponents(buttons);
        this.botResponse.components = [this.actionRow];
    }

    config(message: Message): void {
        this.message = message;
        this.channel = message.channel;
    }

    async send(): Promise<any> {
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
    };

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

    /*
    setMentionMessage() {
        if (!this.targetUser) return;
        let mentionMessage = this.mentionMessage;

        if (this.responseData) {
            if (this.responseData.mentionMessage) {
                // use the mention message from JSON if available
                mentionMessage = this.responseData.mentionMessage;
            }
        }

        mentionMessage = mentionMessage.replace('$user', this.targetUser);
        this.response.setText(this.response.text + '\n' + mentionMessage);
    }

    addEmbedsAndButtons() {
        if (!this.responseData) return;

        if (this.responseData.embeds) {
            this.response.addEmbeds(this.responseData.embeds, this.configs);
        }

        if (this.responseData.buttons) {
            this.response.addButtons(this.responseData.buttons);
        }
    }

    async sendResponse() {
        if (this.isReply) {
            await this.message.reply(this.response.build());
        }
        else {
            await this.channel.send(this.response.build());
        }
    }

    async send() {
        if (!this.configs) throw new Error('Missing bot configs.');
        this.checkChannelType();
        this.setMentionMessage();
        this.addEmbedsAndButtons();
        this.sendResponse();
    }
    */
}

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