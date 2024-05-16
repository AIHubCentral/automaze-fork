const { LanguageResponseSender } = require('../../utils');

module.exports = {
	name: 'colab',
	category: 'Tags',
	description: 'Links to all working colabs/spaces',
	aliases: ['colabs', 'disconnected', 'train', 'training', 'spaces', 'hf', 'hugginface'],
	syntax: 'colab [member]',
	run: async (client, message) => {
		const { botData, botConfigs, discordIDs } = client;
		const sender = new LanguageResponseSender(botConfigs, discordIDs.Channel);
		sender.setTargetMessage(message);
		sender.setContent(botData.embeds.colab);
		sender.setTargetUser(message.mentions.members.first());
		await sender.send();
	},
};