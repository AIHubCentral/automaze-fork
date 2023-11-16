/* eslint-disable indent */
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
	run: async (client, message, args, prefix) => {
		// remove mentions
		const filteredArgs = args.filter(str => !str.includes('@'));
		let messageTitle = 'RVC Guides (How to Make AI Cover)';
		let messageContent = 'Here are some useful resources to help you learn how to make ai covers';
		let messageBlooper = 'bruh i know how to make ai cover';

		let embeds = [
			client.botUtils.createEmbed(client.botData.embeds.rvc.main, client.botConfigs.colors.theme.primary),
		];

		// get the first argument
		if (filteredArgs.length > 0) {
			switch (filteredArgs[0]) {
				case 'br':
					embeds = [
						client.botUtils.createEmbed(client.botData.embeds.rvc.pt.guides, client.botConfigs.colors.country.brazil[0]),
						client.botUtils.createEmbed(client.botData.embeds.rvc.pt.videos, client.botConfigs.colors.country.brazil[1]),
					];
					messageTitle = 'Guias RVC (como fazer cover com IA)';
					messageContent = 'Veja essas recomendações abaixo';
					messageBlooper = 'Eu sei fazer covers 🤣';
					break;
				case 'tr':
					embeds = [client.botUtils.createEmbed(client.botData.embeds.rvc.tr)];
					messageTitle = 'Turkish Guides';
					break;
				case 'es':
					embeds = [client.botUtils.createEmbed(client.botData.embeds.rvc.es)];
					messageTitle = 'Guías en español';
					break;
				case 'kr':
					embeds = [client.botUtils.createEmbed(client.botData.embeds.rvc.kr)];
					messageTitle = '가이드 링크';
					break;
				case 'nl':
					embeds = [client.botUtils.createEmbed(client.botData.embeds.rvc.nl)];
					messageTitle = 'Handleiding';
					break;
				case 'vn':
					embeds = [client.botUtils.createEmbed(client.botData.embeds.rvc.vn)];
					messageTitle = 'Hướng dẫn';
					break;
			}
		}

		// send guides based on the language channel
		const { botConfigs, botData, botUtils, discordIDs } = client;
		const botResponse = {};

		const languageChannels = {
			'italiano': {
				'id': discordIDs.Channel.Italiano,
				'message': '',
				'suggestion': 'Suggestions',
				'embeds': botData.embeds.guides.rvc.it,

			},
			'portuguese': {
				'id': discordIDs.Channel.Portuguese,
				'message': '## 🇧🇷 Guias RVC (pt-br)',
				'suggestion': 'Veja essas recomendações abaixo',
				'embeds': botData.embeds.guides.rvc.pt,
				'embedColors': botConfigs.colors.country.brazil,
			},
		};

		const mentionedUser = message.mentions.members.first();
		let isLanguageChannel = false;
		let languageContent = null;

		for (const key of Object.keys(languageChannels)) {
			if (message.channelId == languageChannels[key].id) {
				isLanguageChannel = true;
				languageContent = languageChannels[key];
				break;
			}
		}

		if (isLanguageChannel) {
			botResponse.content = languageContent.message;
			if (mentionedUser) {
				botResponse.content += `\n${mentionedUser} ${languageContent.suggestion}`;
			}
			botResponse.embeds = botUtils.createEmbeds(
				languageContent.embeds,
				languageContent.embedColors ?? botUtils.getAvailableColors(botConfigs),
			);
			return message.channel.send(botResponse);
		}
		else {
			// not a language channel
			botResponse.content = '## RVC Guides (How to Make AI Cover)';
			if (mentionedUser) {
				botResponse.content += `\nSuggestions for ${mentionedUser}`;
			}
			botResponse.embeds = botUtils.createEmbeds(
				[botData.embeds.rvc.main],
				botUtils.getAvailableColors(botConfigs),
			);
			return message.channel.send(botResponse);
		}

		/*
		// check if mentioned the bot
		if (client.user.id === message.mentions.members.first().id) {
			return message.reply(messageBlooper);
		}
		*/
	},
};