const { BotResponseBuilder, TagResponseSender } = require('../../utils');

module.exports = {
	name: 'egirl',
	category: 'Tags',
	description: 'LATINA E GIRL VOICE PLLLSS',
	aliases: [],
	syntax: 'egirl [member]',
	run: async (client, message) => {
		const { botData, botConfigs } = client;

		const botResponse = new BotResponseBuilder();
		botResponse.addEmbeds(botData.embeds.egirl.embeds, botConfigs);
		botResponse.addButtons(botData.embeds.egirl.buttons);

		const sender = new TagResponseSender();
		sender.setChannel(message.channel);
		sender.setConfigs(botConfigs);
		sender.setDefaultResponse(botData.embeds.egirl);
		sender.setTargetMessage(message);
		sender.setTargetUser(message.mentions.members.first());
		sender.setIsReply(true);

		await sender.send();
	},
};