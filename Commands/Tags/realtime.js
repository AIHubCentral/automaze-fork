const { EmbedBuilder } = require("discord.js")

module.exports = {
    name: 'realtime',
    category: 'Tags',
    description: 'RVC real-time conversion guide',
    aliases: ['rt'],
    syntax: `realtime [member]`,
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: (client, message, args, prefix) => {
        const embedDescription = [];
        embedDescription.push(`## 1. (Local) W-Okada Voice Changer\nThis has more options and is somewhat more convenient to use than Real-time RVC.\n**GUIDE**: https://rentry.co/VoiceChangerGuide`);
        embedDescription.push(`## 2. (Online) W-Okada - Colab Version\nA free, online version of W-Okada that allows you to run code on Google’s powerful GPUs.\n**GUIDE**: https://docs.google.com/document/d/e/2PACX-1vTIceEcBfS6Zqolv_QEysrFfI_EJikPxozWptP_EjkpLVl-l-gdo-ijBonQMTviAHEYm5emmd9k9TdC/pub`);
        embedDescription.push(`## 3. (Local) Real-time conversion of RVC\nIt's more accurate but requires a Nvidia RTX card.\n**GUIDE**: https://docs.google.com/document/d/1haQAWn4Hnh3Aq8SSGX0tBSY3rDzjYJAcczrUy63oTTs/edit`);
        embedDescription.push('## 4. Russian FAQ for RVC/Voice changer\nhttps://github.com/MaHivka/ultimate-voice-models-FAQ');

        const embed = new EmbedBuilder()
            .setTitle(`Realtime Voice Changer`)
            .setDescription(embedDescription.join('\n'))
            .setColor(`Yellow`);

        if (message.mentions.members.first()) {
            return void message.channel.send({content: `*Tag suggestion for ${message.mentions.members.first()}*`, embeds: [embed]});
        }

        message.channel.send({embeds: [embed]});
    }
}