const { EmbedBuilder } = require("discord.js")

module.exports = {
    name: 'colab_br',
    category: 'Tags',
    description: 'Links de colabs traduzidos para português',
    aliases: ['colabs_br', 'br_colabs', 'br_colab'],
    syntax: `colab_br [member]`,
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: (client, message, args, prefix) => {
        const embedDescription = [];
        embedDescription.push('## Colabs RVC traduzidos para PT-BR');

        embedDescription.push('### AI-Cover-Gen-No-UI_para_YouTube');
        embedDescription.push('- [Para inferência com **vídeo do YouTube**](https://colab.research.google.com/drive/1_-yutFoAeOAPIJ_Hpb6_sJsEAEKjZXpE#scrollTo=PNIn-NKDjYJ3)');

        embedDescription.push('### AI-Cover-Gen-No-UI_upar_seu_AUDIO');
        embedDescription.push('- [Para inferência upando **seu próprio áudio**](https://colab.research.google.com/drive/1W81Lb0c3NmoUnl69PRdYw8zQX1LRRuFU#scrollTo=nEIsMZLwJ5kD)');
        embedDescription.push('\n> **Nota**: Os dois colabs acima faz a separação da voz do instrumental, aplica a voz modelo e junta novamente com o instrumental');
        
        embedDescription.push('### RVC v2 Arrumado para Treino');
        embedDescription.push('- Acesse o colab para treino [neste link](https://colab.research.google.com/drive/1c9ZayL4JRNyiXJMCmcSeT1StugNy-VQ-?usp=sharing)');

        embedDescription.push('\n> 💡 **Dica**: Use o comando `-rvc_br` para guias em **Português**');
        
        const embed = new EmbedBuilder()
            .setDescription(embedDescription.join('\n'))
            .setColor(`Yellow`);

        if (message.mentions.members.first()) {
            return void message.channel.send({content: `*Sugestões para ${message.mentions.members.first()}*`, embeds: [embed]});
        }

        message.channel.send({embeds: [embed]});
    }
}