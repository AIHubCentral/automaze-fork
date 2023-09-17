const { Events, AuditLogEvent, EmbedBuilder } = require('discord.js');

module.exports = {
	name: Events.GuildAuditLogEntryCreate,
	run(client, auditLogEntry, guild) {
		addModlogEvent(client, auditLogEntry, guild);
	},
};

async function addModlogEvent(client, auditLogEntry, guild) {
    const { action, executorId, targetId, reason } = auditLogEntry;
    const modlogChannelId = client.discordIDs.Channel.BansAndTimeouts;

    const desiredEvents = [
        AuditLogEvent.MemberUpdate, AuditLogEvent.MemberPrune, 
        AuditLogEvent.MemberBanAdd, AuditLogEvent.MemberKick
    ]

    if (!desiredEvents.includes(action)) return;

    const executor = await client.users.fetch(executorId);

    const guildMember = await guild.members.cache.get(targetId);
    
    // use the targetId if fail to fetch member
    const target = guildMember ? guildMember.user : targetId;

    const embedConfig = {
        color: 'Red',
        description: [],
    };

    //console.log(auditLogEntry);

    switch(action) {
        case AuditLogEvent.MemberUpdate:
            // assume the timeout was removed if this value is null
            if (!guildMember.communicationDisabledUntil) {
                embedConfig.color = 'Green';
                embedConfig.title = `⏳ ${target.username} timeout removed`;
                embedConfig.description.push(`\n**ID:** ${target.id}`);
                embedConfig.description.push(`**User:** ${target}`);
                embedConfig.description.push(`**Username:** ${target.username}`);
            }
            else {
                embedConfig.title = `User has been timed out ⏳`;
                embedConfig.description.push(`\n**ID:** ${target.id}`);
                embedConfig.description.push(`**User:** ${target}`);
                embedConfig.description.push(`**Username:** ${target.username}`);
                embedConfig.description.push(`\n**Reason:**\n> ${reason ?? 'Not provided.'}`);
            }
            embedConfig.description.push(`\nAction performed by ${executor} (${executor.username})`);
            break;
        case AuditLogEvent.MemberPrune:
            embedConfig.title = `${target.username} was pruned!`;
            embedConfig.description.push(`Executed by ${executor} <t:${Math.round(Date.now() / 1000)}:R>`);
            break;
        case AuditLogEvent.MemberBanAdd:
            embedConfig.title = `🚫 ${targetId} has been banned`;
            embedConfig.description.push(`**User:** <@${targetId}>`);
            embedConfig.description.push(`\n**Reason:**\n> ${reason ?? 'Not provided.'}`);
            embedConfig.description.push(`\nAction performed by ${executor} (${executor.username})`);
            break;
        case AuditLogEvent.MemberKick:
            embedConfig.title = `❌ ${targetId} has been kicked`;
            embedConfig.color = 'Orange';
            embedConfig.description.push(`**User:** <@${targetId}>`);
            embedConfig.description.push(`\n**Reason:**\n> ${reason ?? 'Not provided.'}`);
            embedConfig.description.push(`\nAction performed by ${executor} (${executor.username})`);
            break;
        default:
            console.error(`How did we get here?\nWho let the ${action} in?`);
            return;
    }

    // send the embed
    const eventEmbed = new EmbedBuilder()
        .setTitle(embedConfig.title)
        .setColor(embedConfig.color)
        .setDescription(embedConfig.description.join('\n'))
        .setTimestamp();
    await client.channels.cache.get(modlogChannelId).send({embeds: [eventEmbed]});
}
