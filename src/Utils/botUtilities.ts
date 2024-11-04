/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    ActionRowBuilder,
    bold,
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction,
    Collection,
    ColorResolvable,
    Colors,
    EmbedBuilder,
    GuildMember,
    hyperlink,
    Interaction,
    InteractionUpdateOptions,
    Message,
    MessageEditOptions,
    MessageReplyOptions,
    StringSelectMenuBuilder,
    StringSelectMenuInteraction,
    StringSelectMenuOptionBuilder,
    TextChannel,
    unorderedList,
    User,
    UserContextMenuCommandInteraction,
} from 'discord.js';
import IBotConfigs from '../Interfaces/BotConfigs';
import ExtendedClient from '../Core/extendedClient';
import { ButtonData, EmbedData, SelectMenuData, SelectMenuOption } from '../Interfaces/BotData';
import { createButtons, createEmbed, createEmbeds, getChannelById, getGuildById } from './discordUtilities';
import { createUser, getUser, incrementBananaCount, updateUser, UserDTO } from '../Services/userService';
import path from 'path';
import fs from 'fs';
import { getAllFiles } from './fileUtilities';
import ResourceService, { IResource } from '../Services/resourcesService';
import winston from 'winston';
import i18next from '../i18n';
import { generateRandomId, processTranslation, TranslationResult } from './generalUtilities';
import natural from 'natural';
//import cron, { ScheduledTask } from 'node-cron';

import Knex from 'knex';
import knexInstance from '../db';

/* Enums */
export enum CloudPlatform {
    Colab = 'colab',
    Huggingface = 'hf',
    Kaggle = 'kaggle',
    Lightning = 'lightning_ai',
}

/* functions */

/**
 * Converts an array of resources into an unordered list in Markdown format.
 *
 * @param {IResource[]} resources - An array of resource objects to be processed.
 * @returns {string} - A string representing the unordered list in Markdown format.
 */
export function resourcesToUnorderedList(resources: IResource[], language: string = 'en'): string {
    const processedResources: string[] = [];

    resources.forEach((resource) => {
        const currentLine = processResource(resource, language);
        processedResources.push(currentLine);
    });

    return unorderedList(processedResources);
}

/**
 * Processes a single resource into a formatted string for an unordered list.
 *
 * @param {IResource} resource - The resource object to be processed.
 * @param {string} language - A two character language code (defaults to 'en')
 * @returns {string} - A formatted string representing the resource.
 */
export function processResource(resource: IResource, language: string = 'en'): string {
    const currentLine: string[] = [];

    if (resource.emoji && resource.emoji.toLowerCase() != 'none') {
        currentLine.push(`${resource.emoji} `);
    }

    if (resource.displayTitle) {
        currentLine.push(bold(resource.displayTitle));
        currentLine.push(', ');
    }

    if (resource.authors) {
        currentLine.push(`${i18next.t('general.by', { lng: language })} ${bold(resource.authors)} `);
    }

    if (resource.displayTitle) {
        let category = resource.category;

        if (category === CloudPlatform.Colab) {
            category = 'Google Colab';
        } else if (category === CloudPlatform.Huggingface) {
            category = 'Huggingface Spaces';
        } else if (category === CloudPlatform.Kaggle) {
            category = 'Kaggle';
        } else if (category === CloudPlatform.Lightning) {
            category = 'Lightning AI';
        } else {
            category = 'Link';
        }

        currentLine.push(hyperlink(category, resource.url));
    } else {
        currentLine.push(resource.url);
    }

    return currentLine.join('');
}

/**
 * Alternative version of `resourcesToUnorderedList()`
 */
export function resourcesToUnorderedListAlt(resources: IResource[], language: string = 'en'): string {
    const processedResources: string[] = [];

    resources.forEach((resource) => {
        const currentLine = processResourceAlt(resource, language);
        processedResources.push(currentLine);
    });

    return unorderedList(processedResources);
}

/**
 * Processes a single resource into a formatted string for an unordered list.
 * Alternative version of processResource()
 *
 * @param {IResource} resource - The resource object to be processed.
 * @returns {string} - A formatted string representing the resource.
 */
export function processResourceAlt(resource: IResource, language: string = 'en'): string {
    const currentLine: string[] = [];

    if (resource.emoji && resource.emoji.toLowerCase() != 'none') {
        currentLine.push(`${resource.emoji} `);
    }

    if (resource.displayTitle) {
        currentLine.push(hyperlink(resource.displayTitle, resource.url));
    } else {
        currentLine.push(resource.url);
    }

    if (resource.authors) {
        currentLine.push(`, ${i18next.t('general.by', { lng: language })} ${bold(resource.authors)}`);
    }

    return currentLine.join('');
}

export function getFaqKeywords(): string[] {
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
export function getFaqReply(keyword: string): TranslationResult | null {
    let stemmedKeyword = natural.PorterStemmer.stem(keyword);

    if (stemmedKeyword === 'infer') {
        stemmedKeyword = 'inference';
    } else if (stemmedKeyword === 'overtrain') {
        stemmedKeyword = 'overtraining';
    }

    const responseData = i18next.t(`faq.topics.${stemmedKeyword}`, {
        returnObjects: true,
    }) as TranslationResult;
    if (typeof responseData === 'string' && responseData.startsWith('faq.topics')) return null;
    return responseData;
}

export function processFaqReply(responseData: TranslationResult): MessageReplyOptions {
    const embed = new EmbedBuilder().setColor(Colors.LightGrey);
    const botResponse: MessageReplyOptions = { embeds: [embed], allowedMentions: { repliedUser: true } };
    const processedTranslation = processTranslation(responseData);

    if (typeof processedTranslation === 'string') {
        embed.setDescription(processedTranslation);
    } else {
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
            botResponse.components = [createButtons(processedTranslation.buttons)];
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
export function containsKeyword(tokens: string[], keywords: string[]): string | null {
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
export function containsQuestionPattern(text: string): boolean {
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

export function isAskingForAssistance(text: string): boolean {
    const patterns = [
        /(?:can|please)?(?:\s)?(?:you|someone|anyone) help(?:\s)?(?:me)?/i,
        /(?:i|it|its|it's)?(?:\s)?(?:got|givin|giving|showing)(?:\s)(?:a|an|some)?(?:\s)?error(?:s)?/i,
        /can i ask(?:\s)?(?:you)? (?:something|somethin|somethin')/i,
    ];
    return patterns.some((pattern) => pattern.test(text));
}

export function isAskingForGirlModel(text: string): boolean {
    const pattern = /(?=.*(girl|female))(?=.*(voice|model))/i;
    return pattern.test(text);
}

export async function getResourceData(
    queryKey: string,
    cache: Collection<string, IResource[]>,
    logger: winston.Logger
): Promise<IResource[]> {
    //const now = Date.now();

    // try to get from cache first
    if (cache.has(queryKey)) {
        const cachedData = cache.get(queryKey) || [];
        return cachedData;
    }

    logger.debug(`Requesting ${queryKey} data from DB`);

    const resourceService = new ResourceService(logger);

    const resources = await resourceService.findByCategory(queryKey);
    cache.set(queryKey, resources);

    return resources;
}

export function getThemeColors(botConfigs: IBotConfigs): ColorResolvable[] {
    const colors = [
        botConfigs.colors.theme.primary,
        botConfigs.colors.theme.secondary,
        botConfigs.colors.theme.tertiary,
    ];
    return colors;
}

export function getThemes() {
    const themes: { [key: string]: string } = {};
    const themesDirectory = path.join(process.cwd(), 'JSON', 'themes');
    const themeFiles = getAllFiles(themesDirectory).filter((file) => path.extname(file) === '.json');
    themeFiles.forEach((filePath) => {
        const themeData = fs.readFileSync(filePath).toString();
        // remove .json extension from file name
        const themeName = path.parse(filePath).name;
        themes[themeName] = JSON.parse(themeData);
    });
    return themes;
}

export async function getPaginatedData(
    page: number,
    resourceService: ResourceService,
    filter?: { column: string; value: string }
): Promise<any> {
    const perPage = 10;
    const offset = (page - 1) * perPage;
    const { data, counter } = await resourceService.getPaginatedResult(offset, perPage, filter);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const totalPages = Math.ceil(counter.count / perPage);
    return { data, totalPages };
}

export function createPaginatedEmbed(data: any, currentPage: number, totalPages: number): EmbedBuilder {
    return new EmbedBuilder()
        .setTitle(`All Resources`)
        .setColor(Colors.Greyple)
        .setDescription(
            data
                .map((record: any) => {
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
                .join('\n')
        )
        .setFooter({ text: `Page ${currentPage} of ${totalPages}` });
}

/* Classes */

export class TagResponseSender {
    /* utility class for sending tags responses like -rvc */
    //channel: null | TextBasedChannel;

    client: ExtendedClient;
    embeds: EmbedBuilder[];
    buttons: ButtonBuilder[];

    actionRow: any;
    channel: TextChannel | null;
    message: Message | null;
    botResponse: MessageReplyOptions;
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

        const buttons = buttonsData.map((btnData) => {
            return new ButtonBuilder().setLabel(btnData.label).setURL(btnData.url).setStyle(ButtonStyle.Link);
        });

        this.actionRow.addComponents(buttons);
        this.botResponse.components = [this.actionRow];
    }

    config(message: Message): void {
        this.message = message;
        this.channel = message.channel as TextChannel;
    }

    async send(): Promise<unknown> {
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
        } else {
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

export async function banan(
    interaction: ChatInputCommandInteraction | UserContextMenuCommandInteraction,
    targetUser: User,
    guildMember: GuildMember
): Promise<any> {
    const user = interaction.user;
    const client = interaction.client as ExtendedClient;

    client.logger.debug('executing banan', {
        more: {
            guildId: interaction.guildId,
            channelId: interaction.channelId,
        },
    });

    // check if user is on cooldown
    if (Date.now() <= client.cooldowns.banana.get(user.id)) {
        return interaction.reply(
            `dumbass yuo alredy banan ppl, wait GRRRRRRRRRRRRRRR!!!!!!!!!!!!!!!!!!!!!!!! yu gto ${client.cooldowns.banana.get(interaction.user.id) - Date.now()} milliseconds left im too lazy to do math do it yourself GRRRRRRRRRR`
        );
    }

    let member = targetUser;
    const botResponses = client.botResponses.responses.banana;
    let selectedResponse = null;

    // if its true automaze banan the user instead
    let botRevenge = false;

    if (!member) return interaction.reply(botResponses.targetNone);

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
    let userModel = await getUser(knexInstance, member.id);

    if (!userModel) {
        client.logger.debug(`User ${member.id} not found in database, creating...`);
        const newUser: UserDTO = {
            id: `${member.id}`,
            username: member.username,
            display_name: guildMember.displayName ?? guildMember.nickname ?? member.username,
            bananas: 0,
        };

        await createUser(knexInstance, newUser);

        userModel = await getUser(knexInstance, newUser.id);

        if (userModel) {
            client.logger.debug(`${userModel.username} (${userModel.id}) added to database`);
        }
    }

    // check if display name changed
    if (userModel && guildMember.displayName != null && guildMember.displayName !== userModel.display_name) {
        await updateUser(knexInstance, member.id, {
            display_name: guildMember.nickname ?? member.displayName,
        });
        client.logger.debug(
            `Added ${guildMember.nickname ?? member.displayName} display name for ${member.username}`
        );
    }

    /* increment banana count */

    userModel = await incrementBananaCount(knexInstance, member.id);

    if (!userModel) {
        client.logger.error(`Failed to update ${member.username} banan count`);
        return interaction.reply({ content: 'Failed to banan user.', ephemeral: true });
    }

    const embedData = JSON.parse(JSON.stringify(client.botData.embeds.banana));
    embedData.title = embedData.title.replace(
        '$username',
        guildMember.nickname ?? member.displayName ?? member.username
    );
    embedData.description[0] = embedData.description[0].replaceAll('$member', member);
    embedData.footer = embedData.footer.replace('$quantity', userModel.bananas);

    if (userModel.bananas && userModel.bananas > 1) {
        embedData.footer = embedData.footer.replace('TIME', 'TIMES');
    }

    const embed = createEmbed(embedData, 'Yellow');

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

    if (
        client.botConfigs.sendLogs &&
        client.botConfigs.debugGuild.id &&
        client.botConfigs.debugGuild.channelId
    ) {
        const embedDescription = [
            `- **Guild**: ${interaction.guildId} (${interaction.guild?.name})`,
            `- **Channel**: ${interaction.channelId}`,
        ];
        const debugEmbed = new EmbedBuilder()
            .setTitle('Banan')
            .setColor('Yellow')
            .setDescription(embedDescription.join('\n'));

        const guild = await getGuildById(client.botConfigs.debugGuild.id, client);
        if (!guild) return;

        const channel = await getChannelById(client.botConfigs.debugGuild.channelId, guild);
        if (!channel) return;

        await (channel as TextChannel).send({ embeds: [debugEmbed] });
    }
}

export class BananManager {
    knex: Knex.Knex;
    authorId: string;
    cooldownCollection: Collection<string, number>;
    embed: EmbedBuilder;

    /**
     *
     * @param authorId {string} - Who used the command
     * @param cooldownCollection - Collection to store banan cooldowns
     */
    constructor(knex: Knex.Knex, authorId: string, cooldownCollection: Collection<string, number>) {
        this.knex = knex;
        this.authorId = authorId;
        this.cooldownCollection = cooldownCollection;
        this.embed = new EmbedBuilder().setColor(Colors.Yellow);
    }

    /**
     * Checks if the author of the command is on cooldown
     * @returns boolean
     */
    isAuthorOnCooldown(): boolean {
        const result = this.cooldownCollection.get(this.authorId);
        if (result) return true;
        return false;
    }

    addAuthorCooldown(): void {
        if (this.isAuthorOnCooldown()) return;
        this.cooldownCollection.set(this.authorId, Date.now());
    }

    removeAuthorCooldown(): void {
        if (this.isAuthorOnCooldown()) {
            this.cooldownCollection.delete(this.authorId);
        }
    }

    /**
     * Checks if cooldown has expired
     * Cooldown lasts for 15 minutes
     */
    isCooldownExpired(): boolean {
        const timestamp = this.cooldownCollection.get(this.authorId);
        if (!timestamp) return true;

        const expireMinutes = 15;
        const minutesInMs = expireMinutes * 60 * 1000;

        return Date.now() > timestamp + minutesInMs;
    }

    /**
     * Increment banana count
     */
    async incrementCounter(): Promise<number> {
        await this.knex('users').where({ id: this.authorId }).increment('bananas', 1);

        const updatedRow = await this.knex('users').where({ id: this.authorId }).first();
        return updatedRow['bananas'];
    }

    async clearCounter(userId: string): Promise<void> {
        // check if user exists in database
        const fetchedUser = await getUser(this.knex, userId);
        if (!fetchedUser) return;

        await updateUser(this.knex, userId, { bananas: 0 });
    }
}

function createMenuOptions(availableOptions: SelectMenuOption[]): StringSelectMenuOptionBuilder[] {
    const menuOptions: StringSelectMenuOptionBuilder[] = [];

    for (const option of availableOptions ?? []) {
        const optionBuilder = new StringSelectMenuOptionBuilder()
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

export async function handleSendRealtimeGuides(
    message: Message | ChatInputCommandInteraction | UserContextMenuCommandInteraction,
    targetUser: User | GuildMember | undefined,
    author: User,
    ephemeral: boolean = false,
    language: string = 'en'
) {
    const realtimeSelectOptions = i18next.t('tags.realtime.menuOptions', {
        lng: language,
        returnObjects: true,
    }) as SelectMenuOption[];

    // selects local RVC by default
    const selectedGuide = i18next.t('tags.realtime.local', {
        lng: language,
        returnObjects: true,
    }) as SelectMenuData;

    const menuOptions = createMenuOptions(realtimeSelectOptions);

    const menuId = `realtime_${generateRandomId(6)}`;

    const realtimeGuidesSelectMenu = new StringSelectMenuBuilder()
        .setCustomId(menuId)
        .setPlaceholder(i18next.t('tags.realtime.placeholder', { lng: language }))
        .addOptions(menuOptions);

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(realtimeGuidesSelectMenu);

    const botResponse = {
        embeds: createEmbeds(selectedGuide.embeds, [Colors.Blue, Colors.Aqua]),
        components: [row],
        content: '',
        ephemeral,
    };

    const selectMenuDisplayMinutes = 14; // allow interaction with the select menu for 14 minutes
    const mainUser = author;

    if (targetUser) {
        botResponse.content = i18next.t('general.suggestions_for_user', {
            userId: targetUser.id,
            lng: language,
        });
    }

    const botReply = await message.reply(botResponse);
    const currentChannel = message.channel as TextChannel;

    const filter = (i: Interaction) => i.isStringSelectMenu() && i.customId === menuId;

    const collector = currentChannel.createMessageComponentCollector({
        filter,
        time: selectMenuDisplayMinutes * 60 * 1000,
    });

    collector.on('collect', async (i: StringSelectMenuInteraction) => {
        let allowedToInteract = i.user.id === mainUser.id;

        // The mentioned user also can interact with the menu instead of only the user who used the command
        if (targetUser) {
            allowedToInteract = i.user.id === mainUser.id || i.user.id === targetUser.id;
        }

        if (allowedToInteract) {
            await i.deferUpdate();

            const selectMenuResult = i.values[0];

            const guideEmbeds = i18next.t(`tags.realtime.${selectMenuResult}.embeds`, {
                returnObjects: true,
                lng: language,
            }) as EmbedData[];

            if (targetUser) {
                botResponse.content = i18next.t('general.suggestions_for_user', {
                    userId: targetUser.id,
                    lng: language,
                });
            }

            botResponse.embeds = createEmbeds(guideEmbeds, [Colors.Blue, Colors.Aqua]);

            i.editReply(<InteractionUpdateOptions>botResponse);
        } else {
            i.reply({
                content: i18next.t('tags.realtime.not_allowed_to_interact', { lng: i.locale }),
                ephemeral: true,
            });
        }
    });

    collector.on('end', () => {
        botResponse.content = i18next.t('tags.realtime.expired', { lng: language });
        botResponse.embeds[0].setColor(Colors.Red);
        botResponse.components = [];
        botReply.edit(<MessageEditOptions>botResponse);
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
function getLanguageByChannelId(channelId: string): string {
    const languages: { [key: string]: string } = {
        '1159369117854347276': 'es',
        '1159291287430778933': 'it',
        '1159572045043081247': 'pt',
    };
    return languages[channelId] || 'en';
}

export { getLanguageByChannelId };

// export class CronJobService {
//     private client: ExtendedClient;
//     private isRunning: boolean;
//     private cronExpression: string;
//     private task: ScheduledTask | null = null;

//     constructor(client: ExtendedClient) {
//         this.client = client;
//         this.isRunning = false;
//     }

//     /**
//      * Schedule a new cron job with the specified interval and task.
//      * @param cronExpression - The cron expression string (e.g., '* * * * *' for every minute).
//      * @param taskFunction - The function to be executed on each scheduled interval.
//      */
//     public scheduleJob(cronExpression: string, taskFunction: () => void): void {
//         if (this.task) {
//             console.log('A job is already scheduled. Stop it before scheduling a new one.');
//             return;
//         }

//         this.task = cron.schedule(cronExpression, taskFunction, {
//             scheduled: true,
//             timezone: 'America/New_York', // Specify timezone if needed
//         });

//         console.log('Job scheduled with expression:', cronExpression);
//     }

//     start() {
//         this.task.start();
//         this.isRunning = true;
//         console.log('Task started!');
//     }

//     stop() {
//         this.task.stop();
//         this.isRunning = false;
//         console.log('Task stopped!');
//     }

//     executeTask() {
//         console.log('Running task...');
//         this.sendGuides();
//     }

//     async sendGuides() {
//         const { discordIDs, botConfigs, botData } = this.client;
//         const availableColors = getAvailableColors(botConfigs);
//         const guild = this.client.guilds.cache.get(discordIDs.Guild);
//         const botResponse = {};

//         // send guides to help-okada
//         botResponse.embeds = createEmbeds(botData.embeds.help.WOkada, availableColors);
//         const helpOkadaChannel = await getChannelById(discordIDs.Channel.HelpWOkada, guild);
//         await helpOkadaChannel.send(botResponse);
//         await wait(120_000);

//         // send guides to help channel
//         botResponse.content = '# RVC Guides (How to Make AI Cover)';
//         botResponse.embeds = createEmbeds(botData.embeds.guides.rvc.en, availableColors);
//         const helpChannel = await getChannelById(discordIDs.Channel.HelpRVC, guild);
//         await helpChannel.send(botResponse);
//         await wait(60_000);

//         /*
//         // send guides to making datasets
//         botResponse.content = '';
//         botResponse.embeds = createEmbeds(botData.embeds.guides.audio.en, availableColors);
//         const datasetsChannel = await getChannelById(discordIDs.Channel.MakingDatasets, guild);
//         await datasetsChannel.send(botResponse);
//         await wait(60_000);
//         */

//         this.client.logger.debug('Guides sent');

//         if (botConfigs.sendLogs && botConfigs.debugGuild.id && botConfigs.debugGuild.channelId) {
//             // notify dev server
//             botResponse.embeds = [];
//             botResponse.content = `📚 Guides sent to ${helpChannel} and ${helpOkadaChannel}.`;
//             const debugServerGuild = this.client.guilds.cache.get(botConfigs.debugGuild.id);
//             const debugChannel = await getChannelById(botConfigs.debugChannel.id, debugServerGuild);
//             await debugChannel.send(botResponse);
//         }
//     }
// }
