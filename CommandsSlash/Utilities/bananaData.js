const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { byValue, byNumber } = require('sort-es');

module.exports = {
    category: `Fun`,
    scope: `global`,
    type: `slash`, 
    data: new SlashCommandBuilder()
                .setName('banana_data')
                .setDescription('(RESTRICTED) Get /topbanana stats as a JSON file'),
    async execute(client, interaction) {
        if (interaction.client.disallowedChannelIds.includes(interaction.channelId)) {
            await interaction.reply({ content: 'This command is not available here.', ephemeral: true});
            return;
        }

        console.log(interaction.user.id);
        console.log(interaction.guildId);
        
        const lbUnsorted = JSON.parse(interaction.client.banana.export()).keys
        const lbSorted = lbUnsorted.sort(byValue(i => i.value, byNumber({ desc: true }))).slice(0, 10)

        let description = [];
        const jsonData = {};

        for (const entry of lbSorted) {
            const entryVal = Object.values(entry);
            const user = await interaction.client.users.fetch(entryVal[0]);
            description.push(`**‣ ${user.username}** - ${entryVal[1]}`);
        }

        const bananEmbed = new EmbedBuilder()
                                .setTitle(`THE FORTNITE BALLS LEADERBANAN`)
                                .setDescription(description.join(`\n`))
                                .setColor(`Yellow`);

        await interaction.reply({ embeds: [bananEmbed] })
    }
}
