import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, ColorResolvable, EmbedBuilder, GuildBasedChannel, GuildMember, Message, TextBasedChannel, User, UserContextMenuCommandInteraction } from "discord.js";
import IBotConfigs from "../Interfaces/BotConfigs";
import ExtendedClient from "../Core/extendedClient";
import { ButtonData, EmbedData } from "../Interfaces/BotData";
import { createEmbed, createEmbeds, getChannelById, getGuildById } from "./discordUtilities";
import UserService, { UserModel } from "../Services/userService";
import path from "path";
import fs from "fs";
import { getAllFiles } from "./fileUtilities";

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
    const themeFiles = getAllFiles(themesDirectory).filter(file => path.extname(file) === '.json');
    themeFiles.forEach(filePath => {
        const themeData = fs.readFileSync(filePath).toString();
        // remove .json extension from file name
        const themeName = path.parse(filePath).name;
        themes[themeName] = JSON.parse(themeData);
    });
    return themes;
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

export async function banan(interaction: ChatInputCommandInteraction | UserContextMenuCommandInteraction, targetUser: User, guildMember: GuildMember): Promise<any> {
    const user = interaction.user;
    const client = interaction.client as ExtendedClient;

    client.logger.debug("executing banan", {
        "more": {
            guildId: interaction.guildId,
            channelId: interaction.channelId,
        }
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
    const userService = new UserService(client.knexInstance);
    let userModel = await userService.getById(member.id);

    if (!userModel) {
        client.logger.debug(`User ${member.id} not found in database, creating...`);
        const newUser: UserModel = {
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

    const embed = createEmbed(embedData, 'Yellow');

    // cooldown expires in 1 minute
    client.cooldowns.banana.set(interaction.user.id, Date.now() + (1 * 60 * 1000));

    if (botRevenge) {
        await interaction.reply(selectedResponse);
        return await interaction.followUp({ embeds: [embed] });
    }

    await interaction.reply({ embeds: [embed] });

    client.logger.debug('Banan', {
        more: {
            targetUserId: targetUser.id
        },
    });

    if (client.botConfigs.sendLogs && (client.botConfigs.debugGuild.id && client.botConfigs.debugGuild.channelId)) {
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

        let channel: GuildBasedChannel | TextBasedChannel | null = await getChannelById(client.botConfigs.debugGuild.channelId, guild);
        if (!channel) return;

        channel = <TextBasedChannel>channel;

        await channel.send({ embeds: [debugEmbed] });
    }
}