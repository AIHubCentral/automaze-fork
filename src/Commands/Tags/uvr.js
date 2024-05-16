const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
	name: 'uvr',
	category: 'Tags',
	description: 'Ultimate Vocal Remover',
	aliases: [],
	syntax: 'uvr [member]',
	run: (client, message) => {
		const { botData, botUtils } = client;
		const mentionedUser = message.mentions.members.first();

		const botResponse = {};
		const buttons = botData.embeds.uvr.buttons.map(btnData => {
			return new ButtonBuilder().setLabel(btnData.label).setURL(btnData.url).setStyle(ButtonStyle.Link);
		});

		botResponse.embeds = [botUtils.createEmbed(botData.embeds.uvr.embeds[0])];
		botResponse.components = [new ActionRowBuilder().addComponents(buttons)];

		if (mentionedUser) {
			botResponse.content = `*Suggestion for ${mentionedUser}*`;
			return message.channel.send(botResponse);
		}

		message.reply(botResponse);
	},
};