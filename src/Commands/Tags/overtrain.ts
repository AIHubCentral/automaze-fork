import { PrefixCommand } from '../../Interfaces/Command';

const Overtrain: PrefixCommand = {
    name: 'overtrain',
    description: 'How to tell whether your model is overtraining and what to do',
    aliases: ['overtraining'],
    async run(client, message) {
        return await message.reply({
            content: 'Moved to `/faq` command.',
            allowedMentions: { repliedUser: true },
        });
    },
};

export default Overtrain;
