const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

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
        const client = interaction.client;

        // check if user is on cooldown
        if (Date.now() <= client.cooldowns.banana.get(interaction.user.id)) {
            return interaction.reply(`dumbass yuo alredy banan ppl, wait GRRRRRRRRRRRRRRR!!!!!!!!!!!!!!!!!!!!!!!! yu gto ${client.cooldowns.banana.get(interaction.user.id) - Date.now()} milliseconds left im too lazy to do math do it yourself GRRRRRRRRRR`)
        }

        if (client.disallowedChannelIds.includes(interaction.channelId)) {
            await interaction.reply({ content: 'This command is not available here.', ephemeral: true });
            return;
        }

        let member = interaction.options.getUser('user');
        const userId = interaction.user.id;
        let botRevenge = false; // if its true automaze banan the user instead
        const botResponses = client.botResponses.responses.banana;
        let selectedResponse = null;

        if (!member) return interaction.reply(botResponses.targetNone);

        if (member.bot) {
            const responses = botResponses.targetBot;
            selectedResponse = responses[Math.floor(Math.random() * responses.length)];
            if (!selectedResponse.startsWith('NO,')) {
                return interaction.reply(selectedResponse);
            }

            // change the banan target to the user who tried to banan automaze or any other bot
            member = interaction.user;
            botRevenge = true;
        }

        // check if user is in database
        let dbResult = await client.knexInstance('user').where('id', `${member.id}`);

        if (dbResult.length === 0) {
            console.log('User not found in database');
            await client.knexInstance('user').insert({
                id: `${member.user.id}`,
                username: member.user.username
            });
            console.log(`${member.user.username} added to database`);
        }

        // check if banana is in the user inventory
        dbResult = await client.knexInstance('inventory').where({
            'user_id': `${member.id}`,
            'item_id': 1, // banana id
        });

        if (dbResult.length === 0) {
            // add banana to inventory
            await client.knexInstance('inventory').insert({
                'user_id': `${member.id}`,
                'item_id': 1,
                quantity: 1
            });
        } else {
            // if already have banana, increment the value
            await client.knexInstance('inventory').update({
                quantity: dbResult[0].quantity + 1
            }).where({
                'user_id': `${member.id}`,
                'item_id': 1,
            });
        }

        // last query to check how much bananas
        dbResult = await client.knexInstance('inventory').where({
            'user_id': `${member.id}`,
            'item_id': 1,
        });

        const bananEmbed = new EmbedBuilder()
            .setTitle(`${member.username} GOT BANANA LOL LOL LOL`)
            .setDescription(`HEY YOU ${member} YOU FUCKING GOT BANAN LMFAOOOOOOOOO\nHEY YOU ${member} YOU FUCKING GOT BANAN LMFAOOOOOOOOO\nHEY YOU ${member} YOU FUCKING GOT BANAN LMFAOOOOOOOOO`)
            .setImage(`https://media.tenor.com/29FOpiFsnn8AAAAC/banana-meme.gif`)
            .setColor(`Yellow`)
            .setFooter({ text: `BRO GOT BANAN'D ${dbResult[0].quantity} TIMES XDDDDDD\n\nNote: You can now use /banana` });

        client.banana.inc(member.id);

        // cooldown expires in 1 minute
        client.cooldowns.banana.set(interaction.user.id, Date.now() + (1 * 60 * 1000))

        if (botRevenge) {
            await interaction.reply(selectedResponse);
            return interaction.followUp({ embeds: [bananEmbed] })
        }

        interaction.reply({ embeds: [bananEmbed] })
    }
}
