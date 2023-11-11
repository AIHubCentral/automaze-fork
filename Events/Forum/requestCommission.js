const { delay } = require(process.cwd() + '/utils.js');

module.exports = {
    name: "threadCreate",
    once: false,
    async run(client, Threader, newlyCreated) {
        try {
            // quit if configuration doesn't allow bot to send messages
            if (!client.botConfigs.commissions.sendMessages) return;

            // check if it's a Request Forum
            if (!newlyCreated) return;
            if (Threader.guildId != client.discordIDs.Guild) return;
            if (Threader.parentId != client.discordIDs.Forum.RequestModel.ID) return;

            // check if the channel exists
            await delay(2000);
            if (!(await Threader.guild.channels.cache.get(Threader.id))) return;

            // check if it's a free or paid request
            let isPaidRequest = Threader.appliedTags.find(Tag => Tag == client.discordIDs.Forum.RequestModel.Tags.Paid);
            let isFreeRequest = Threader.appliedTags.find(Tag => Tag == client.discordIDs.Forum.RequestModel.Tags.Free);

            if (isPaidRequest) {
                // Create tags message
                let MessageRoles = "(";
                for (let RolName of client.discordIDs.Forum.RequestModel.ComissionAllow) {
                    MessageRoles += "<@&" + client.discordIDs.Roles[RolName] + ">, ";
                }
                MessageRoles = MessageRoles.slice(0, -2) + ")";

                // Create embeds
                const embeds = [];

                embeds.push(client.botUtils.createEmbed({
                    color: client.botConfigs.colors.theme.primary,
                    description: [
                        `Hello, <@${Threader.ownerId}>!`,
                        '\nPeople will contact you to offer their services. However, if you created a **paid** request by mistake or if someone already finished your request, use the `-close` command to archive this post.',
                    ]
                }));

                embeds.push(client.botUtils.createEmbed({
                    color: client.botConfigs.colors.theme.secondary,
                    description: [
                        '\n**Some general recommendations regarding commissions:**',
                        '- Don\'t rush! You\'ll receive many requests, take your time to review the best offer. The first person who contacts you may not always be the best option.',
                        `- We recommend accepting commissions from people with these roles, as they are qualified for commissions and you can avoid scams. ${MessageRoles}`,
                        '- If you encounter any issues with a member related to a commission (scam, failure to fulfill terms, etc.), please report it to the administrative team to assess whether sanctions should be applied.',
                    ]
                }));

                if (client.botConfigs.commissions.deleteMessages) {
                    embeds.push(client.botUtils.createEmbed({
                        title: '⚠️ Warning to model makers',
                        description: ['> Make sure you have the **model master** role or your response might be deleted.']
                    }));
                }

                await Threader.send({ embeds: embeds });
            }

            // the !isPiadRequest check is used here to deal with cases where they select both free and paid tags
            if (isFreeRequest && !isPaidRequest) {
                const embeds = [
                    client.botUtils.createEmbed({
                        color: client.botConfigs.colors.theme.accent_1,
                        description: [
                            '💡 **Tip**: You can try using the `/search` command from <@1144714449563955302> or <@1150230843214794822> to check if someone already made this model.'
                        ]
                    })
                ];
                await Threader.send({ embeds: embeds });
            }
        } catch (e) {
            // Oh no, dat error.
            console.log(e);

        }
    }
}