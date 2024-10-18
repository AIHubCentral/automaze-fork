import i18next from '../../i18n';
import { ButtonData, EmbedData } from '../../Interfaces/BotData';
import { PrefixCommand } from '../../Interfaces/Command';
import { TagResponseSender } from '../../Utils/botUtilities';

type response = { embeds: EmbedData[]; buttons: ButtonData[] };

const UVR: PrefixCommand = {
    name: 'uvr',
    description: 'Ultimate Vocal Remover',
    aliases: [],
    async run(client, message) {
        const content = i18next.t('tags.uvr', {
            returnObjects: true,
        }) as response;

        const sender = new TagResponseSender(client);
        sender.setEmbeds(content.embeds);
        sender.setButtons(content.buttons);
        sender.config(message);
        await sender.send();
    },
};

export default UVR;
