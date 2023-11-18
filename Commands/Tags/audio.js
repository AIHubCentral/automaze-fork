module.exports = {
	name: 'audio',
	category: 'Tags',
	description: 'Guides on how to isolate audio for making datasets',
	aliases: ['dataset'],
	syntax: 'audio [member]',
	run: async (client, message) => {
		const { botData, botConfigs, botUtils } = client;
		const mentionedUser = message.mentions.members.first();

		const botResponse = {};
		botResponse.embeds = botUtils.createEmbeds(
			botData.embeds.guides.audio.en,
			botUtils.getAvailableColors(botConfigs),
		);

		if (mentionedUser) {
			botResponse.content = `*Suggestion for ${mentionedUser}*`;
			return message.channel.send(botResponse);
		}

		message.channel.send(botResponse);
	},
};