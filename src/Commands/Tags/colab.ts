import { ColorResolvable } from 'discord.js';
import { PrefixCommand } from '../../Interfaces/Command';
import {
    getLanguageByChannelId,
    getResourceData,
    resourcesToUnorderedList,
    TagResponseSender,
} from '../../Utils/botUtilities';
import { EmbedData } from '../../Interfaces/BotData';
import i18next from 'i18next';

const Colab: PrefixCommand = {
    name: 'colab',
    description: 'Links to all working colabs/spaces',
    aliases: ['colabs', 'disconnected', 'train', 'training'],
    async run(client, message) {
        const { botCache, logger } = client;

        const resources = await getResourceData('colab', botCache, logger);

        const language = getLanguageByChannelId(message.channelId);

        if (resources.length === 0) {
            await message.reply({ content: i18next.t('general.not_available', { lng: language }) });
            return;
        }

        const content: EmbedData[] = [
            {
                title: i18next.t('tags.colab.embed.title', { lng: language }),
                color: 'f9ab00' as ColorResolvable,
                description: [resourcesToUnorderedList(resources, language)],
            },
            {
                title: i18next.t('tags.colab.notice.embed.title', { lng: language }),
                description: [i18next.t('tags.colab.notice.embed.description', { lng: language })],
                footer: i18next.t('tags.colab.embed.footer', { lng: language }),
            },
        ];

        const sender = new TagResponseSender(client);
        sender.setEmbeds(content);
        sender.config(message);
        await sender.send();
    },
};

export default Colab;
