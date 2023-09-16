const { Events } = require('discord.js');

module.exports = {
    name: Events.GuildMemberRemove,
    once: false,
    execute(client) {
        console.log('someone was removed');
    }
};