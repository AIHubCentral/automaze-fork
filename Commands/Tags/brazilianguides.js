const { EmbedBuilder } = require(`discord.js`);

module.exports = {
    name: 'brazilianguides',
    category: 'Tags',
    description: 'Guias traduzidos em português para iniciantes.',
    aliases: ['br_guides', 'br_g'],
    syntax: `br_g [member]`,
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: async (client, message, args, prefix) => {
        const embedDescription = [];
        embedDescription.push('## • Criando covers e treino utilizando Colab: \nhttps://docs.google.com/document/d/1Mmoocy4luVSFRqqGI1NGQHbMGKMNRPNyFrhJRuLEkcs/?usp=sharing');
        embedDescription.push('## • Instalando RVC Localmente:\nhttps://docs.google.com/document/d/1mivBJRFtcg4erID_9jfxJA_ycXRGUmiCm37CuF8xVA0');
        embedDescription.push('## • Como usar o RVC em tempo real (por Rafa.Godoy)\nhttps://docs.google.com/document/d/1Do49gmj7nKj35sZc-5WHXtwZHg0-cSPnH--6WdlvPSc/edit?usp=sharing');
        embedDescription.push('\n### Servidor **AI HUB Brasil**\nhttps://discord.gg/aihubbrasil')

        const embed = new EmbedBuilder()
            .setTitle(`Guias PT-BR`)
            .setDescription(embedDescription.join('\n'))
            .setColor(`Yellow`)
            .setFooter({ text:'Créditos: MrM0dZ, Rafa.Godoy e Inconstantino' });

        if (message.mentions.members.first()) {
            return message.channel.send({content: `*Sugestão para ${message.mentions.members.first()}*`, embeds: [embed]});
        }

        message.channel.send({embeds: [embed]});
    }
}