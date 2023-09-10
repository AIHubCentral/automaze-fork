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
        await message.reply(`This command has changed to /find`);
    }
}