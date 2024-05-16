"use strict";
module.exports = {
    name: 'social',
    category: 'Info',
    description: 'Links to AI HUB social media.',
    aliases: ['socialmedia', 'twitter', 'youtube'],
    syntax: `social [member]`,
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
     * @param {String} prefix
     */
    run: (client, message, args, prefix) => {
        const embeds = [
            client.botUtils.createEmbed({
                color: client.botConfigs.colors.theme.tertiary,
                title: '🔗 Follow AI HUB on social media',
                description: [
                    '- [Twitter (X)](https://aihub.wtf/twitter)',
                    '- [YouTube](https://aihub.wtf/youtube)',
                ]
            })
        ];
        if (message.mentions.members.first()) {
            return message.channel.send({ content: `*Suggestions for ${message.mentions.members.first()}*`, embeds: embeds });
        }
        message.channel.send({ embeds: embeds });
    }
};
