const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'esnipe',
    category: 'Fun',
    description: 'Returns the last edited message in current or specified channel',
    aliases: ['editsnipe'],
    syntax: `esnipe [channel]`,
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: async(client, message, args, prefix) => {
        const disallowedChannel = message.channel.id == client.discordIDs.Channel.MakingModels || message.channel.id == client.discordIDs.Channel.GetModelMakerRole;
        if (disallowedChannel) {
            const botReply = await message.reply('This command is not available in this channel.');
            setTimeout(async()=>{
                await message.delete();
                await botReply.delete();
            },6000);
            return;
        }

        const randomMessages = [];
        randomMessages.push(`Yep ${message.author}, this command is no longer available, thanks for asking!`);
        randomMessages.push(`I didn't see what was edited, sorry :rofl:`);
        randomMessages.push(`A message was edited :thumbsup:`);
        randomMessages.push(`Nothing was edited`);
        randomMessages.push(`${message.author} how to make ai cover? :scream_cat:`);
        randomMessages.push(`${message.author} this ai hub shit gets dangerous :gun:`);
        randomMessages.push(`${message.author} stop using this command frfr`);
        randomMessages.push(`Something was edited? What???`);
        randomMessages.push(`${message.author} now im curious as well, what was edited???`);
        const selectedMessage = randomMessages[Math.floor(Math.random() * randomMessages.length)];
        const embed = new EmbedBuilder()
        .setTitle(`💀 i didn't saw what you edited`)
        .setColor(0xFFFF00)
        .setDescription(selectedMessage);
        await message.channel.send({embeds: [embed]});
    }
}