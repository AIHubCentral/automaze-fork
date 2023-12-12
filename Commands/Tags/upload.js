const { TagResponseSender } = require('../../utils');

module.exports = {
	name: 'upload',
	category: 'Tags',
	description: 'How to upload to `huggingface.co`',
	aliases: ['huggingface', 'hf'],
	syntax: 'upload [member]',
	run: async (client, message) => {
		const { botData, botConfigs, discordIDs } = client;

		const sender = new TagResponseSender();
		sender.setConfigs(botConfigs);
		sender.setDefaultResponse(botData.embeds.guides.upload.en);
		sender.setTargetMessage(message);
		sender.setTargetUser(message.mentions.members.first());

		sender.languageChannelResponses.set(discordIDs.Channel.Spanish, botData.embeds.guides.upload.es);

		await sender.send();
	},
};
