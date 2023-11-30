/* eslint-disable indent */
const { TagResponseSender } = require('../../utils');

module.exports = {
	name: 'rvc',
	category: 'Tags',
	description: 'Retrieval-based Voice Conversion Documentation (a.k.a How to Make AI Cover)',
	aliases: ['guide', 'guides', 'docs', 'doc', 'documentation'],
	syntax: 'rvc [member]',
	/**
	 *
	 * @param {Client} client
	 * @param {Message} message
	 * @param {string[]} args
	 * @param {String} prefix
	 */
	run: async (client, message) => {
		const { botData, botConfigs, discordIDs } = client;

		const sender = new TagResponseSender();
		sender.setChannel(message.channel);
		sender.setDefaultResponse(botData.embeds.rvc.main);
		sender.setConfigs(botConfigs);

		const targetUser = message.mentions.members.first();

		if (targetUser) {
			sender.setTargetUser(targetUser);
		}

		sender.languageChannelResponses.set(discordIDs.Channel.Portuguese, botData.embeds.guides.rvc.pt);
		sender.languageChannelResponses.set(discordIDs.Channel.Spanish, botData.embeds.guides.rvc.es);

		await sender.send();
	},
};