import {
    SlashCommandBuilder,
    ActivityType,
    ChatInputCommandInteraction,
    PresenceStatusData,
} from 'discord.js';

import { delay } from '../../Utils/generalUtilities';
import { SlashCommand } from '../../Interfaces/Command';

const Configure: SlashCommand = {
    category: 'Utilities',
    cooldown: 15,
    data: new SlashCommandBuilder()
        .setName('configure')
        .setDescription('Configure bot settings')
        .addSubcommand((subcommand) =>
            subcommand
                .setName('activity')
                .setDescription('Configure bot activity')
                .addStringOption((option) =>
                    option
                        .setName('activity_type')
                        .setDescription('Choose an activity')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Watching', value: 'watching' },
                            { name: 'Listening', value: 'listening' },
                            { name: 'Reset', value: 'reset' }
                        )
                )
                .addStringOption((option) =>
                    option.setName('activity_name').setDescription('Choose a name for the activity')
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('status')
                .setDescription('Configure bot status')
                .addStringOption((option) =>
                    option
                        .setName('statuses')
                        .setDescription('Choose a status')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Online', value: 'online' },
                            { name: 'Idle', value: 'idle' },
                            { name: 'Do Not Disturb', value: 'dnd' },
                            { name: 'Invisible', value: 'invisible' }
                        )
                )
        ),
    async execute(interaction) {
        if (interaction.options.getSubcommand() === 'status') {
            await configureStatus(interaction);
        } else if (interaction.options.getSubcommand() === 'activity') {
            await configureActivity(interaction);
        }
    },
};

export default Configure;

async function configureStatus(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.deferReply({ ephemeral: true });
    const selectedStatus = interaction.options.getString('statuses') ?? 'online';
    interaction.client.user.setStatus(selectedStatus as PresenceStatusData);
    await delay(5000);
    await interaction.editReply({ content: `Status: ${selectedStatus} ` });
}

async function configureActivity(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.deferReply({ ephemeral: true });
    const activityTypeInput: string | null = interaction.options.getString('activity_type');
    const activityName: string = interaction.options.getString('activity_name') ?? 'AI HUB';

    let activityType: ActivityType | undefined = undefined;

    if (activityTypeInput === 'reset') {
        interaction.client.user.setPresence({});
        await delay(3000);
        await interaction.editReply({ content: 'Activity reseted' });
    } else {
        switch (activityTypeInput) {
            case 'watching':
                activityType = ActivityType.Watching;
                break;
            case 'listening':
                activityType = ActivityType.Listening;
                break;
        }
        interaction.client.user.setActivity({
            name: activityName,
            type: activityType,
        });
        await delay(3000);
        await interaction.editReply({ content: 'Activity updated!' });
    }
}
