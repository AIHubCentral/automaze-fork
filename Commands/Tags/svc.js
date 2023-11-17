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
		const { botConfigs, botResponses, botUtils } = client;
		const botResponse = {};
		/*
		const selectedMessage = botUtils.getRandomFromArray(botResponses.responses.svc);
		botResponse.content = selectedMessage;
		await message.channel.sendTyping();
		await delay(selectedMessage.length * 350);
		if (message.mentions.members.first()) {
			botResponse.allowedMentions = { repliedUser: true };
			// if mentioned a bot send 'how to make ai cover sticker'
			console.log(message.mentions.members.first());
			if (message.mentions.members.first().user.bot) {
				botResponse.content = '';
				botResponse.stickers = ['1159360069557813268'];
				return message.reply(botResponse);
			}
			botResponse.content = `${message.mentions.members.first()} ${selectedMessage}`;
			return message.channel.send(botResponse);
		}
		*/
		const imagePath = path.join(process.cwd(), 'assets', 'i_still_use_svc.gif');
		botResponse.embeds = [new EmbedBuilder().setImage(imagePath).setColor('Danger')];
		message.channel.send(botResponse);
	},
};