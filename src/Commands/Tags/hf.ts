import { ColorResolvable } from 'discord.js';
import { EmbedData } from '../../Interfaces/BotData';
import { PrefixCommand } from '../../Interfaces/Command';
import { getResourceData, resourcesToUnorderedList, TagResponseSender } from '../../Utils/botUtilities';

const HF: PrefixCommand = {
    name: 'hf',
    category: 'Tags',
    description: 'Links to all working huggingface spaces',
    aliases: ['spaces', 'hugginface'],
    syntax: 'hf [member]',
    async run(client, message) {
        const { botCache, logger } = client;

        const resources = await getResourceData('hf', botCache, logger);

        let content: EmbedData[] = [];

        if (resources.length > 0) {
            content.push({
                title: '<:huggingface:1179800228946268270> Hugginface Spaces',
                color: 'ffcc4d' as ColorResolvable,
                description: [resourcesToUnorderedList(resources)],
                footer: 'More commands: -audio, - colabs, -kaggle, -local, -overtraining, -realtime, -rvc, -help',
            });
        }

        const sender = new TagResponseSender(client);
        sender.setEmbeds(content);
        sender.config(message);
        await sender.send();
    },
};

export default HF;
