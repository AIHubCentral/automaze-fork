"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const generalUtilities_1 = require("../../Utils/generalUtilities");
const Configure = {
    category: 'Utilities',
    cooldown: 15,
    data: new discord_js_1.SlashCommandBuilder()
        .setName('configure')
        .setDescription('Configure bot settings')
        .addSubcommand((subcommand) => subcommand
        .setName('activity')
        .setDescription('Configure bot activity')
        .addStringOption((option) => option
        .setName('activity_type')
        .setDescription('Choose an activity')
        .setRequired(true)
        .addChoices({ name: 'Watching', value: 'watching' }, { name: 'Listening', value: 'listening' }, { name: 'Reset', value: 'reset' }))
        .addStringOption((option) => option.setName('activity_name').setDescription('Choose a name for the activity')))
        .addSubcommand((subcommand) => subcommand
        .setName('status')
        .setDescription('Configure bot status')
        .addStringOption((option) => option
        .setName('statuses')
        .setDescription('Choose a status')
        .setRequired(true)
        .addChoices({ name: 'Online', value: 'online' }, { name: 'Idle', value: 'idle' }, { name: 'Do Not Disturb', value: 'dnd' }, { name: 'Invisible', value: 'invisible' }))),
    async execute(interaction) {
        if (interaction.options.getSubcommand() === 'status') {
            await configureStatus(interaction);
        }
        else if (interaction.options.getSubcommand() === 'activity') {
            await configureActivity(interaction);
        }
    },
};
exports.default = Configure;
async function configureStatus(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const selectedStatus = interaction.options.getString('statuses') ?? 'online';
    interaction.client.user.setStatus(selectedStatus);
    await (0, generalUtilities_1.delay)(5000);
    await interaction.editReply({ content: `Status: ${selectedStatus} ` });
}
async function configureActivity(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const activityTypeInput = interaction.options.getString('activity_type');
    const activityName = interaction.options.getString('activity_name') ?? 'AI HUB';
    let activityType = undefined;
    if (activityTypeInput === 'reset') {
        interaction.client.user.setPresence({});
        await (0, generalUtilities_1.delay)(3000);
        await interaction.editReply({ content: 'Activity reseted' });
    }
    else {
        switch (activityTypeInput) {
            case 'watching':
                activityType = discord_js_1.ActivityType.Watching;
                break;
            case 'listening':
                activityType = discord_js_1.ActivityType.Listening;
                break;
        }
        interaction.client.user.setActivity({
            name: activityName,
            type: activityType,
        });
        await (0, generalUtilities_1.delay)(3000);
        await interaction.editReply({ content: 'Activity updated!' });
    }
}
