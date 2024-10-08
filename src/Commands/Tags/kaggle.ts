import { bold, EmbedBuilder, hyperlink, quote } from 'discord.js';
import { EmbedData } from '../../Interfaces/BotData';
import { PrefixCommand } from '../../Interfaces/Command';
import ResourceService from '../../Services/resourcesService';
import { getResourceData, resourcesToUnorderedList, TagResponseSender } from '../../Utils/botUtilities';

const Kaggle: PrefixCommand = {
    name: 'kaggle',
    category: 'Tags',
    description: 'Links to kaggle notebooks',
    aliases: [],
    syntax: 'kaggle [member]',
    async run(client, message) {
        const { botCache, botData, logger } = client;

        // make a copy of the original embed data
        const content = JSON.parse(JSON.stringify(botData.embeds.kaggle.en.embeds));

        if (!content) {
            client.logger.error(`Missing embed data for -${this.name}`);
            await message.reply({ content: 'Failed to retrieve data...Try again later.' });
            return;
        }

        const resources = await getResourceData('kaggle', botCache, logger);

        const embedData: EmbedData = {
            title: content[0].title,
            color: content[0].color,
        };

        let embedDescription: string[] = [];

        if (resources.length > 0) {
            embedDescription.push(resourcesToUnorderedList(resources));
        }

        embedDescription = embedDescription.concat(content[0].description);
        embedData.description = embedDescription;

        const sender = new TagResponseSender(client);
        sender.setEmbeds([embedData]);
        sender.config(message);
        await sender.send();
    },
};

export default Kaggle;
