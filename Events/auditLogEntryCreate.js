const { Events, AuditLogEvent, EmbedBuilder } = require('discord.js');

module.exports = {
	name: Events.GuildAuditLogEntryCreate,
	run(client, auditLogEntry, guild) {
		addModlogEvent(client, auditLogEntry, guild);
	},
};

async function addModlogEvent(client, auditLogEntry, guild) {
    const { action, executorId, targetId } = auditLogEntry;
    const modlogChannelId = client.discordIDs.Channel.BansAndTimeouts;

    const desiredEvents = [
        AuditLogEvent.MemberUpdate, AuditLogEvent.MemberPrune, 
        AuditLogEvent.MemberBanAdd, AuditLogEvent.MemberKick
    ]

    if (!desiredEvents.includes(action)) return;

    const executor = await client.users.fetch(executorId);
    const guildMember = await guild.members.cache.get(targetId);
    
    const target = guildMember.user;
    const eventEmbed = new EmbedBuilder();

    console.log(guildMember.communicationDisabledUntil);

    const embedConfig = {
        color: 'Red',
    };


    switch(action) {
        case AuditLogEvent.MemberUpdate:
            // assume the timeout was removed if this value is null
            eventEmbed
                .setTitle(`${target.username} was timed out`)
                .setColor(embedConfig.color)
                .setDescription(`until ${guildMember.communicationDisabledUntil}\nExecuted by ${executor} <t:${Math.round(Date.now() / 1000)}:R>`);
            await client.channels.cache.get(modlogChannelId).send({embeds: [eventEmbed]});
            break;
        case AuditLogEvent.MemberPrune:
            eventEmbed
                .setTitle(`${target.username} was pruned!`)
                .setColor(embedConfig.color)
                .setDescription(`Executed by ${executor} <t:${Math.round(Date.now() / 1000)}:R>`);
            await client.channels.cache.get(modlogChannelId).send({embeds: [eventEmbed]});
            break;
        case AuditLogEvent.MemberBanAdd:
            eventEmbed
                .setTitle(`${target.username} has been banned!`)
                .setColor(embedConfig.color)
                .setDescription(`Executed by ${executor} <t:${Math.round(Date.now() / 1000)}:R>`);
            await client.channels.cache.get(modlogChannelId).send({embeds: [eventEmbed]});
            break;
        case AuditLogEvent.MemberKick:
            eventEmbed
                .setTitle(`${target.username} has been kicked!`)
                .setColor(embedConfig.color)
                .setDescription(`Executed by ${executor} <t:${Math.round(Date.now() / 1000)}:R>`);
            await client.channels.cache.get(modlogChannelId).send({embeds: [eventEmbed]});
            break;
        default:
            console.error(`How did we get here?\nWho let the ${action} in?`);
    }
}
