const { EmbedBuilder } = require("discord.js");
const { byValue, byNumber } = require('sort-es')

module.exports = {
  name: 'topbanana',
  category: 'Fun',
  description: 'SEE HOW MUCH SOMEONE GOT BANAN!!!!11!111!11',
  aliases: ['topbanan', 'bananatop', 'banantop'],
  syntax: `topbanana [member]`,
  /**
   * 
   * @param {Client} client 
   * @param {Message} message 
   * @param {string[]} args 
   * @param {String} prefix 
   */
  run: async (client, message, args, prefix) => {
    const embed = new EmbedBuilder()
        .setColor('Red')
        .setTitle('DEPRECATED')
        .setDescription(`Use \`/topbanana\``)
        .setFooter({'text': 'Note: -topbanana will be removed soon'});
    await message.channel.send({embeds: [embed]});
}
}