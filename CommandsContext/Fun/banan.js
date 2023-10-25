/* context menu version of /banana */

const { ApplicationCommandType, ContextMenuCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    category: `Fun`,
    type: `context-menu`,
    data: new ContextMenuCommandBuilder()
            .setName('banan')
            .setType(ApplicationCommandType.User)
    ,
    async execute(interaction) {
        await interaction.reply({ content: 'Will be available soon, stay tuned!', ephemeral: true });
        /*
        const client = interaction.client;
        const targetUser = interaction.targetUser;

        if (interaction.client.disallowedChannelIds.includes(interaction.channelId)) {
            await interaction.reply({ content: 'This command is not available here.', ephemeral: true});
            return;
        }
        
        let member = targetUser;
        const userId = member.id;
        let botRevenge = false; // if this is true automaze banan the user instead
        const botResponses = interaction.client.botResponses.responses.banana;
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

        if (Date.now() - client.cooldowns.banana.get(userId) < 300000) {
            return await interaction.reply(`dumbass yuo alredy banan ppl, wait GRRRRRRRRRRRRRRR!!!!!!!!!!!!!!!!!!!!!!!! yu gto ${300000 - (Date.now() - interaction.client.cooldowns.banana.get(userId))} milliseconds left im too lazy to do math do it yourself GRRRRRRRRRR`)
        }

        const bananEmbed = new EmbedBuilder()
                                .setTitle(`${member.username} GOT BANANA LOL LOL LOL`)
                                .setDescription(`HEY YOU ${member} YOU FUCKING GOT BANAN LMFAOOOOOOOOO\nHEY YOU ${member} YOU FUCKING GOT BANAN LMFAOOOOOOOOO\nHEY YOU ${member} YOU FUCKING GOT BANAN LMFAOOOOOOOOO`)
                                .setImage(`https://media.tenor.com/29FOpiFsnn8AAAAC/banana-meme.gif`)
                                .setColor(`Yellow`)
                                .setFooter({ text: `BRO GOT BANAN'D ${interaction.client.banana.ensure(member.id, 0) + 1} TIMES XDDDDDD` });

        interaction.client.banana.inc(member.id);
        interaction.client.cooldowns.banana.set(userId, Date.now())

        if (botRevenge) {
            await interaction.reply(selectedResponse);
            return interaction.followUp({ embeds: [bananEmbed]})
        }

        interaction.reply({ embeds: [bananEmbed] })
    */
    }
}
