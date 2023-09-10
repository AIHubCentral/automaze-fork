const { EmbedBuilder } = require(`discord.js`);

module.exports = {
    name: 'spanishguides',
    category: 'Tags',
    description: 'Guías en español.',
    aliases: ['es_guides', 'es_g'],
    syntax: `es_g [member]`,
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: async (client, message, args, prefix) => {
        const embedDescription = [];
        embedDescription.push('## • Tutorial de Applio en español\nhttps://www.youtube.com/watch?v=bOAM_9xyHFY');
        embedDescription.push('### Servidor IA Hispano\nhttps://discord.gg/iahispano');

        const embed = new EmbedBuilder()
            .setTitle(`Guías en español.`)
            .setDescription(embedDescription.join('\n'))
            .setColor(`Yellow`);

        if (message.mentions.members.first()) {
            return message.channel.send({content: `*Sugerencia para ${message.mentions.members.first()}*`, embeds: [embed]});
        }

        message.channel.send({embeds: [embed]});
    }
}