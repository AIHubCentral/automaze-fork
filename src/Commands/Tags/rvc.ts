import i18next from '../../i18n';
import { EmbedData } from '../../Interfaces/BotData';
import { PrefixCommand } from '../../Interfaces/Command';
import { getLanguageByChannelId, TagResponseSender } from '../../Utils/botUtilities';

const RVC: PrefixCommand = {
    name: 'rvc',
    description: 'Retrieval-based Voice Conversion Documentation (a.k.a How to Make AI Cover)',
    aliases: ['guide', 'guides', 'docs', 'doc', 'documentation'],
    async run(client, message) {
        const language = getLanguageByChannelId(message.channelId);
        const content = i18next.t('tags.rvc.embeds', { lng: language, returnObjects: true }) as EmbedData[];

        const sender = new TagResponseSender(client);
        sender.setEmbeds(content);
        sender.config(message);
        await sender.send();
    },
};

export default RVC;
