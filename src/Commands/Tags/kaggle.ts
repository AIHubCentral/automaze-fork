import { EmbedData } from '../../Interfaces/BotData';
import { PrefixCommand } from '../../Interfaces/Command';
import { getResourceData, resourcesToUnorderedList, TagResponseSender } from '../../Utils/botUtilities';
import i18next from '../../i18n';

const Kaggle: PrefixCommand = {
    name: 'kaggle',
    description: 'Links to kaggle notebooks',
    aliases: [],
    async run(client, message) {
        const { botCache, logger } = client;

        const resources = await getResourceData('kaggle', botCache, logger);

        if (resources.length === 0) {
            await message.reply({ content: i18next.t('general.not_available') });
            return;
        }

        const content: EmbedData[] = [
            {
                title: i18next.t('tags.kaggle.embed.title'),
                description: [
                    resourcesToUnorderedList(resources),
                    i18next.t('tags.kaggle.guide'),
                    i18next.t('tags.kaggle.notice'),
                ],
                footer: i18next.t('tags.kaggle.embed.footer'),
            },
        ];

        const sender = new TagResponseSender(client);
        sender.setEmbeds(content);
        sender.config(message);
        await sender.send();
    },
};

export default Kaggle;
