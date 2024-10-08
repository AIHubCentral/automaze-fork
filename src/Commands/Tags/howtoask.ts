import { inlineCode } from 'discord.js';
import { PrefixCommand } from '../../Interfaces/Command';

const HowToAsk: PrefixCommand = {
    name: 'howtoask',
    category: 'Tags',
    description: 'How to ask for help properly.',
    aliases: ['ask', 'hta'],
    syntax: 'howtoask',
    async run(client, message) {
        await message!.reply(`This command has been changed to ${inlineCode('!howtoask')}`);
    },
};

export default HowToAsk;
