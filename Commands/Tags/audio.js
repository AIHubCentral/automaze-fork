const { EmbedBuilder } = require("discord.js")

module.exports = {
    name: 'audio',
    category: 'Tags',
    description: 'Guides on how to isolate audio for making datasets',
    aliases: ['dataset', 'uvr'],
    syntax: `audio [member]`,
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: async(client, message, args, prefix) => {
        const embedDescription = [];
        embedDescription.push('## Guides');
        embedDescription.push(`### • Perfecting Audio Isolation on Low-End Rigs: A Practical Guide (by Litsa The Dancer and Faze Masta)\nhttps://docs.google.com/document/d/1HmkG9cmL8SLX7-vJcPT1-1KgUQtCrwXB8CicYmG4LW8/edit?usp=sharing`);
        embedDescription.push(`### • Guide: Gathering and Isolating Audio (by SCRFilms)\nhttps://docs.google.com/document/d/1wTJ_wutDqEtsA99BJOXDDGax25pPIDE84O5E2Rio5Qk/edit#heading=h.g896c5vbh0dv`);
        embedDescription.push(`### • Instrumental, Vocal Separation & Mastering Guide\nhttps://docs.google.com/document/d/17fjNvJzj8ZGSer7c7OFe_CNfUKbAxEh_OBv94ZdRG5c/edit`);
        embedDescription.push('## Tools');
        embedDescription.push('### • Ultimate Vocal Remover (UVR)\nhttps://ultimatevocalremover.com/');
        embedDescription.push('\n> **Tip:** Use `-colab` command if you\'re looking for UVR/MDX colabs');

        const embed = new EmbedBuilder()
            .setTitle(`Audio isolation / Dataset creation`)
            .setDescription(embedDescription.join('\n'))
            .setColor(`Yellow`)

        if (message.mentions.members.first()) {
            return message.channel.send({content: `*Tag suggestion for ${message.mentions.members.first()}*`, embeds: [embed]});
        }

        message.channel.send({embeds: [embed]});
    }
}