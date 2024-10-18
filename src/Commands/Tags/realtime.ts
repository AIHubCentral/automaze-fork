import { Message } from 'discord.js';

import ExtendedClient from '../../Core/extendedClient';
import { PrefixCommand } from '../../Interfaces/Command';
import { handleSendRealtimeGuides } from '../../Utils/botUtilities';

const Realtime: PrefixCommand = {
    name: 'realtime',
    description: 'RVC real-time conversion guide',
    aliases: ['rt', 'tts'],
    run: async (client: ExtendedClient, message: Message) => {
        const targetUser = message.mentions.members?.first();
        await handleSendRealtimeGuides(message, targetUser, message.author);
    },
};

export default Realtime;
