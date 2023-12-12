const { BotResponseBuilder, TagResponseSender, getChannelById } = require('../../utils');

module.exports = {
	name: 'colab',
	category: 'Tags',
	description: 'Links to all working colabs/spaces',
	aliases: ['colabs', 'disconnected', 'train', 'training', 'spaces', 'hf', 'hugginface'],
	syntax: 'colab [member]',
	run: async (client, message) => {
		const { botData, botConfigs, discordIDs } = client;

		let guidesChannel = '"❔┋guides"';
		let helpChannel = '"help-rvc"';

		try {
			guidesChannel = await getChannelById(discordIDs.Forum.Guides, message.guild);
			helpChannel = await getChannelById(discordIDs.Channel.HelpRVC, message.guild);
		}
		catch (error) {
			console.log('Failed to retrieve channels.');
		}

		const embeds = [...botData.embeds.colab.en];

		// remove the embed that links to help channel if the command was used on that channel
		if (message.channelId == discordIDs.Channel.HelpRVC) {
			embeds.pop();
		}
		else {
			// otherwise replace the channel placeholders with the actual links to them
			const lastEmbedIndex = embeds.length - 1;
			embeds[lastEmbedIndex]['description'][0] = embeds[lastEmbedIndex]['description'][0]
				.replace('$guides', guidesChannel)
				.replace('$helpRVC', helpChannel);
		}

		const botResponse = new BotResponseBuilder();
		botResponse.addEmbeds(embeds, botConfigs);

		const sender = new TagResponseSender();
		sender.setChannel(message.channel);
		sender.setConfigs(botConfigs);
		sender.setResponse(botResponse);
		sender.setTargetMessage(message);
		sender.setTargetUser(message.mentions.members.first());

		await sender.send();
	},
};