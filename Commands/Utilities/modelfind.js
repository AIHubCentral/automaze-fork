const { EmbedBuilder, StringSelectMenuBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, ChannelSelectMenuInteraction } = require('discord.js');

module.exports = {
    name: 'modelfind',
    category: 'Utilities',
    description: 'Find a voice model in the #voice-model forum',
    aliases: ['find'],
    syntax: `modelfind <query>`,
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: async (client, message, args, prefix) => {
        // which channel send to user
        const targetChannel = message.guild.channels.cache.get(client.discordIDs.Forum.VoiceModel) ?? '**voice-models**';
        await message.reply(`This command is currently unavailable. Please visit the ${targetChannel} channel if you wish to search for a model.`);
    }
}