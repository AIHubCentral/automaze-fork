const { EmbedBuilder } = require("discord.js");
const utils = require('../../utils.js');

module.exports = {
    name: 'rvc',
    category: 'Tags',
    description: 'Retrieval-based Voice Conversions guide links made by kalo',
    aliases: [],
    syntax: `rvc [member]`,
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: (client, message, args, prefix) => {
        const embedDescription = [];
        embedDescription.push('## • 🆕 Applio-RVC-Fork: Guide (EN/ES)\nhttps://docs.google.com/document/d/12YmIQFLFzth1YsZJMGrA0aeTN0Go8DNZVw8LFSf-Hug');
        embedDescription.push(`### • RVC v2 AI Cover Guide (by Kalomaze)\nhttps://docs.google.com/document/d/13_l1bd1Osgz7qlAZn-zhklCbHpVRk6bYOuAuB78qmsE/edit?usp=sharing`);
        embedDescription.push(`### • Training RVC v2 models guide (by Kalomaze)\nhttps://docs.google.com/document/d/13ebnzmeEBc6uzYCMt-QVFQk-whVrK4zw8k7_Lw3Bv_A/edit?usp=sharing`);
        embedDescription.push(`### • Installing Mangio RVC v2 Locally (OUTDATED)\nhttps://docs.google.com/document/d/1KKKE7hoyGXMw-Lg0JWx16R8xz3OfxADjwEYJTqzDO1k/edit`);

        const embed = new EmbedBuilder()
            .setTitle(`RVC Guides (how to make ai cover)`)
            .setDescription(embedDescription.join('\n'))
            .setColor(`Yellow`);

        if (message.mentions.members.first()) {
            // easter egg - show 'how to make ai cover meme'
            const randomNumber = utils.getRandomNumber(1, 100);
            if (randomNumber === 50) {
                embed.setImage('https://cdn.discordapp.com/attachments/1144111245415420017/1144111245709025390/7q6fht.jpg');
            }
            return message.channel.send({content: `*Tag suggestion for ${message.mentions.members.first()}*`, embeds: [embed]});
        }

        message.channel.send({embeds: [embed]});
    }
}