/* eslint-disable indent */
const { ChannelType } = require('discord.js');
const { getChannelById } = require('../utils.js');
const delay = require('node:timers/promises').setTimeout;

module.exports = {
	name: 'messageCreate',
	once: false,
	async run(client, message) {
		// only proceed if reactions is enabled in configs
		if (!client.botConfigs.general.reactions) return;

		// don't react to itself
		if (message.author.bot) return;

		// don't react to threads
		if (message.channel.type === ChannelType.PublicThread) return;

		// skip prefix commands
		const prefix = client.prefix.ensure(message.guild.id, '-');
		if (message.content.startsWith(prefix)) return;

		// e_boorgir reaction ignores cooldown
		if (message.content.includes(':e_boorgir:')) {
			return await message.react('<:e_boorgir:1159654275069255750>');
		}

		// check if user is on cooldown
		if (client.cooldowns.reactions.has(message.author.id)) {
			const cooldownExpiration = client.cooldowns.reactions.get(message.author.id);
			const currentDate = new Date();

			if (currentDate.getTime() < cooldownExpiration.getTime()) {
				// user is on cooldown, don't add reactions
				return;
			}
			else {
				// cooldown expired
				client.cooldowns.reactions.delete(message.author.id);
			}
		}

		// don't add reaction if there are attachments
		if (message.attachments.size > 0) return;

		const messageLowercase = message.content.toLowerCase();

		// don't react if keyword is in an url
		if (messageLowercase.includes('http')) return;

		try {
			let regex;
			let foundKeyword = false;
			let matchedKeywords = 0;

			// max of 20 reactions
			let reactionCounter = 0;
			for (const item of client.botData.reactionKeywords) {
				if (reactionCounter >= 20) break;

				let randomNumber = 0;
				let shouldProceed = true;

				if (item.frequency) {
					if (item.frequency === 'rare') {
						randomNumber = client.botUtils.getRandomNumber(0, 100);
					}
					else if (item.frequency === 'sometimes') {
						randomNumber = client.botUtils.getRandomNumber(0, 10);
					}
					else if (item.frequency === 'often') {
						randomNumber = client.botUtils.getRandomNumber(0, 2);
					}

					shouldProceed = randomNumber === 0;
				}

				if (!shouldProceed) continue;

				for (const keyword of item.keywords) {
					// text is exact the keyword
					if (item.exact) {
						foundKeyword = messageLowercase === keyword;
					}
					else {
						// otherwise check if text includes the keyword
						// foundKeyword = messageLowercase.includes(keyword);
						regex = new RegExp(`(?<!:)\\b${keyword}\\b`);
						foundKeyword = regex.test(messageLowercase);
					}

					if (foundKeyword) {
						matchedKeywords++;

						// only needs to match one keyword
						if (matchedKeywords > 1) break;

						// console.log('found', item);
						const botResponse = { allowedMentions: { repliedUser: true } };

						switch (item.kind) {
							case 'sticker':
								botResponse.stickers = [item.stickerId];
								await delay(3_000);
								await message.reply(botResponse);
								break;
							case 'text':
								botResponse.content = client.botUtils.getRandomFromArray(item.responses);
								await message.channel.sendTyping();
								await delay(botResponse.content.length * 350);
								await message.reply(botResponse);
								break;
							default:
								for (const emoji of item.emojis) {
									await message.react(emoji);
									await delay(2000);
									reactionCounter++;
								}
						}
					}
				}
				// console.log('End of keyword check');
			}
		}
		catch (error) {
			console.log('Failed to add reaction');
			console.error(error);
			// sends a log to the dev server
			if (client.botConfigs.general.sendLogs) {
				const { botConfigs } = client;
				const devServerGuild = client.guilds.cache.get(botConfigs.devServerId);
				const botDebugChannel = await getChannelById(botConfigs.debugChannelId, devServerGuild);
				const messageLink = `https://discordapp.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`;
				await botDebugChannel.send(`Failed to add reaction:\n> [Go to message](${messageLink})`);
			}
		}
	},
};
