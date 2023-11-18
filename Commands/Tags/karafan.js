const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
	name: 'karafan',
	category: 'Tags',
	description: 'KaraFan audio separation tool',
	aliases: [],
	syntax: 'karafan [member]',
	run: (client, message) => {
		const { botData, botUtils } = client;
		const mentionedUser = message.mentions.members.first();

		const botResponse = {};
		const buttons = botData.embeds.karafan.buttons.map(btnData => {
			return new ButtonBuilder().setLabel(btnData.label).setURL(btnData.url).setStyle(ButtonStyle.Link);
		});

		botResponse.embeds = [botUtils.createEmbed(botData.embeds.karafan.embeds[0])];
		botResponse.components = [new ActionRowBuilder().addComponents(buttons)];

		if (mentionedUser) {
			botResponse.content = `*Suggestion for ${mentionedUser}*`;
			return message.channel.send(botResponse);
		}

		message.reply(botResponse);
	},
};