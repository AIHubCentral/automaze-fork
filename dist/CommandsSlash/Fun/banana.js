"use strict";
const { SlashCommandBuilder } = require("discord.js");
const { banan } = require('../../utils.js');
module.exports = {
    category: `Fun`,
    type: `slash`,
    data: new SlashCommandBuilder()
        .setName('banana')
        .setDescription('BANAN SOMEOME!!!!11!111!11')
        .addUserOption(option => option.setName('user').setDescription('User to banan')),
    async execute(interaction) {
        const targetUser = interaction.options.getUser('user');
        if (targetUser === null) {
            console.log('NuLLLL');
            interaction.client.logger.debug('No user specified for banan', {
                more: {
                    guildId: interaction.guild.id,
                    channelId: interaction.channel.id,
                }
            });
            return interaction.reply({ content: 'You forgot to select the user!', ephemeral: true });
        }
        let guildMember = interaction.guild.members.cache.get(targetUser.id);
        if (guildMember === null) {
            interaction.client.debug('Guild member not found in cache...Fetching ' + targetUser.id);
            guildMember = interaction.guild.members.fetch(targetUser.id);
        }
        await banan(interaction, targetUser, guildMember);
    }
};
