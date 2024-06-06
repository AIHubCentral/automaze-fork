import { PrefixCommand } from '../../Interfaces/Command';
import { TagResponseSender } from '../../Utils/botUtilities';

const Paperspace: PrefixCommand = {
	name: 'paperspace',
	category: 'Tags',
	description: 'Paperspace tutorial by LollenApe',
	aliases: [],
	syntax: 'paperspace [member]',
	async run(client, message) {
		const { botData } = client;
		const content = botData.embeds.paperspace.en;

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

export default Paperspace;