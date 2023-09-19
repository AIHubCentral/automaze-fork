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
        embedDescription.push('# Guides');
        embedDescription.push(`## • Perfecting Audio Isolation on Low-End Rigs: A Practical Guide (by Litsa The Dancer and Faze Masta)\nhttps://docs.google.com/document/d/1HmkG9cmL8SLX7-vJcPT1-1KgUQtCrwXB8CicYmG4LW8/edit?usp=sharing`);
        embedDescription.push(`## • Guide: Gathering and Isolating Audio (by SCRFilms)\nhttps://docs.google.com/document/d/1wTJ_wutDqEtsA99BJOXDDGax25pPIDE84O5E2Rio5Qk/edit#heading=h.g896c5vbh0dv`);
        embedDescription.push('## • How to make a good model All-In-One guide by LUSBERT\nhttps://rentry.org/RVC_making-models');
        embedDescription.push('## • Vocal mixing tutorial by Roomie\nhttps://www.youtube.com/watch?v=rSxLF3kkBw0');
        embedDescription.push('# Tools');
        embedDescription.push('## Youtube Downloaders');
        embedDescription.push('- https://github.com/yt-dlp/yt-dlp');
        embedDescription.push('- https://github.com/dsymbol/yt-dlp-gui');
        embedDescription.push('## Audio Separation/Isolation');
        embedDescription.push('- https://ultimatevocalremover.com/');
        embedDescription.push('- https://mvsep.com/');
        embedDescription.push('- 🆕 https://github.com/Captain-FLAM/KaraFan');
        embedDescription.push('- https://goyo.app/ (Note that this plugin is for clean ups only, like removing background noise, reverb, ambience or sustained sounds)')
        embedDescription.push('\n> **Tip:** Use `-colab` command if you\'re looking for audio separation/isolation colabs.');

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