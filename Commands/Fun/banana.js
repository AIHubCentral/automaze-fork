const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'banana',
    category: 'Fun',
    description: 'BANAN SOMEOME!!!!11!111!11',
    aliases: ['banan'],
    syntax: `banana <member>`,
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: async(client, message, args, prefix) => {
        const botResponses = client.botResponses.responses.banana;
        const member = message.mentions.members.first();

        if (!member) {
            return message.reply(botResponses.targetNone);
        }

        // check if user is on cooldown
        if (Date.now() <= client.cooldowns.banana.get(message.author.id)) {
            return message.reply(`dumbass yuo alredy banan ppl, wait GRRRRRRRRRRRRRRR!!!!!!!!!!!!!!!!!!!!!!!! yu gto ${ client.cooldowns.banana.get(message.author.id) - Date.now()} milliseconds left im too lazy to do math do it yourself GRRRRRRRRRR`)
        }

        if (member.user.bot) {
            const responses = botResponses.targetBot;
            const selectedMessage = responses[Math.floor(Math.random() * responses.length)];
            return message.reply(selectedMessage);
        }

        // check if user is in database
        let dbResult = await client.knexInstance('user').where('id', `${member.user.id}`);

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
            'user_id': `${member.user.id}`,
            'item_id': 1, // banana id
        });

        if (dbResult.length === 0) {
            // add banana to inventory
            await client.knexInstance('inventory').insert({
                'user_id': `${member.user.id}`,
                'item_id': 1,
                quantity: 1
            });
        } else {
            // if already have banana, increment the value
            await client.knexInstance('inventory').update({
                quantity: dbResult[0].quantity + 1
            }).where({
                'user_id': `${member.user.id}`,
                'item_id': 1,
            });
        }

        // last query to check how much bananas
        dbResult = await client.knexInstance('inventory').where({
            'user_id': `${member.user.id}`,
            'item_id': 1,
        });

        const bananEmbed = new EmbedBuilder()
            .setTitle(`${member.user.username} GOT BANANA LOL LOL LOL`)
            .setDescription(`HEY YOU ${member} YOU FUCKING GOT BANAN LMFAOOOOOOOOO\nHEY YOU ${member} YOU FUCKING GOT BANAN LMFAOOOOOOOOO\nHEY YOU ${member} YOU FUCKING GOT BANAN LMFAOOOOOOOOO`)
            .setImage(`https://media.tenor.com/29FOpiFsnn8AAAAC/banana-meme.gif`)
            .setColor(`Yellow`)
            .setFooter({text: `BRO GOT BANAN'D ${dbResult[0].quantity} TIMES XDDDDDD\n\nNote: You can now use /banana`});

        client.banana.inc(member.user.id);

        // cooldown expires in 1 minute
        client.cooldowns.banana.set(message.author.id, Date.now() + (1 * 60 * 1000))

        message.reply({embeds: [bananEmbed]})
    }
}