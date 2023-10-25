const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    category: `Fun`,
    cooldown: 15,
    type: `slash`, 
    data: new SlashCommandBuilder()
                .setName('topbanana')
                .setDescription('SEE HOW MUCH SOMEONE GOT BANAN!!!!11!111!11'),
    async execute(interaction) {
        const client = interaction.client;

        if (client.disallowedChannelIds.includes(interaction.channelId)) {
            await interaction.reply({ content: 'This command is not available here.', ephemeral: true});
            return;
        }

        await interaction.deferReply();

        const embedData = {
            title: 'THE FORTNITE BALLS LEADERBANAN',
            color: 'Yellow',
            timestamp: true,
            description: []
        };

        // fetch inventory from database
        const inventory = await client.knexInstance('inventory').orderBy('quantity', 'desc').limit(15);

        if (inventory.length === 0) {
            embedData.description.push('> The leaderboard is empty, `/banana` someone to show results here!');
            return await interaction.editReply({ embeds: [client.botUtils.createEmbed(embedData)] });
        }

        let rankCounter = 1;
        for (const entry of inventory) {
            let user = await client.knexInstance('user').where('id', entry['user_id']);
            embedData.description.push(`${rankCounter}. ${user[0].username} — ${entry.quantity}`);
            rankCounter++;
        }
        
        await interaction.editReply({ embeds: [client.botUtils.createEmbed(embedData)] })
    }
}
