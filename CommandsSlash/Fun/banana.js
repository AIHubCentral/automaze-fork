const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const responses = [
    'NICE TRY KID LOL 🤣',
    'KID U NEED TO BANAN SOMEONE ELSE 😠',
    '😂🤣😂🤣',
    'LOL KID STOP 🤣🤣🤣🤣',
    'NO, I BANAN YOU INSTEAD 🤪🤣🤣🤣'
];

module.exports = {
    category: `Fun`,
    scope: `global`,
    type: `slash`,
    data: new SlashCommandBuilder()
                .setName('banana')
                .setDescription('BANAN SOMEOME!!!!11!111!11')
                .addUserOption(option =>
                    option.setName('user').setDescription('User to banan')
                 )
    ,
    async execute(client, interaction) {
        if (interaction.client.disallowedChannelIds.includes(interaction.channelId)) {
            await interaction.reply({ content: 'This command is not available here.', ephemeral: true});
            return;
        }
        
        let member = interaction.options.getUser('user');
        const userId = interaction.user.id;
        let botRevenge = false; // if its true automaze banan the user instead
        let selectedResponse = null;

        if (!member) return interaction.reply(`dumbass who you watn to banan?/?/????`);

        if (member.id === userId) {
            return interaction.reply('BANAN YOURSELF??!!! ARE YOU SANE??? 😂🤣😂🤣');
        }

        if (member.id === client.user.id) {
            selectedResponse = responses[Math.floor(Math.random() * responses.length)];
            console.log(selectedResponse);
            if (!selectedResponse.startsWith('NO,')) {
                return interaction.reply(selectedResponse);
            }

            // change the banan target to the user who tried to banan automaze
            member = interaction.user;
            botRevenge = true;
        }

        if (Date.now() - client.bananaCD.get(userId) < 300000) {
            return await interaction.reply(`dumbass yuo alredy banan ppl, wait GRRRRRRRRRRRRRRR!!!!!!!!!!!!!!!!!!!!!!!! yu gto ${300000 - (Date.now() - interaction.client.bananaCD.get(userId))} milliseconds left im too lazy to do math do it yourself GRRRRRRRRRR`)
        }

        const bananEmbed = new EmbedBuilder()
                                .setTitle(`${member.username} GOT BANANA LOL LOL LOL`)
                                .setDescription(`HEY YOU ${member} YOU FUCKING GOT BANAN LMFAOOOOOOOOO\nHEY YOU ${member} YOU FUCKING GOT BANAN LMFAOOOOOOOOO\nHEY YOU ${member} YOU FUCKING GOT BANAN LMFAOOOOOOOOO`)
                                .setImage(`https://media.tenor.com/29FOpiFsnn8AAAAC/banana-meme.gif`)
                                .setColor(`Yellow`)
                                .setFooter({ text: `BRO GOT BANAN'D ${interaction.client.banana.ensure(member.id, 0) + 1} TIMES XDDDDDD` });

        interaction.client.banana.inc(member.id);
        interaction.client.bananaCD.set(userId, Date.now())

        if (botRevenge) {
            await interaction.reply(selectedResponse);
            return interaction.followUp({ embeds: [bananEmbed]})
        }

        interaction.reply({ embeds: [bananEmbed] })
    }
}
