"use strict";
/* context menu version of /banana */
const { ApplicationCommandType, ContextMenuCommandBuilder } = require("discord.js");
const { banan } = require('../../utils.js');
module.exports = {
    category: `Fun`,
    type: `context-menu`,
    data: new ContextMenuCommandBuilder()
        .setName('banan')
        .setType(ApplicationCommandType.User),
    async execute(interaction) {
        const targetUser = interaction.targetUser;
        let guildMember = interaction.guild.members.cache.get(targetUser.id);
        if (!guildMember) {
            console.log('Guild member not found in cache...Fetching');
            guildMember = interaction.guild.members.fetch(targetUser.id);
        }
        banan(interaction, targetUser, guildMember);
    }
};
