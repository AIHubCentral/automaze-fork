const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { byValue, byNumber } = require('sort-es');

module.exports = {
    category: `Fun`,
    scope: `global`,
    type: `slash`, 
    data: new SlashCommandBuilder()
                .setName('topbanana')
                .setDescription('SEE HOW MUCH SOMEONE GOT BANAN!!!!11!111!11'),
    async execute(client, interaction) {
        if (interaction.client.disallowedChannelIds.includes(interaction.channelId)) {
            await interaction.reply({ content: 'This command is not available here.', ephemeral: true});
            return;
        }

        await interaction.deferReply();

        const bananEmbed = new EmbedBuilder()
                                .setTitle(`THE FORTNITE BALLS LEADERBANAN`)
                                .setColor(`Yellow`)
                                .setTimestamp();

        // lb = leaderboard
        const lbUnsorted = JSON.parse(interaction.client.banana.export()).keys;

        if (lbUnsorted.length < 1) {
            bananEmbed.setDescription('> The leaderboard is empty, `/banana` someone to show results here!');
            await interaction.editReply({ embeds: [bananEmbed] });
            return;
        }

        // if lbUnsorted is not an empty array, sort it
        const lbSorted = lbUnsorted.sort(byValue(i => i.value, byNumber({ desc: true }))).slice(0, 10);
        
        const embedDescription = [];

        let rankCounter = 1;
        for (const entry of lbSorted) {
            const entryVal = Object.values(entry);
            const user = await interaction.client.users.fetch(entryVal[0]);
            embedDescription.push(`${rankCounter}. ${user.username} — ${entryVal[1]}`);
            rankCounter++;
        }

        bananEmbed.setDescription(embedDescription.join('\n'));
        
        await interaction.editReply({ embeds: [bananEmbed] })
    }
}
