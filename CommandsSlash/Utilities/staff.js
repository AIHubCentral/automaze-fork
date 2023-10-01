const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    category: `Utilities`,
    type: `slash`, 
    data: new SlashCommandBuilder()
                .setName('staff')
                .setDescription('See staff activities'),
    async execute(interaction) {
        const client = interaction.client;
        await interaction.deferReply({ ephemeral: true });
        await interaction.guild.members.fetch();

        const qcRole = await interaction.guild.roles.cache.find((role) => role.id == client.discordIDs.Roles.ModelQC);
        const helperRole = await interaction.guild.roles.cache.find((role) => role.id == client.discordIDs.Roles.Helper);
        const modRole = await interaction.guild.roles.cache.find((role) => role.id == client.discordIDs.Roles.Mod);
        
        const roles = [qcRole, helperRole, modRole];
        let output = `Activity since ${new Date()}`;

        for (let role of roles) {
            let roleMembers = role.members;
            roleMembers = roleMembers.filter((member) => !member.user.bot); // remove bots

            let memberNames = roleMembers.map((member) => member.user.username);
            output += `\n${role}`;
            for (let name of memberNames) {
                output += '\n- ' + name;
            }
            output += '\n';
        }

        const embed = new EmbedBuilder()
            .setTitle('Staff Team')
            .setColor('Blurple')
            .setDescription(output)
            .setTimestamp();

        await interaction.editReply({embeds: [embed]});
    }
}
