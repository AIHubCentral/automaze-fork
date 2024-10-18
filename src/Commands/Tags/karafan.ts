import i18next from '../../i18n';
import { ButtonData, EmbedData } from '../../Interfaces/BotData';
import { PrefixCommand } from '../../Interfaces/Command';
import { TagResponseSender } from '../../Utils/botUtilities';

type response = { embed: EmbedData; buttons: ButtonData[] };

const Karafan: PrefixCommand = {
    name: 'karafan',
    description: 'KaraFan audio separation tool',
    aliases: [],
    async run(client, message) {
        const content = i18next.t('tags.karafan', {
            returnObjects: true,
        }) as response;

        const sender = new TagResponseSender(client);
        sender.setEmbeds([content.embed as EmbedData]);
        sender.setButtons(content.buttons);
        sender.config(message);
        await sender.send();
    },
};

export default Karafan;
