import { APIEmbed } from 'discord.js';
import i18next from '../../i18n';
import { EmbedData } from '../../Interfaces/BotData';
import { PrefixCommand } from '../../Interfaces/Command';
import { ISettings } from '../../Services/settingsService';
import { getLanguageByChannelId, TagResponseSender } from '../../Utils/botUtilities';
import { ColorThemes, createThemedEmbeds } from '../../Utils/discordUtilities';

const RVC: PrefixCommand = {
    name: 'rvc',
    description: 'Retrieval-based Voice Conversion Documentation (a.k.a How to Make AI Cover)',
    aliases: ['guide', 'guides', 'docs', 'doc', 'documentation'],
    async run(client, message) {
        const language = getLanguageByChannelId(message.channelId);
        const content = i18next.t('tags.rvc.embeds', { lng: language, returnObjects: true }) as EmbedData[];

        let selectedTheme: string | null = null;
        const settings = client.botCache.get('main_settings') as ISettings;
        if (!settings) {
            selectedTheme = ColorThemes.Default;
        } else {
            selectedTheme = settings.theme;
        }

        const apiEmbedData: APIEmbed[] = content.map((item) => {
            return {
                title: item.title,
                description: item.description?.join('\n'),
            };
        });

        const embeds = createThemedEmbeds(apiEmbedData, selectedTheme as ColorThemes);

        const sender = new TagResponseSender(client);
        sender.setEmbeds(embeds);
        sender.config(message);
        await sender.send();
    },
};

export default RVC;
