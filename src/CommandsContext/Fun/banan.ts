/* context menu version of /banana */
import { ApplicationCommandType, ContextMenuCommandBuilder, UserContextMenuCommandInteraction } from "discord.js";
import { ContextCommand } from "../../Interfaces/Command";
import ExtendedClient from "../../Core/extendedClient";
const { banan } = require('../../utils.js');

const Banan: ContextCommand = {
    category: 'Fun',
    type: 'context-menu',
    data: new ContextMenuCommandBuilder()
        .setName('banan')
        .setType(ApplicationCommandType.User)
    ,
    async execute(interaction) {
        const client = <ExtendedClient>interaction.client;
        const targetUser = interaction.targetUser;
        let guildMember = interaction.guild?.members.cache.get(targetUser.id);

        if (!guildMember) {
            client.logger.debug(`Guild member ${targetUser.id} not found in cache...Fetching`);
            guildMember = await interaction.guild?.members.fetch(targetUser.id);
        }

        await banan(interaction, targetUser, guildMember);
    }
}

export default Banan;