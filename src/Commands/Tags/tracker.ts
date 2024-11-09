import { Colors, EmbedBuilder } from 'discord.js';
import { PrefixCommand } from '../../Interfaces/Command';
import { TagResponseSender } from '../../Utils/botUtilities';

const Tracker: PrefixCommand = {
    name: 'tracker',
    description: 'RVC real time tracker in spreadsheet',
    aliases: ['ss', 'spreadsheet'],
    async run(client, message) {
        const sender = new TagResponseSender(client);
        sender.setEmbeds([
            new EmbedBuilder()
                .setTitle('📊 RVC Archive Tracker(outdated)')
                .setColor(Colors.Red)
                .setDescription('Massive spreadsheet with RVC models created by **kalomaze**.'),
        ]);
        sender.setButtons([
            {
                label: 'View Spreadsheet',
                url: 'https://docs.google.com/spreadsheets/d/1tAUaQrEHYgRsm1Lvrnj14HFHDwJWl0Bd9x0QePewNco/edit#gid=0',
            },
        ]);
        sender.config(message);
        await sender.send();
    },
};

export default Tracker;
