import { PrefixCommand } from '../../Interfaces/Command';
import { TagResponseSender } from '../../Utils/botUtilities';

const Karafan: PrefixCommand = {
	name: 'karafan',
	category: 'Tags',
	description: 'KaraFan audio separation tool',
	aliases: [],
	syntax: 'karafan [member]',
	async run(client, message) {
		const { botData } = client;
		const content = botData.embeds.karafan.en;

		if (!content.embeds || !content.buttons) {
			client.logger.error(`Missing embed data for -${this.name}`);
			return;
		}

		const sender = new TagResponseSender(client);
		sender.setEmbeds(content.embeds);
		sender.setButtons(content.buttons)
		sender.config(message);
		await sender.send();
	},
};

export default Karafan;