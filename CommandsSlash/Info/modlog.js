const { SlashCommandBuilder, PermissionFlagsBits, ChannelType, AuditLogEvent } = require('discord.js');
const fs = require('fs');

module.exports = {
    category: 'Utilities',
    type: 'slash',

    data: new SlashCommandBuilder()
        .setName('modlog')
        .setDescription('Create a modlog channel')
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('Create modlog channel')
                .addStringOption(option => option
                    .setName('name')
                    .setDescription('defaults to modlog')))
        .addSubcommand(subcommand =>
            subcommand
                .setName('change')
                .setDescription('Change modlog channel')
                .addStringOption(option => option
                    .setName('name')
                    .setDescription('channel name to switch current modlog to')
                    .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('delete')
                .setDescription('Delete modlog channel'))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(client, interaction) {
        const channels = require('../../JSON/channels.json');
        if(interaction.options.getSubcommand() == 'add') {
            createChannel(client, interaction, channels);
        } else if(interaction.options.getSubcommand() == 'change') {
            changeChannel(client, interaction, channels);
        } else if(interaction.options.getSubcommand() == 'delete') {
            deleteChannel(client, interaction, channels);
        }
    },
};

async function createChannel(client, interaction, channels) {
    if(!channels.modlog?.id) {
        const name = interaction.options.getString('name') ? interaction.options.getString('name') : "modlog";
        channels.modlog = await interaction.guild.channels.create({
            name: name,
            type: ChannelType.AuditLogEvent
        });
        fs.writeFileSync(`${process.cwd()}/JSON/channels.json`, JSON.stringify(channels, null, 2));
        await interaction.reply({ content:`Modlog channel "${channels.modlog.name}" was created`, ephemeral: true});
        console.log(`Modlog channel "${channels.modlog.name}" was created`);
    } else {
        await interaction.reply({ content:`Modlog channel "${channels.modlog.name}" already exists`, ephemeral: true});
        console.log(`Modlog channel "${channels.modlog.name}" already exists`);
    }
}

async function changeChannel(client, interaction, channels) {
    const previousName = channels.modlog.name;
    const newName = interaction.options.getString('name');
    await client.channels.cache.get(channels.modlog.id).edit({ name: newName })
        .catch(console.error);
    channels.modlog.name = newName;
    fs.writeFileSync(`${process.cwd()}/JSON/channels.json`, JSON.stringify(channels, null, 2));
    await interaction.reply({ content:`Modlog changed from ${previousName} to ${channels.modlog.name}`, ephemeral: true});
}

async function deleteChannel(client, interaction, channels) {
    const previousName = channels.modlog.name;
    await client.channels.cache.get(channels.modlog.id).delete()
        .catch(console.error);
    await interaction.reply({ content:`Modlog channel "${previousName}" was deleted`, ephemeral: true });
    channels.modlog = null;
    fs.writeFileSync(`${process.cwd()}/JSON/channels.json`, JSON.stringify(channels, null, 2));
}