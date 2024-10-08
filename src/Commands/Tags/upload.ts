import { PrefixCommand } from '../../Interfaces/Command';
import { TagResponseSender } from '../../Utils/botUtilities';

const Upload: PrefixCommand = {
    name: 'upload',
    category: 'Tags',
    description: 'How to upload to `huggingface.co`',
    aliases: [],
    syntax: 'upload [member]',
    async run(client, message) {
        const { botData } = client;
        const content = botData.embeds.upload.en;

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

export default Upload;
