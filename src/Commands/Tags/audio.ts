import i18next from 'i18next';
import { EmbedData } from '../../Interfaces/BotData';
import { PrefixCommand } from '../../Interfaces/Command';
import { getResourceData, resourcesToUnorderedListAlt, TagResponseSender } from '../../Utils/botUtilities';

const Audio: PrefixCommand = {
    name: 'audio',
    description: 'Guides on how to isolate audio for making datasets',
    aliases: ['dataset'],
    async run(client, message) {
        const { botCache, logger } = client;

        const resources = await getResourceData('audio', botCache, logger);

        if (resources.length === 0) {
            await message.reply({ content: i18next.t('general.not_available') });
            return;
        }

        const content: EmbedData[] = [
            {
                title: i18next.t('tags.audio.embed.title'),
                description: [resourcesToUnorderedListAlt(resources)],
                footer: i18next.t('tags.audio.embed.footer'),
            },
        ];

        const sender = new TagResponseSender(client);
        sender.setEmbeds(content);
        sender.config(message);
        await sender.send();
    },
};

export default Audio;
