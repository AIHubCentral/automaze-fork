const { Events } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: Events.ChannelDelete,

    run(client, channel){
        const channels = require('../JSON/channels.json');

        if(channel.id != channels.modlog?.id) return;

        channels.modlog = null;
        fs.writeFileSync(`${process.cwd()}/JSON/channels.json`, JSON.stringify(channels, null, 2));
    }
}