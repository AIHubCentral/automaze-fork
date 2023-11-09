module.exports = {
    name: 'svc',
    category: 'Tags',
    description: 'why do you still use svc',
    aliases: [],
    syntax: `svc`,
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: (client, message, args, prefix) => {
        const { botResponses, botUtils } = client;
        const selectedMessage = botUtils.getRandomFromArray(botResponses.responses.svc);
        message.reply({ content: selectedMessage });
    }
}