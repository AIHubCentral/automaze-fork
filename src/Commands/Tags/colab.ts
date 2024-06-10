import { PrefixCommand } from "../../Interfaces/Command";
import { TagResponseSender } from "../../Utils/botUtilities";

const Colab: PrefixCommand = {
	name: 'colab',
	category: 'Tags',
	description: 'Links to all working colabs/spaces',
	aliases: ['colabs', 'disconnected', 'train', 'training'],
	syntax: 'colab [member]',
	async run(client, message) {
		const { botData } = client;
		const content = botData.embeds.colab.en.embeds;
		if (!content) {
			client.logger.error(`Missing embed data for -${this.name}`);
			return;
		}

		const sender = new TagResponseSender(client);
		sender.setEmbeds(content);
		sender.config(message);
		await sender.send();
	},
};

export default Colab;