import i18next from '../../i18n';
import { EmbedData } from '../../Interfaces/BotData';
import { PrefixCommand } from '../../Interfaces/Command';
import { TagResponseSender } from '../../Utils/botUtilities';

interface Response {
    embed: EmbedData;
}

const Paperspace: PrefixCommand = {
    name: 'paperspace',
    description: 'Paperspace tutorial by LollenApe',
    aliases: [],
    async run(client, message) {
        const content = i18next.t('tags.paperspace', { returnObjects: true }) as Response;

        const sender = new TagResponseSender(client);
        sender.setEmbeds([content.embed]);
        sender.config(message);
        await sender.send();
    },
};

export default Paperspace;
