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

        const lbUnsorted = JSON.parse(interaction.client.banana.export()).keys;
        const lbSorted = lbUnsorted.sort(byValue(i => i.value, byNumber({ desc: true }))).slice(0, 10);
        
        const embedDescription = [];

        let rankCounter = 1;
        for (const entry of lbSorted) {
            const entryVal = Object.values(entry);
            const user = await interaction.client.users.fetch(entryVal[0]);
            embedDescription.push(`${rankCounter}. ${user} — ${entryVal[1]}`);
            rankCounter++;
        }

        const bananEmbed = new EmbedBuilder()
                                .setTitle(`THE FORTNITE BALLS LEADERBANAN`)
                                .setColor(`Yellow`)
                                .setDescription(embedDescription.join('\n'))
                                .setTimestamp();
        
        await interaction.reply({ embeds: [bananEmbed] })
    }
}
