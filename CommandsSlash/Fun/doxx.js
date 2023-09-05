const Chance = require("chance");
const chance = new Chance;
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

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
        const oldAutomazeId = interaction.client.botResponses.userIds.oldAutomazeId;

        const [ip, ipv6, mac, address] = interaction.client.doxx.ensure(
            targetUser.id, () => [chance.ip(), chance.ipv6(), chance.mac_address(), chance.address()]
        );

        const fetchingEmbed = new EmbedBuilder()
                                    .setTitle(`⏳ Fetching...`)
                                    .setColor(`Yellow`);

        const reply = await interaction.reply({embeds: [fetchingEmbed]});

        let doxxData = {
            'title': '',
            'IP': 'N/A',
            'IPv6': 'N/A',
            'MAC': 'N/A',
            'address': 'Not found',
            'embedColor': 'Red'
        };

        switch(targetUser.id) {
            case(bot.id):
                doxxData.title =  '❌ yo i aint sharing my info';
                doxxData.address = 'under the bridge';
                break;
            case(oldAutomazeId):
                doxxData.title = '❌ Failed to retrieve information!';
                break;
            default:
                doxxData.title = `✅ We found you **${targetUser.username}**!`;
                doxxData.IP = ip;
                doxxData.IPv6 = ipv6;
                doxxData.MAC = mac;
                doxxData.address = address;
                doxxData.embedColor = 'Green';
        }

        let embedDescription = `**IP**: ${doxxData.IP}`;
        embedDescription += `\n**IPv6**: ${doxxData.IPv6}`;
        embedDescription += `\n**MAC Address**: ${doxxData.MAC}`;
        embedDescription += `\n**Address (not exact)**: ${doxxData.address}`;
        embedDescription += `\n\nUsed: \`/doxx\` ${targetUser}`;

        const foundEmbed = new EmbedBuilder()
                                .setTitle(doxxData.title)
                                .setDescription(embedDescription)
                                .setColor(doxxData.embedColor);
        setTimeout(async () => {
            await reply.edit({embeds: [foundEmbed]});
        }, 3000)
    }
}
