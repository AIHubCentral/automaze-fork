const { EmbedBuilder } = require("discord.js")

module.exports = {
    name: 'colab',
    category: 'Tags',
    description: 'Links to inference and training colabs made by kalo',
    aliases: ['colabs'],
    syntax: `colab [member]`,
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: (client, message, args, prefix) => {
        const embedDescription = [];
        embedDescription.push('## RVC');
        /*
        embedDescription.push(`### • Applio Colab 🍏 (NEWEST)\nhttps://colab.research.google.com/drive/157pUQep6txJOYModYFqvz_5OJajeh7Ii`);
        embedDescription.push(`### • RVC v2 Easy GUI Colab (outdated)\nhttps://colab.research.google.com/drive/1Gj6UTf2gicndUW_tVheVhTXIIYpFTYc7?usp=sharing`);
        */
        embedDescription.push('### • Applio-RVC-Fork 🍏\nhttps://www.kaggle.com/code/IAHispano/Applio-RVC-Fork');
        embedDescription.push('\n> Note: The code is now on **Kaggle** due to Google restricting colab free tier usage. Use the `-rvc` command to see the new guide.');
        embedDescription.push('## UVR / MDX Colabs');
        embedDescription.push('Use these if you wish to isolate vocals or instrumental');
        embedDescription.push('### • UVR arch colab 5.0.2/c1.04\nhttps://colab.research.google.com/drive/16Q44VBJiIrXOgTINztVDVeb0XKhLKHwl');
        embedDescription.push('### • MDX Net Colab\nhttps://colab.research.google.com/github/NaJeongMo/Colab-for-MDX_B/blob/main/MDX-Net_Colab.ipynb');

        const embed = new EmbedBuilder()
            .setTitle(`Google Colabs`)
            .setDescription(embedDescription.join('\n'))
            .setColor(`Yellow`);

        if (message.mentions.members.first()) {
            return void message.channel.send({content: `*Tag suggestion for ${message.mentions.members.first()}*`, embeds: [embed]});
        }

        message.channel.send({embeds: [embed]});
    }
}