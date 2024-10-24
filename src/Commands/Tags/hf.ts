import { ColorResolvable } from 'discord.js';
import { EmbedData } from '../../Interfaces/BotData';
import { PrefixCommand } from '../../Interfaces/Command';
import {
    getLanguageByChannelId,
    getResourceData,
    resourcesToUnorderedList,
    TagResponseSender,
} from '../../Utils/botUtilities';
import i18next from '../../i18n';

const HF: PrefixCommand = {
    name: 'hf',
    description: 'Links to all working huggingface spaces',
    aliases: ['spaces', 'huggingface'],
    async run(client, message) {
        const { botCache, logger } = client;

        const resources = await getResourceData('hf', botCache, logger);

        const language = getLanguageByChannelId(message.channelId);

        if (resources.length === 0) {
            await message.reply({ content: i18next.t('general.not_available', { lng: language }) });
            return;
        }

        const content: EmbedData[] = [
            {
                title: i18next.t('tags.hf.embed.title', { lng: language }),
                color: 'ffcc4d' as ColorResolvable,
                description: [resourcesToUnorderedList(resources, language)],
                footer: i18next.t('tags.hf.embed.footer', { lng: language }),
            },
        ];

        const sender = new TagResponseSender(client);
        sender.setEmbeds(content);
        sender.config(message);
        await sender.send();
    },
};

export default HF;
