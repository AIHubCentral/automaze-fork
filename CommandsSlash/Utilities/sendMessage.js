const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    category: 'Utilities',
    type: 'slash',

    data: new SlashCommandBuilder()
        .setName('send_message')
        .setDescription('Sends a predefined message in the help channels'),
    async execute(interaction) {
        const client = interaction.client;

        if (!client.botAdminIds || !client.botAdminIds.includes(interaction.user.id)) {
            return await interaction.reply({ content: 'You can\'t use this command', ephemeral:true });
        }

        const guild = await client.guilds.fetch(client.discordIDs.Guild);
        let channel = null;

        try {
            channel = await guild.channels.fetch(client.discordIDs.Channel.HelpRVC);
        }
        catch(error) {
            await interaction.reply({ content: 'Failed to fetch channel', ephemeral: true });
            return;
        }

        if (!channel) {
            await interaction.reply({ content: 'Failed to fetch channel', ephemeral: true });
        } else {
            // english response only
            let embeds = [
                client.botUtils.createEmbed(client.botData.embeds.rvc.en.docs, client.botConfigs.colors.theme.primary),
                client.botUtils.createEmbed(client.botData.embeds.rvc.en.guides, client.botConfigs.colors.theme.secondary),
                client.botUtils.createEmbed(client.botData.embeds.rvc.en.translations),
            ];
            await channel.send({ content: '# RVC Guides (How to Make AI Cover)', embeds: embeds});
            await interaction.reply({ content:`Message sent!\nGuild:${guild.id}\nChannel:${channel.id}`, ephemeral:true });
        }
    }
};