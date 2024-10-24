import i18next from '../../i18n';
import { ButtonData, EmbedData } from '../../Interfaces/BotData';
import { PrefixCommand } from '../../Interfaces/Command';
import { getLanguageByChannelId, TagResponseSender } from '../../Utils/botUtilities';

type response = { embed: EmbedData; buttons: ButtonData[] };

const UVR: PrefixCommand = {
    name: 'uvr',
    description: 'Ultimate Vocal Remover',
    aliases: [],
    async run(client, message) {
        const language = getLanguageByChannelId(message.channelId);
        const content = i18next.t('tags.uvr', {
            lng: language,
            returnObjects: true,
        }) as response;

        const sender = new TagResponseSender(client);
        sender.setEmbeds([content.embed]);
        sender.setButtons(content.buttons);
        sender.config(message);
        await sender.send();
    },
};

export default UVR;
