const Discord = require('discord.js');
const { delay } = require(process.cwd() + '/utils.js');

module.exports = {
    name: "threadCreate",
    once: false,
    async run(Client, Threader, newlyCreated){
        try{

            // Check is a Request Forum
            if(!newlyCreated) return;
            if(Threader.guildId != Client.discordIDs.Guild) return;
            if(Threader.parentId != Client.discordIDs.Forum.RequestModel.ID) return;
            if(!(Threader.appliedTags.find( Tag => Tag == Client.discordIDs.Forum.RequestModel.Tags.Paid))) return;

            // Check if exists the channel
            await delay(2000);
            if(!(await Threader.guild.channels.cache.get(Threader.id))) return;

            // Create tags message
            let MessageRoles = "(";
            for(let RolName of Client.discordIDs.Forum.RequestModel.ComissionAllow){
                MessageRoles += "<@&" + Client.discordIDs.Roles[RolName] + ">, ";
            }
            MessageRoles = MessageRoles.slice(0, -2) + ")";

            // Create embeds
            const embeds = [];

            embeds.push(Client.botUtils.createEmbed({
                color: 'Blurple',
                description: [
                    `Hello, <@${Threader.ownerId}>!`,
                    '\nPeople will contact you to offer their services. However, if you created a **paid** request by mistake, just delete the post and create a new one with the tag **"free"**.',
                    '\n**Here are some general recommendations regarding commissions:**',
                    '- Don\'t rush! You\'ll receive many requests, take your time to review the best offer. The first person who contacts you may not always be the best option.',
                    `- We recommend accepting commissions from people with these roles, as they are qualified for commissions and you can avoid scams. ${MessageRoles}`,
                    '- If you encounter any issues with a member related to a commission (scam, failure to fulfill terms, etc.), please report it to the administrative team to assess whether sanctions should be applied.',
                ]
            }));

            embeds.push(Client.botUtils.createEmbed({
                title: '⚠️ Warning to model makers',
                description: ['> Make sure you have the **model master** role or your response might be deleted.']
            }));

            await Threader.send({ embeds: embeds });

        } catch(e) {
        
            // Oh no, dat error.
            console.log(e);
        
        } 
    }
}