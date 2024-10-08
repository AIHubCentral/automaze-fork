import { PrefixCommand } from '../../Interfaces/Command';
import { TagResponseSender } from '../../Utils/botUtilities';

const Tracker: PrefixCommand = {
    name: 'tracker',
    category: 'Tags',
    description: 'RVC real time tracker in spreadsheet',
    aliases: ['ss', 'spreadsheet'],
    syntax: `tracker [member]`,
    async run(client, message) {
        const { botData } = client;
        const content = botData.embeds.tracker.en;

        if (!content.embeds) {
            client.logger.error(`Missing embed data for -${this.name}`);
            return;
        }

        const sender = new TagResponseSender(client);
        sender.setEmbeds(content.embeds);
        sender.config(message);
        await sender.send();
    },
};

export default Tracker;
