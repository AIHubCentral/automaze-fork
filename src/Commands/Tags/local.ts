import i18next from '../../i18n';
import { EmbedData } from '../../Interfaces/BotData';
import { PrefixCommand } from '../../Interfaces/Command';
import { getResourceData, resourcesToUnorderedList, TagResponseSender } from '../../Utils/botUtilities';

const Local: PrefixCommand = {
    name: 'local',
    description: 'Links to all working local forks',
    aliases: ['applio', 'mangio', 'studio', 'links'],
    async run(client, message) {
        const { botCache, logger } = client;

        const resources = await getResourceData('local', botCache, logger);

        if (resources.length === 0) {
            await message.reply({ content: i18next.t('general.not_available') });
            return;
        }

        const content: EmbedData[] = [
            {
                title: i18next.t('tags.local.embed.title'),
                description: [resourcesToUnorderedList(resources)],
                footer: i18next.t('tags.local.embed.footer'),
            },
        ];

        const sender = new TagResponseSender(client);
        sender.setEmbeds(content);
        sender.config(message);
        await sender.send();
    },
};

export default Local;
