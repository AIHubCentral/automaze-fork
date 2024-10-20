"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const discordUtilities_1 = require("../../Utils/discordUtilities");
const generalUtilities_1 = require("../../Utils/generalUtilities");
const botUtilities_1 = require("../../Utils/botUtilities");
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
                    color: client.botConfigs.colors.theme.accent_1,
                    description: [
                        `💡 ${(0, discord_js_1.bold)('Tip')}: You can try using the ${(0, discord_js_1.inlineCode)('/search')} or ${(0, discord_js_1.inlineCode)('/find')} command from ${(0, discord_js_1.userMention)('1156937396517081169')} or ${(0, discord_js_1.userMention)('1138318590760718416')} to check if someone already made this model. Alternatively, you can check the ${(0, discord_js_1.channelMention)('1175430844685484042')} channel or use ${(0, discord_js_1.hyperlink)('weights.gg', 'https://weights.gg/')}, but keep in mind that weights receive the models after us, so if something new comes out, you'll find it on our server first.`,
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
    client.logger.info('free model request', {
        guildId: thread.guildId,
        threadId: thread.id,
        threadName: thread.name,
        parentChannelId: thread.parentId,
    });
}
async function handlePaidRequest(client, thread) {
    const modelMasterRoleId = client.discordIDs.Roles['ModelMaster'];
    const embeds = [];
    if (thread.ownerId) {
        embeds.push((0, discordUtilities_1.createEmbed)({
            color: client.botConfigs.colors.theme.primary,
            description: [
                `Hello, ${(0, discord_js_1.userMention)(thread.ownerId)}!`,
                '\nPeople will contact you to offer their services. However, if you created a **paid** request by mistake or if someone already finished your request, use the `/close` command to archive this post.',
            ],
        }));
    }
    embeds.push((0, discordUtilities_1.createEmbed)({
        color: client.botConfigs.colors.theme.secondary,
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
        await (0, generalUtilities_1.delay)(3_000);
        if (!thread.guild.channels.cache.get(thread.id))
            return;
        const { botConfigs } = client;
        // quit if configuration doesn't allow bot to send messages
        if (!botConfigs.commissions.sendMessages)
            return;
        const logData = {
            guildId: thread.guildId,
            threadId: thread.id,
            parentId: thread.parentId,
        };
        try {
            // check if it's a free or paid request
            const isPaidRequest = Boolean(thread.appliedTags.find((tag) => tag == client.discordIDs.Forum.RequestModel.Tags.Paid));
            const isFreeRequest = Boolean(thread.appliedTags.find((tag) => tag == client.discordIDs.Forum.RequestModel.Tags.Free));
            if (isPaidRequest && isFreeRequest) {
                client.logger.debug('Both free and paid request tags applied to this thread', logData);
                await handlePaidRequest(client, thread);
            }
            else if (isPaidRequest) {
                await handlePaidRequest(client, thread);
            }
            else if (isFreeRequest) {
                await handleFreeRequest(client, thread);
            }
            if (botConfigs.logs.modelRequests) {
                client.logger.debug('New model request', {
                    more: {
                        guildId: thread.guild.id,
                    },
                });
            }
        }
        catch (error) {
            client.logger.error('Error on model request', error, logData);
        }
    },
};
exports.default = RequestComission;
