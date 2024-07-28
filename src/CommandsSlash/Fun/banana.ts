import { SlashCommandBuilder } from "discord.js";
import { banan } from "../../Utils/botUtilities.js";
import { SlashCommand } from "../../Interfaces/Command.js";
import ExtendedClient from "../../Core/extendedClient.js";

const Banana: SlashCommand = {
    category: 'Fun',
    data: new SlashCommandBuilder()
        .setName('banana')
        .setDescription('BANAN SOMEOME!!!!11!111!11')
        .addUserOption(option =>
            option.setName('user').setDescription('User to banan')
        )
    ,
    async execute(interaction) {
        const client = <ExtendedClient>interaction.client;
        const targetUser = interaction.options.getUser('user');

        if (targetUser === null) {
            client.logger.debug('No user specified for banan', {
                more: {
                    guildId: interaction.guildId,
                    channelId: interaction.channelId,
                }
            });
            return interaction.reply({ content: 'You forgot to select the user!', ephemeral: true });
        }

        let guildMember = interaction.guild?.members.cache.get(targetUser.id);

        if (!guildMember) {
            client.logger.debug(`Guild member ${targetUser.id} not found in cache...Fetching`);
            guildMember = await interaction.guild?.members.fetch(targetUser.id);
        }

        if (!guildMember) {
            client.logger.debug(`Failed to get guild member ${targetUser.id}`);
            return interaction.reply({ content: "Failed to banan user.", ephemeral: true });
        }

        await banan(interaction, targetUser, guildMember);
    }
}

export default Banana;