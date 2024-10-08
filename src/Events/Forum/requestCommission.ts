import {
    ColorResolvable,
    Colors,
    EmbedBuilder,
    Events,
    ThreadChannel,
    bold,
    channelMention,
    hyperlink,
    inlineCode,
    roleMention,
    userMention,
} from 'discord.js';
import IEventData from '../../Interfaces/Events';
import ExtendedClient from '../../Core/extendedClient';
import { createEmbed } from '../../Utils/discordUtilities';
import { delay } from '../../Utils/generalUtilities';

async function handleFreeRequest(client: ExtendedClient, thread: ThreadChannel): Promise<void> {
    const embeds = [
        createEmbed({
            color: client.botConfigs.colors.theme.accent_1,
            description: [
                `💡 ${bold('Tip')}: You can try using the ${inlineCode('/search')} or ${inlineCode('/find')} command from ${userMention('1156937396517081169')} or ${userMention('1138318590760718416')} to check if someone already made this model. Alternatively, you can check the ${channelMention('1175430844685484042')} channel or use ${hyperlink('weights.gg', 'https://weights.gg/')}, ` +
                    "but keep in mind that weights receive the models after us, so if something new comes out, you'll find it on our server first.",
            ],
        }),
    ];
    await thread.send({ embeds: embeds });
}

async function handlePaidRequest(client: ExtendedClient, thread: ThreadChannel): Promise<void> {
    const modelMasterRoleId = client.discordIDs.Roles['ModelMaster'];

    const embeds: EmbedBuilder[] = [];

    if (thread.ownerId) {
        embeds.push(
            createEmbed({
                color: client.botConfigs.colors.theme.primary as ColorResolvable,
                description: [
                    `Hello, ${userMention(thread.ownerId)}!`,
                    '\nPeople will contact you to offer their services. However, if you created a **paid** request by mistake or if someone already finished your request, use the `-close` command to archive this post.',
                ],
            })
        );
    }

    embeds.push(
        createEmbed({
            color: client.botConfigs.colors.theme.secondary as ColorResolvable,
            description: [
                '\n**Some general recommendations regarding commissions:**',
                "- Don't rush! You'll receive many requests, so take your time to review the best offer. The first person who contacts you may not always be the best option.",
                `- We recommend exclusively accepting commission from people holding the ${roleMention(modelMasterRoleId)} role, regardless of any role above it when accepting commissions to ensure a secure and qualified working relationship.`,
                '- If you encounter any issues with a member related to a commission (scam, failure to fulfill terms, etc.), please report it to the administrative team to assess whether sanctions should be applied.',
            ],
        })
    );

    if (client.botConfigs.commissions.deleteMessages) {
        embeds.push(
            createEmbed({
                title: '⚠️ Warning to model makers',
                color: Colors.Yellow,
                description: [
                    '> Make sure you have the **model master** role, or your response might be deleted.',
                ],
            })
        );
    }

    await thread.send({ embeds: embeds });
}

const RequestComission: IEventData = {
    name: Events.ThreadCreate,
    once: false,
    async run(client, thread: ThreadChannel, newlyCreated: boolean) {
        // check if it's a Request Forum
        if (!newlyCreated) return;
        if (thread.guildId != client.discordIDs.Guild) return;
        if (thread.parentId != client.discordIDs.Forum.RequestModel.ID) return;

        // check if the thread was created successfully
        await delay(3_000);
        if (!thread.guild.channels.cache.get(thread.id)) return;

        const { botConfigs } = client;

        // quit if configuration doesn't allow bot to send messages
        if (!botConfigs.commissions.sendMessages) return;

        const logData = {
            guildId: thread.guildId,
            threadId: thread.id,
            parentId: thread.parentId,
        };

        try {
            // check if it's a free or paid request
            const isPaidRequest = Boolean(
                thread.appliedTags.find((tag) => tag == client.discordIDs.Forum.RequestModel.Tags.Paid)
            );
            const isFreeRequest = Boolean(
                thread.appliedTags.find((tag) => tag == client.discordIDs.Forum.RequestModel.Tags.Free)
            );

            if (isPaidRequest && isFreeRequest) {
                client.logger.debug('Both free and paid request tags applied to this thread', logData);
                await handlePaidRequest(client, thread);
            } else if (isPaidRequest) {
                await handlePaidRequest(client, thread);
            } else if (isFreeRequest) {
                await handleFreeRequest(client, thread);
            }

            if (botConfigs.logs.modelRequests) {
                client.logger.debug('New model request', {
                    more: {
                        guildId: thread.guild.id,
                    },
                });
            }
        } catch (error) {
            client.logger.error('Error on model request', error, logData);
        }
    },
};

export default RequestComission;
