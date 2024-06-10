import { PrefixCommand } from "../../Interfaces/Command";
import { TagResponseSender } from "../../Utils/botUtilities";

const HF: PrefixCommand = {
    name: 'hf',
    category: 'Tags',
    description: 'Links to all working huggingface spaces',
    aliases: ['spaces', 'hugginface'],
    syntax: 'hf [member]',
    async run(client, message) {
        const { botData } = client;
        const content = botData.embeds.hf.en.embeds;
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

export default HF;