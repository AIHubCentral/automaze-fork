import { PrefixCommand } from '../../Interfaces/Command';
import { TagResponseSender } from '../../Utils/botUtilities';

const HFStatus: PrefixCommand = {
    name: 'hfstatus',
    category: 'Tags',
    description: 'Where to check hugginface status',
    aliases: ['hfstatus'],
    syntax: 'hfstatus [member]',
    async run(client, message) {
        const { botData } = client;
        if (!botData.embeds.hfstatus.en.embeds) {
            client.logger.error(`Missing embed data for -${this.name}`);
            return;
        }

        const sender = new TagResponseSender(client);
        sender.setEmbeds(botData.embeds.hfstatus.en.embeds);
        sender.config(message);
        await sender.send();
    },
};

export default HFStatus;
