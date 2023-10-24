const { SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    category: 'Utilities',
    type: 'slash',

    data: new SlashCommandBuilder()
        .setName('send_message')
        .setDescription('Sends a predefined message in the help channels'),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const client = interaction.client;

        if (!client.botAdminIds || !client.botAdminIds.includes(interaction.user.id)) {
            return await editReply.reply({ content: 'You can\'t use this command', ephemeral: true });
        }

        const guild = await client.guilds.fetch(client.discordIDs.Guild);

        try {
            helpChannel = await guild.channels.fetch(client.discordIDs.Channel.HelpRVC);
            helpOkadaChannel = await guild.channels.fetch(client.discordIDs.Channel.HelpWOkada);

            if (!helpChannel) return await interaction.reply('Failed to fetch help channel');
            if (!helpOkadaChannel) return await interaction.reply('Failed to fetch help okada channel');

            // send messages
            let embeds = [
                client.botUtils.createEmbed(client.botData.embeds.rvc.en.docs, client.botConfigs.colors.theme.primary),
                client.botUtils.createEmbed(client.botData.embeds.rvc.en.guides, client.botConfigs.colors.theme.secondary),
                client.botUtils.createEmbed(client.botData.embeds.rvc.en.translations),
            ];
            await helpChannel.send({ content: '# RVC Guides (How to Make AI Cover)', embeds: embeds });

            await interaction.editReply({ content: `Message sent!\nGuild:${guild.id}\nChannel:${helpChannel.id}` });

            await wait(3000);

            embeds = [client.botUtils.createEmbed(
                {
                    title: 'Having some trouble? Check out these guides',
                    color: client.botConfigs.colors.theme.tertiary,
                    description: [
                        '- FAQ: [W-Okada-FAQ](https://rentry.co/W-Okada-FAQ)',
                        '- Common Error Fixes: [W-Okada\'s Voice Changer Common Issues and Fixes](https://docs.google.com/document/d/e/2PACX-1vQIwJ3MVidhgEaXwWFl0xpVonVOVfneaNVADd7-NMWFgPIsfWWhG8NNqzQMsXDIOGlBIfxscoIm2_6I/pub)',
                        '- Sushi\'s guides: [The Sushi Bar](https://linktr.ee/sushi2022)',
                    ]
                }
            )];

            await helpOkadaChannel.send({ embeds: embeds });
            await interaction.followUp({ content: `Message sent!\nGuild:${guild.id}\nChannel:${helpOkadaChannel.id}`, ephemeral: true });
        }
        catch (error) {
            await interaction.editReply({ content: 'Errored', ephemeral: true });
            return;
        }
    }
};