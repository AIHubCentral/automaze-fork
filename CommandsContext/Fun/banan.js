/* context menu version of /banana */

const { ApplicationCommandType, ContextMenuCommandBuilder } = require("discord.js");

module.exports = {
    category: `Fun`,
    type: `context-menu`,
    data: new ContextMenuCommandBuilder()
        .setName('banan')
        .setType(ApplicationCommandType.User)
    ,
    async execute(interaction) {
        const client = interaction.client;
        const targetUser = interaction.targetUser;

        // check if user is on cooldown
        if (Date.now() <= client.cooldowns.banana.get(interaction.user.id)) {
            return interaction.reply(`dumbass yuo alredy banan ppl, wait GRRRRRRRRRRRRRRR!!!!!!!!!!!!!!!!!!!!!!!! yu gto ${client.cooldowns.banana.get(targetUser.id) - Date.now()} milliseconds left im too lazy to do math do it yourself GRRRRRRRRRR`)
        }

        if (client.disallowedChannelIds.includes(interaction.channelId)) {
            await interaction.reply({ content: 'This command is not available here.', ephemeral: true });
            return;
        }

        let member = interaction.options.getUser('user');
        const userId = targetUser.id;
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
            member = targetUser;
            botRevenge = true;
        }

        // check if user is in database
        let dbResult = await client.knexInstance('user').where('id', `${member.id}`);

        if (dbResult.length === 0) {
            console.log('User not found in database');
            await client.knexInstance('user').insert({
                id: `${member.id}`,
                username: member.username
            });
            console.log(`${member.username} added to database`);
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

        // copy embed data
        const embedData = JSON.parse(JSON.stringify(client.botData.embeds.banana));
        embedData.title = embedData.title.replace('$username', member.username);
        embedData.description[0] = embedData.description[0].replaceAll('$member', member);
        embedData.footer = embedData.footer.replace('$quantity', dbResult[0].quantity);

        if (dbResult[0].quantity > 1) {
            embedData.footer = embedData.footer.replace('TIME', 'TIMES');
        }

        const embed = client.botUtils.createEmbed(embedData, "Yellow");

        // cooldown expires in 1 minute
        client.cooldowns.banana.set(interaction.user.id, Date.now() + (1 * 60 * 1000));

        if (botRevenge) {
            await interaction.reply(selectedResponse);
            return interaction.followUp({ embeds: [embed] });
        }

        interaction.reply({ embeds: [embed] });
    }
}
