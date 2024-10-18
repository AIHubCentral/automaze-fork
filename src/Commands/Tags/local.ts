import { PrefixCommand } from '../../Interfaces/Command';
import { TagResponseSender } from '../../Utils/botUtilities';

const Local: PrefixCommand = {
    name: 'local',
    category: 'Tags',
    description: 'Links to all working local forks',
    aliases: ['applio', 'mangio', 'studio', 'links'],
    syntax: `local [member]`,
    async run(client, message) {
        const { botData } = client;
        const content = botData.embeds.local.en;

        if (!content.embeds) {
            client.logger.error(`Missing embed data for -${this.name}`);
            return;
        }

        // editEmbedDescription(content.embeds[0]);

        const sender = new TagResponseSender(client);
        sender.setEmbeds(content.embeds);
        sender.config(message);
        await sender.send();
    },
};

export default Local;
