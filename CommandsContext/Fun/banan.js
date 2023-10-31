/* context menu version of /banana */
const { ApplicationCommandType, ContextMenuCommandBuilder } = require("discord.js");
const { banan } = require('../../utils.js');

module.exports = {
    category: `Fun`,
    type: `context-menu`,
    data: new ContextMenuCommandBuilder()
        .setName('banan')
        .setType(ApplicationCommandType.User)
    ,
    async execute(interaction) {
        const targetUser = interaction.targetUser;
        banan(interaction, targetUser);
    }
}
