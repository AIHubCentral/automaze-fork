// Libraries needed
const fs = require('fs');
const path = require('node:path');
const { Collection, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

function getRandomNumber(min, max) {
    /* gets a random number between min and max */
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

exports.getRandomNumber = getRandomNumber;

function getRandomFromArray(arr) {
    /* gets a random value from an array */
    if (arr.length === 0) return null;
    if (arr.length === 1) return arr[0];
    const randomIndex = getRandomNumber(0, arr.length - 1);
    return arr[randomIndex];
}

exports.getRandomFromArray = getRandomFromArray;

function getCommands(basePath, subPath) {
    /* get an array of commands converted to json ready to be sent to discord API */
    const commands = [];

    const foldersPath = path.join(basePath, subPath);
    const commandFolders = fs.readdirSync(foldersPath);

    for (const folder of commandFolders) {
        const commandsPath = path.join(foldersPath, folder);
        const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
        // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            const command = require(filePath);
            if ('data' in command && 'execute' in command) {
                commands.push(command.data.toJSON());
            } else {
                console.log(
                    `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
                );
            }
        }
    }

    return commands;
}

exports.getCommands = getCommands;

function getAvailableColors(configs) {
    return Object.values(configs.colors.theme);
}

exports.getAvailableColors = getAvailableColors;

function saveJSON(filename, data) {
    let success = false;
    const dateString = new Date().toISOString().slice(0, 10);
    const filepath = path.join(process.cwd(), 'Debug', `${filename}-${dateString}.json`);
    try {
        let content = [];
        if (fs.existsSync(filepath)) {
            content = JSON.parse(fs.readFileSync(filepath, 'utf-8'));
        }
        content.push(data);
        fs.writeFileSync(filepath, JSON.stringify(content, null, 4));
        success = true;
    } catch (error) {
        console.log(`Failed to save ${filepath}`);
        console.error(error);
    }
    return success;
}

exports.saveJSON = saveJSON;

const wait = require('node:timers/promises').setTimeout;

class BotResponseBuilder {
    /* utility class for creating bot responses */

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
        const buttons = buttonsData.map((btnData) => {
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

exports.BotResponseBuilder = BotResponseBuilder;

class ResponseSender {
    /* generic class to send the bot response */
    constructor() {
        this.targetMessage = null;
        this.response = new BotResponseBuilder();
        this.isReply = true;
    }

    setTargetMessage(message) {
        this.targetMessage = message;
    }

    setTargetUser(user) {
        if (!user) return;
        this.response.setText(`Suggestion for ${user}`);
    }

    buildResponse() {
        if (!this.response) throw new Error('Empty bot response.');
        this.response = this.response.build();
    }

    async send() {
        this.buildResponse();
        if (this.isReply) {
            await this.targetMessage.reply(this.response);
        } else {
            await this.targetMessage.channel.send(this.response);
        }
    }
}

exports.ResponseSender = ResponseSender;

class LanguageResponseSender extends ResponseSender {
    /* sends different responses using a language based on the channel if available */
    constructor(configs, channels) {
        super();
        this.selectedContent = null;
        this.configs = configs;
        this.channels = channels;
        this.languageChannelResponses = new Collection();
    }

    setTargetUser(user) {
        if (!user) return;
        let mentionMessage = 'Suggestion for $user';
        if (this.selectedContent.mentionMessage) {
            mentionMessage = this.selectedContent.mentionMessage;
        }
        this.response.setText(mentionMessage.replace('$user', user));
    }

    setContent(content) {
        switch (this.targetMessage.channelId) {
            case this.channels.Italiano:
                this.selectedContent = content.it;
                break;
            case this.channels.Spanish:
                this.selectedContent = content.es;
                break;
            case this.channels.French:
                this.selectedContent = content.fr;
                break;
            case this.channels.Portuguese:
                this.selectedContent = content.pt;
                break;
        }

        // defaults to english if not available
        if (!this.selectedContent) {
            this.selectedContent = content.en;
        }

        if (this.selectedContent.embeds) {
            this.response.addEmbeds(this.selectedContent.embeds, this.configs);
        } else {
            this.response.addEmbeds(this.selectedContent, this.configs);
        }

        if (this.selectedContent.buttons) {
            this.response.addButtons(this.selectedContent.buttons);
        }
    }
}

exports.LanguageResponseSender = LanguageResponseSender;

class TagResponseSender {
    /* utility class for sending tags responses like -rvc */

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

    checkChannelType() {
        /* checks if channel is a language channel */
        const channel = this.channel ?? this.message.channel;
        if (!channel) throw new Error('Missing channel.');
        if (this.languageChannelResponses.has(channel.id)) {
            this.responseData = this.languageChannelResponses.get(channel.id);
        }
    }

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
        } else {
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
}

exports.TagResponseSender = TagResponseSender;
