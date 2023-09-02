const Chance = require("chance");
const chance = new Chance;
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")

module.exports = {
    category: `Fun`,
    scope: `global`,
    type: `slash`,   
    data: new SlashCommandBuilder()
                .setName('doxx')
                .setDescription('NOT ACTUAL DOXXING. creates random ip and house address')
                .addUserOption(option => 
                    option
                        .setName('user')
                        .setDescription('User to doxx')
                        .setRequired(true)
                ),
    async execute(client, interaction) {

        if (interaction.client.disallowedChannelIds.includes(interaction.channelId)) {
            await interaction.reply({ content: 'This command is not available here.', ephemeral: true});
            return;
        }

        const targetUser = interaction.options.getUser('user');
        const bot = interaction.client.user;

        const [ip, ipv6, mac, address] = interaction.client.doxx.ensure(
            targetUser.id, () => [chance.ip(), chance.ipv6(), chance.mac_address(), chance.address()]
        );

        const fetchingEmbed = new EmbedBuilder()
                                    .setTitle(`⏳ Fetching...`)
                                    .setColor(`Yellow`);

        const reply = await interaction.reply({embeds: [fetchingEmbed]});

        const embedTitle = targetUser.id === bot.id ? `❌ yo i aint sharing my info sry` : `✅ We found you **${targetUser.username}**!`;
        const embedColor = targetUser.id === bot.id ? 'Red' : 'Green';
        let embedDescription = `**IP**: ${targetUser.id === bot.id ? 'N/A' : ip}`;
        embedDescription += `\n**IPv6**: ${targetUser.id === bot.id ? 'N/A' : ipv6}`;
        embedDescription += `\n**MAC Address**: ${targetUser.id === bot.id ? 'N/A' : mac}`;
        embedDescription += `\n**Address (not exact)**: ${targetUser.id === bot.id ? 'under the bridge' : address}`;
        embedDescription += `\n\nUsed: \`/doxx\` ${targetUser}`;

        const foundEmbed = new EmbedBuilder()
                                .setTitle(embedTitle)
                                .setDescription(embedDescription)
                                .setColor(embedColor);
        setTimeout(async () => {
            reply.edit({embeds: [foundEmbed]});
        }, 3000)
    }
}
