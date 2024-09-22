import { ColorResolvable } from 'discord.js';
import { EmbedData } from '../../Interfaces/BotData';
import { PrefixCommand } from '../../Interfaces/Command';
import { getResourceData, resourcesToUnorderedList, resourcesToUnorderedListAlt, TagResponseSender } from '../../Utils/botUtilities';

const Audio: PrefixCommand = {
	name: 'audio',
	category: 'Tags',
	description: 'Guides on how to isolate audio for making datasets',
	aliases: ['dataset'],
	syntax: 'audio [member]',
	async run(client, message) {
		const { botCache, logger } = client;

		const resources = await getResourceData("audio", botCache, logger);

		if (resources.length === 0) {
			await message.reply({ content: "Currently unavailable." });
			return;
		}

		let content: EmbedData[] = [{
			title: "📚 Audio Guides & Tools",
			description: [resourcesToUnorderedListAlt(resources)],
			footer: "More commands: -colab, -uvr, -karafan, -overtrain, -help"
		}];

		const sender = new TagResponseSender(client);
		sender.setEmbeds(content);
		sender.config(message);
		await sender.send();
	},
};

export default Audio;