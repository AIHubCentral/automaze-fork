const { EmbedBuilder } = require(`discord.js`);

module.exports = {
    name: 'brazilianguides',
    category: 'Tags',
    description: 'Guias traduzidos em português para iniciantes.',
    aliases: ['br_guides', 'br_g', 'br_rvc', 'rvc_br'],
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
        embedDescription.push('## Guias RVC em PT-BR');

        embedDescription.push('### AI-Cover-Gen-No-UI');
        embedDescription.push('- Acesse o guia [neste link](https://docs.google.com/document/d/1BA_ln2159GbwTiJvTjCvqOAuYLq32A21PshW3RXhT6E/edit?usp=sharing).');

        embedDescription.push('### 🍏 Applio-RVC-Fork: Guia PT-BR');
        embedDescription.push('- Acesse o guia [neste link](https://docs.google.com/document/d/1PIMJ39xHp2kfbh4kUuvD2MZjVdeweezmwIm8Y8l6p8A/edit?usp=sharing).');
        embedDescription.push('\n> ⚠️ Aviso: O Kaggle está banindo contas que utilizam RVC na plataforma, use por sua conta e risco.');
        
        embedDescription.push('### Tutoriais em Vídeo');
        embedDescription.push('- [Como fazer AI COVER - Método NOVO](https://youtu.be/QTz18CSyYmE) (créditos **AI HUB BRASIL**)');
        embedDescription.push('- [COMO TREINAR UM MODELO DE VOZ PARA O RVC NO CELULAR](https://youtu.be/PoNoaI8DFP8?si=VccKwtkEKgAcaPNn) (créditos **Vector Lua**)');
        embedDescription.push('- [Como fazer Deep Fake (Maneira Fácil) - Android e PC](https://youtu.be/Z_k1YV_Tn40?si=Fu4hmEZOPOuGZ0On) (créditos **AI HUB BRASIL**)');

        embedDescription.push('\n> 💡 **Dica**: Use o comando `-colabs_br` para links de colabs traduzidos em **Português**');

        embedDescription.push('### Servidor AI HUB BRASIL');
        embedDescription.push('- https://discord.gg/aihubbrasil');
        
        const embed = new EmbedBuilder()
            .setDescription(embedDescription.join('\n'))
            .setColor(`Yellow`);

        if (message.mentions.members.first()) {
            return void message.channel.send({content: `*Sugestões para ${message.mentions.members.first()}*`, embeds: [embed]});
        }

        message.channel.send({embeds: [embed]});
    }
}