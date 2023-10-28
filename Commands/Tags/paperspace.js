const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    name: 'paperspace',
    category: 'Tags',
    description: 'Paperspace tutorial by LollenApe',
    aliases: [],
    syntax: `paperspace [member]`,
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: (client, message, args, prefix) => {
        const embeds = [
            client.botUtils.createEmbed(client.botData.embeds.paperspace, client.botConfigs.colors.theme.primary),
        ];

        const button = new ButtonBuilder()
            .setLabel('Google Docs')
            .setURL('https://docs.google.com/document/d/1lIAK4Y0ylash_1M2UTTL_tfA3_mEzP0D2kjX2A3rfSY/edit?usp=sharing')
            .setStyle(ButtonStyle.Link);

        const actionRow = new ActionRowBuilder()
            .addComponents(button);

        if (message.mentions.members.first()) {
            // check if mentioned the bot
            if (client.user.id === message.mentions.members.first().id) {
                return message.reply('Thanks, I\'ll check it out!');
            }

            return message.channel.send({content: `Suggestion for ${message.mentions.members.first()}\n\n`, embeds: embeds, components: [actionRow]});
        }

        message.channel.send({ embeds: embeds, components: [actionRow] });
    }
}