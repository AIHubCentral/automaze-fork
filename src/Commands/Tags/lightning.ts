import { ColorResolvable } from 'discord.js';
import { EmbedData } from '../../Interfaces/BotData';
import { PrefixCommand } from '../../Interfaces/Command';
import { getResourceData, resourcesToUnorderedList, TagResponseSender } from '../../Utils/botUtilities';
import i18next from '../../i18n';

const Lightning: PrefixCommand = {
    name: 'light',
    description: 'Links to relevant lightning.ai stuff!',
    aliases: ['lightning', 'lightningai'],
    async run(client, message) {
        const { botCache, logger } = client;

        const resources = await getResourceData('lightning_ai', botCache, logger);

        if (resources.length === 0) {
            await message.reply({ content: i18next.t('general.not_available') });
            return;
        }

        const content: EmbedData[] = [
            {
                title: i18next.t('tags.lightning.embed.title'),
                color: 'b45aff' as ColorResolvable,
                description: [resourcesToUnorderedList(resources)],
                footer: i18next.t('tags.lightning.embed.footer'),
            },
        ];

        const sender = new TagResponseSender(client);
        sender.setEmbeds(content);
        sender.config(message);
        await sender.send();
    },
};

export default Lightning;
