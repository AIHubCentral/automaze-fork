import { bold, EmbedBuilder, hyperlink, quote } from "discord.js";
import { EmbedData } from "../../Interfaces/BotData";
import { PrefixCommand } from "../../Interfaces/Command";
import ResourceService from "../../Services/resourcesService";
import { resourcesToUnorderedList, TagResponseSender } from "../../Utils/botUtilities";

const Kaggle: PrefixCommand = {
    name: 'kaggle',
    category: 'Tags',
    description: 'Links to kaggle notebooks',
    aliases: [],
    syntax: 'kaggle [member]',
    async run(client, message) {
        const { botData } = client;

        // make a copy of the original embed data
        const content = JSON.parse(JSON.stringify(botData.embeds.kaggle.en.embeds));
        if (!content) {
            client.logger.error(`Missing embed data for -${this.name}`);
            await message.reply({ content: 'Failed to retrieve data...Try again later.' });
            return;
        }

        const resourceService = new ResourceService(client.logger);

        const embeds: EmbedData[] = await createResponse(content, resourceService);
        const sender = new TagResponseSender(client);
        sender.setEmbeds(embeds);
        sender.config(message);
        await sender.send();
    },
};

export default Kaggle;

async function createResponse(kaggleEmbeds: EmbedData[], service: ResourceService): Promise<EmbedData[]> {
    const response: EmbedData[] = [];

    const embed: EmbedData = {
        title: '📘 Kaggle Notebooks',
        footer: kaggleEmbeds[0].footer,
    };

    const embedDescription: string[] = [];

    // try to get info from database first
    const records = await service.findByCategory('kaggle');

    if (records.length > 0) {
        embedDescription.push(resourcesToUnorderedList(records));
    }

    // merge with data from json
    kaggleEmbeds[0].description?.forEach(item => embedDescription.push(item));

    // add the notice
    embedDescription.push(quote("Note: Kaggle limits GPU usage to 30 hours per week."))

    embed.description = embedDescription;

    response.push(embed);

    return response;
}