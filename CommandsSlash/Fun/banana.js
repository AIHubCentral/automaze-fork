const { SlashCommandBuilder } = require("discord.js");
const { banan } = require('../../utils.js');

module.exports = {
    category: `Fun`,
    type: `slash`,
    data: new SlashCommandBuilder()
        .setName('banana')
        .setDescription('BANAN SOMEOME!!!!11!111!11')
        .addUserOption(option =>
            option.setName('user').setDescription('User to banan')
        )
    ,
    async execute(interaction) {
        const targetUser = interaction.options.getUser('user');
        let guildMember = interaction.guild.members.cache.get(targetUser.id);

        if (!guildMember) {
            console.log('Guild member not found in cache...Fetching');
            guildMember = interaction.guild.members.fetch(targetUser.id);
        }
        banan(interaction, targetUser, guildMember);
    }
}
