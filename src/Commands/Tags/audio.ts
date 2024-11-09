import i18next from 'i18next';
import { PrefixCommand } from '../../Interfaces/Command';
import {
    getLanguageByChannelId,
    getResourceData,
    resourcesToUnorderedListAlt,
    TagResponseSender,
} from '../../Utils/botUtilities';
import { ColorThemes, createThemedEmbed } from '../../Utils/discordUtilities';
import { ISettings } from '../../Services/settingsService';

const Audio: PrefixCommand = {
    name: 'audio',
    description: 'Guides on how to isolate audio for making datasets',
    aliases: ['dataset'],
    async run(client, message) {
        const { botCache, logger } = client;

        const resources = await getResourceData('audio', botCache, logger);

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
                title: `${i18next.t('common.emojis.book')} ${i18next.t('tags.audio.embed.title', { lng: language })}`,
                description: resourcesToUnorderedListAlt(resources, language),
                footer: {
                    text: i18next.t('tags.audio.embed.footer', { lng: language }),
                },
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

export default Audio;
