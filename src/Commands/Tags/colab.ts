import { ColorResolvable } from "discord.js";
import { PrefixCommand } from "../../Interfaces/Command";
import { getResourceData, resourcesToUnorderedList, TagResponseSender } from "../../Utils/botUtilities";
import { EmbedData } from "../../Interfaces/BotData";

const Colab: PrefixCommand = {
	name: 'colab',
	category: 'Tags',
	description: 'Links to all working colabs/spaces',
	aliases: ['colabs', 'disconnected', 'train', 'training'],
	syntax: 'colab [member]',
	async run(client, message) {
		const { botCache, botData, logger } = client;

		const resources = await getResourceData("colab", botCache, logger);

		let content: EmbedData[] = [];

		if (resources.length > 0) {
			content.push({
				title: "☁️ Google Colabs",
				color: "f9ab00" as ColorResolvable,
				description: [resourcesToUnorderedList(resources)],
			});
		}

		let noticeEmbeds = botData.embeds.colab_notice.en.embeds;

		if (noticeEmbeds) {
			for (const embed of noticeEmbeds) {
				content.push(embed);
			}
		}

		const sender = new TagResponseSender(client);
		sender.setEmbeds(content);
		sender.config(message);
		await sender.send();
	},
};

export default Colab;