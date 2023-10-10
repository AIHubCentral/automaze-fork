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

        if (member.user.bot) {
            const responses = botResponses.targetBot;
            const selectedMessage = responses[Math.floor(Math.random() * responses.length)];
            return message.reply(selectedMessage);
        }

        if (Date.now() - client.cooldowns.banana.get(message.author.id) < 300000) {
            return void message.reply(`dumbass yuo alredy banan ppl, wait GRRRRRRRRRRRRRRR!!!!!!!!!!!!!!!!!!!!!!!! yu gto ${300000 - (Date.now() - client.cooldowns.banana.get(message.author.id))} milliseconds left im too lazy to do math do it yourself GRRRRRRRRRR`)
        }

        // get banana model from db
        const bananaModel = await client.sequelize.Item.findByPk(1);

        // check if user exists in database
        let targetUserModel = await client.sequelize.User.findByPk(`${member.user.id}`);

        if (targetUserModel === null) {
            console.log(`${member.user.username} not found.`);
            targetUserModel = await client.sequelize.User.create({
                discordId: member.user.id,
                userName: member.user.username
            });
            console.log(`${member.user.username} created.`);
        }

        // add banana item to user inventory
        await targetUserModel.addItem(bananaModel, {through:{quantity:1}});

        //  TODO: Finish the M:N association

        const bananEmbed = new EmbedBuilder()
            .setTitle(`${member.user.username} GOT BANANA LOL LOL LOL`)
            .setDescription(`HEY YOU ${member} YOU FUCKING GOT BANAN LMFAOOOOOOOOO\nHEY YOU ${member} YOU FUCKING GOT BANAN LMFAOOOOOOOOO\nHEY YOU ${member} YOU FUCKING GOT BANAN LMFAOOOOOOOOO`)
            .setImage(`https://media.tenor.com/29FOpiFsnn8AAAAC/banana-meme.gif`)
            .setColor(`Yellow`)
            .setFooter({text: `BRO GOT BANAN'D ${client.banana.ensure(member.user.id, 0) + 1} TIMES XDDDDDD\n\nNote: You can now use /banana`});

        client.banana.inc(member.user.id);
        client.cooldowns.banana.set(message.author.id, Date.now())

        message.reply({embeds: [bananEmbed]})
    }
}