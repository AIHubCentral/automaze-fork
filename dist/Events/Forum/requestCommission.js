"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const discordUtilities_1 = require("../../Utils/discordUtilities");
const generalUtilities_1 = require("../../Utils/generalUtilities");
const botUtilities_1 = require("../../Utils/botUtilities");
const db_1 = __importDefault(require("../../db"));
const modelService_1 = __importDefault(require("../../Services/modelService"));
async function handleFreeRequest(client, thread) {
    // latina E-Girl
    const stickerId = '1159469403843346443';
    try {
        const threadTitle = thread.name.toLowerCase();
        const response = {};
        if ((0, botUtilities_1.isAskingForGirlModel)(threadTitle)) {
            response.stickers = [stickerId];
        }
        else {
            response.embeds = [
                (0, discordUtilities_1.createEmbed)({
                    color: discord_js_1.Colors.Blurple,
                    title: '💡 Tip',
                    description: [
                        'You can check if someone already made this model. Try the following:',
                        '- Search for it in <#1175430844685484042>',
                        '- Alternatively, in <#1163592055830880266>:',
                        '    - Send " <@1144714449563955302> search (name of the model)", without the ()',
                        '  - Use the command `/find` with <@1138318590760718416> bot',
                        '- Visit <https://weights.gg/> and search for the model (login required)',
                    ],
                }),
            ];
        }
        await thread.send(response);
    }
    catch (error) {
        if (error instanceof discord_js_1.DiscordAPIError) {
            if (error.code === discordUtilities_1.DiscordErrorCodes.CannotUseThisSticker ||
                error.code === discordUtilities_1.DiscordErrorCodes.InvalidFormBody) {
                client.logger.warn(`Couldn't find sticker with id ${stickerId}`);
            }
            else {
                client.logger.error('Unexpected error handling free model request', error);
            }
        }
    }
    finally {
        const service = new modelService_1.default(db_1.default);
        const starterMessage = await thread.fetchStarterMessage();
        const description = starterMessage ? starterMessage.content : '';
        await service.create({
            id: thread.id,
            parent_id: thread.parentId ?? '',
            author_id: thread.ownerId ?? '',
            title: thread.name,
            is_request: true,
            description,
        });
    }
}
async function handlePaidRequest(client, thread) {
    const modelMasterRoleId = client.discordIDs.Roles['ModelMaster'];
    const embeds = [];
    if (thread.ownerId) {
        embeds.push((0, discordUtilities_1.createEmbed)({
            color: discord_js_1.Colors.Aqua,
            description: [
                `Hello, ${(0, discord_js_1.userMention)(thread.ownerId)}!`,
                '\nPeople will contact you to offer their services. However, if you created a **paid** request by mistake or if someone already finished your request, use the `/close` command to archive this post.',
            ],
        }));
    }
    embeds.push((0, discordUtilities_1.createEmbed)({
        color: discord_js_1.Colors.Blue,
        description: [
            '\n**Some general recommendations regarding commissions:**',
            "- Don't rush! You'll receive many requests, so take your time to review the best offer. The first person who contacts you may not always be the best option.",
            `- We recommend exclusively accepting commission from people holding the ${(0, discord_js_1.roleMention)(modelMasterRoleId)} role, regardless of any role above it when accepting commissions to ensure a secure and qualified working relationship.`,
        ],
    }));
    if (client.botConfigs.commissions.deleteMessages) {
        embeds.push((0, discordUtilities_1.createEmbed)({
            title: '⚠️ Warning to model makers',
            color: discord_js_1.Colors.Yellow,
            description: [
                `> Make sure you have the ${(0, discord_js_1.roleMention)(modelMasterRoleId)} role, or your response might be deleted.`,
            ],
        }));
    }
    await thread.send({ embeds: embeds });
}
const RequestComission = {
    name: discord_js_1.Events.ThreadCreate,
    once: false,
    async run(client, thread, newlyCreated) {
        // check if it's a Request Forum
        if (!newlyCreated)
            return;
        if (thread.guildId != client.discordIDs.Guild)
            return;
        if (thread.parentId != client.discordIDs.Forum.RequestModel.ID)
            return;
        // check if the thread was created successfully
        await (0, generalUtilities_1.delay)(10_000);
        if (!thread.guild.channels.cache.get(thread.id))
            return;
        const { botConfigs } = client;
        // quit if configuration doesn't allow bot to send messages
        if (!botConfigs.commissions.sendMessages)
            return;
        try {
            // check if it's a free or paid request
            const isPaidRequest = Boolean(thread.appliedTags.find((tag) => tag == client.discordIDs.Forum.RequestModel.Tags.Paid));
            const isFreeRequest = Boolean(thread.appliedTags.find((tag) => tag == client.discordIDs.Forum.RequestModel.Tags.Free));
            if (isPaidRequest && isFreeRequest) {
                await handlePaidRequest(client, thread);
            }
            else if (isPaidRequest) {
                await handlePaidRequest(client, thread);
            }
            else if (isFreeRequest) {
                await handleFreeRequest(client, thread);
            }
        }
        catch (error) {
            await (0, botUtilities_1.sendErrorLog)(client, error, {
                command: `Event: ThreadCreate`,
                message: 'Failure on model request',
                guildId: thread.guildId ?? '',
                channelId: thread.id,
            });
        }
    },
};
exports.default = RequestComission;
