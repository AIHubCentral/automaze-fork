import { ColorResolvable } from 'discord.js';
import { PrefixCommand } from '../../Interfaces/Command';
import { getResourceData, resourcesToUnorderedList, TagResponseSender } from '../../Utils/botUtilities';
import { EmbedData } from '../../Interfaces/BotData';
import i18next from 'i18next';

const Colab: PrefixCommand = {
    name: 'colab',
    description: 'Links to all working colabs/spaces',
    aliases: ['colabs', 'disconnected', 'train', 'training'],
    async run(client, message) {
        const { botCache, logger } = client;

        const resources = await getResourceData('colab', botCache, logger);

        if (resources.length === 0) {
            await message.reply({ content: i18next.t('general.not_available') });
            return;
        }

        const content: EmbedData[] = [
            {
                title: i18next.t('tags.colab.embed.title'),
                color: 'f9ab00' as ColorResolvable,
                description: [resourcesToUnorderedList(resources)],
            },
            {
                title: i18next.t('tags.colab.notice.embed.title'),
                description: [i18next.t('tags.colab.notice.embed.description')],
                footer: i18next.t('tags.colab.embed.footer'),
            },
        ];

        const sender = new TagResponseSender(client);
        sender.setEmbeds(content);
        sender.config(message);
        await sender.send();
    },
};

export default Colab;
