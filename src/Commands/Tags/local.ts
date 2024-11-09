import i18next from '../../i18n';
import { PrefixCommand } from '../../Interfaces/Command';
import { ISettings } from '../../Services/settingsService';
import {
    getLanguageByChannelId,
    getResourceData,
    resourcesToUnorderedList,
    TagResponseSender,
} from '../../Utils/botUtilities';
import { ColorThemes, createThemedEmbed } from '../../Utils/discordUtilities';

const Local: PrefixCommand = {
    name: 'local',
    description: 'Links to all working local forks',
    aliases: ['applio', 'mangio', 'studio', 'links'],
    async run(client, message) {
        const { botCache, logger } = client;

        const resources = await getResourceData('local', botCache, logger);

        const language = getLanguageByChannelId(message.channelId);

        if (resources.length === 0) {
            await message.reply({ content: i18next.t('general.not_available', { lng: language }) });
            return;
        }

        let selectedTheme: string | null = null;
        const settings = client.botCache.get('main_settings') as ISettings;
        if (!settings) {
            selectedTheme = ColorThemes.Default;
        } else {
            selectedTheme = settings.theme;
        }

        const embed = createThemedEmbed(
            {
                title: `${i18next.t('common.emojis.laptop')} ${i18next.t('tags.local.embed.title')}`,
                description: resourcesToUnorderedList(resources, language),
                footer: { text: i18next.t('tags.local.embed.footer', { lng: language }) },
            },
            selectedTheme as ColorThemes,
            'primary'
        );

        const sender = new TagResponseSender(client);
        sender.setEmbeds([embed]);
        sender.config(message);
        await sender.send();
    },
};

export default Local;
