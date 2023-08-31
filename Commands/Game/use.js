const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'use',
    category: 'Game',
    description: 'Use an item from your inventory',
    aliases: [],
    syntax: 'use <item>',
    run: async (client, message, args, prefix) => {
        const embed = new EmbedBuilder()
            .setColor('Orange')
            .setDescription(`This command is temporarily unavailable, stay tuned!`);
        await message.channel.send({embeds: [embed]});
    }
}