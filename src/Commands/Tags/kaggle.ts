import { PrefixCommand } from "../../Interfaces/Command";
import { TagResponseSender } from "../../Utils/botUtilities";

const Kaggle: PrefixCommand = {
    name: 'kaggle',
    category: 'Tags',
    description: 'Links to kaggle notebooks',
    aliases: [],
    syntax: 'kaggle [member]',
    async run(client, message) {
        const { botData } = client;
        const content = botData.embeds.kaggle.en.embeds;
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

export default Kaggle;