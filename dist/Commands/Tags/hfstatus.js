"use strict";
const { EmbedBuilder } = require('discord.js');
module.exports = {
    name: 'hfstatus',
    category: 'Tags',
    description: 'Where to check hugginface status',
    aliases: ['hfstatus'],
    syntax: 'hfstatus [member]',
    run: async (client, message) => {
        const { botData } = client;
        const embedData = botData.embeds.hfstatus.embeds[0];
        const embed = new EmbedBuilder()
            .setTitle(embedData.title)
            .setColor(embedData.color)
            .setDescription(embedData.description.join('\n'));
        await message.reply({ embeds: [embed] });
    },
};
