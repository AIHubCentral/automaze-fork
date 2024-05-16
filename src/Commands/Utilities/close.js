const { getChannelById } = require('../../utils.js');

async function addTagToThread(thread, tagId) {
	try {
		const appliedTags = thread.appliedTags;

		// don't add the tag if it's laready there
		if (appliedTags.includes(tagId)) return;

		appliedTags.push(tagId);
		await thread.setAppliedTags(appliedTags);
		console.log(`Tag ${tagId} added to ${thread.name}`);
	}
	catch (error) {
		console.error(`Failed to add tag: ${error}`);
	}
}

module.exports = {
	name: 'close',
	category: 'Utilities',
	description: 'Allows user to close their forum thread.',
	aliases: ['lock'],
	syntax: 'close',
	/**
	 *
	 * @param {Client} client
	 * @param {Message} message
	 * @param {string[]} args
	 * @param {String} prefix
	 */
	run: async (client, message) => {
		const channel = message.channel;
		if (!channel.isThread()) return;

		const { botConfigs, botUtils, discordIDs } = client;

		// user can close posts in these channels
		const allowedChannels = [
			discordIDs.Forum.VoiceModel,
			discordIDs.Forum.TaskSTAFF,
			discordIDs.Forum.RequestModel.ID,
		];

		if (!allowedChannels.includes(message.channel.parentId)) return;

		if (channel.locked) {
			return message.reply('This channel have already been locked.');
		}

		const availableColors = botUtils.getAvailableColors(botConfigs);
		const botResponse = {};
		const embedData = {
			title: 'Thread closed',
		};

		let userAllowedToClose = false;
		let userIsStaff = false;

		if (message.author.id !== channel.ownerId) {
			// if it's not the thread author, check if it's a staff member
			const allowedRoles = [
				discordIDs.Roles.Admin,
				discordIDs.Roles.Mod,
			];
			const userRoles = message.member.roles.cache;
			for (const roleId of allowedRoles) {
				if (userRoles.has(roleId)) {
					userAllowedToClose = true;
					userIsStaff = true;
					embedData.description = ['This post was closed by a staff member.'];
					break;
				}
			}
		}
		else {
			// author of the post
			userAllowedToClose = true;
			embedData.description = ['User has closed their post.'];
		}

		if (!userAllowedToClose) {
			botResponse.content = 'You are not the author of this post.';
			return message.reply(botResponse);
		}
		else {
			botResponse.embeds = botUtils.createEmbeds([embedData], availableColors);
			await channel.send(botResponse);

			await channel.setAutoArchiveDuration(60);
			await channel.setLocked(true);

			// add the 'Done' tag if it's not there
			await addTagToThread(channel, discordIDs.Forum.RequestModel.Tags.Done);

			const logChannel = await getChannelById(discordIDs.Channel.Moderation, message.guild);
			const threadLink = `https://discordapp.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`;

			embedData.title = '🔒 A thread has been locked';
			embedData.description = [
				`<@${message.author.id}> (${message.author.username}) has closed a post`,
				`\nGo to thread: [${channel.name}](${threadLink})`,
			];

			botResponse.content = '';
			botResponse.embeds = botUtils.createEmbeds([embedData], availableColors);

			await logChannel.send(botResponse);

			if (userIsStaff) {
				await message.delete();
			}
		}
	},
};
