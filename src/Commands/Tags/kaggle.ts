import { Colors } from 'discord.js';
import { EmbedData } from '../../Interfaces/BotData';
import { PrefixCommand } from '../../Interfaces/Command';
import {
    getLanguageByChannelId,
    getResourceData,
    resourcesToUnorderedList,
    TagResponseSender,
} from '../../Utils/botUtilities';
import i18next from '../../i18n';

const Kaggle: PrefixCommand = {
    name: 'kaggle',
    description: 'Links to kaggle notebooks',
    aliases: [],
    async run(client, message) {
        const { botCache, logger } = client;

        const resources = await getResourceData('kaggle', botCache, logger);

        const language = getLanguageByChannelId(message.channelId);

        if (resources.length === 0) {
            await message.reply({ content: i18next.t('general.not_available', { lng: language }) });
            return;
        }

        const content: EmbedData[] = [
            {
                title: i18next.t('tags.kaggle.embed.title', { lng: language }),
                color: Colors.DarkBlue,
                description: [
                    resourcesToUnorderedList(resources, language),
                    i18next.t('tags.kaggle.guide', { lng: language }),
                    i18next.t('tags.kaggle.notice', { lng: language }),
                ],
                footer: i18next.t('tags.kaggle.embed.footer', { lng: language }),
            },
        ];

        const sender = new TagResponseSender(client);
        sender.setEmbeds(content);
        sender.config(message);
        await sender.send();
    },
};

export default Kaggle;
