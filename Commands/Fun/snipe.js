const { EmbedBuilder } = require("discord.js");

const responses = [
    '👀 nice try...',
    '👀 hmmm...sus',
    'I saw what you did there 😏',
    'NOPE 😤',
    'Snipers...Get down!!! 🤣🤣🤣',
    'only if you tell me how to make ai cover',
    'wohoaa epic faill 🤣🤣🤣🤣',
    'fail', 'EPIC FAIL BRUHHH 😂😂😂😂',
    'what??? this command was removed 🤪',
    'BOOMERRR!!! 🤣🤣🤣🤣',
    '👏👏👏👏 CAUGHT YOU SNIPERRR!!!!',
    '💩💩💩💩💩', '🧐', '🤭', '😱', '👻', '👀',
    'https://tenor.com/view/rickroll-roll-rick-never-gonna-give-you-up-never-gonna-gif-22954713'
];

module.exports = {
    name: 'snipe',
    category: 'Fun',
    description: 'Returns the last deleted message in current or specified channel',
    aliases: [],
    syntax: `snipe [channel]`,
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: async(client, message, args, prefix) => {
        const selectedResponse = responses[Math.floor(Math.random() * responses.length)];
        return await message.reply(selectedResponse);
    }
}