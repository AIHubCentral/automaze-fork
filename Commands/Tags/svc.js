const { EmbedBuilder } = require('discord.js');
const path = require('node:path');
const delay = require('node:timers/promises').setTimeout;

module.exports = {
	name: 'svc',
	category: 'Tags',
	description: 'why do you still use svc',
	aliases: [],
	syntax: 'svc',
	/**
	 *
	 * @param {Client} client
	 * @param {Message} message
	 * @param {string[]} args
	 * @param {String} prefix
	 */
	run: async (client, message) => {
		const { botResponses, botUtils } = client;
		const botResponse = {};
		const randomNumber = botUtils.getRandomNumber(0, 1);
		const mentionedUser = message.mentions.members.first();

		if (randomNumber !== 0) {
			const gifUrl = 'https://tenor.com/view/crowd-avoiding-man-gif-25257570';
			botResponse.content = '# Yeah I still use so-vits-SVC\n' + gifUrl;
			return message.reply(botResponse);
		}

		const selectedMessage = botUtils.getRandomFromArray(botResponses.responses.svc);
		botResponse.content = selectedMessage;

		if (mentionedUser) {
			botResponse.content = `${mentionedUser} ${selectedMessage}`;

			// if mentioned a bot send 'how to make ai cover sticker'
			if (mentionedUser.user.bot) {
				botResponse.allowedMentions = { repliedUser: true };
				botResponse.content = '';
				botResponse.stickers = ['1159360069557813268'];
				return message.reply(botResponse);
			}

			await message.channel.sendTyping();
			await delay(selectedMessage.length * 350);
			return message.channel.send(botResponse);
		}

		await message.channel.sendTyping();
		await delay(selectedMessage.length * 350);
		return message.reply(botResponse);
	},
};