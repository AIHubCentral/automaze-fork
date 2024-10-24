import { Message } from 'discord.js';

import ExtendedClient from '../../Core/extendedClient';
import { PrefixCommand } from '../../Interfaces/Command';
import { getLanguageByChannelId, handleSendRealtimeGuides } from '../../Utils/botUtilities';

const Realtime: PrefixCommand = {
    name: 'realtime',
    description: 'RVC real-time conversion guide',
    aliases: ['rt', 'tts'],
    run: async (client: ExtendedClient, message: Message) => {
        const targetUser = message.mentions.members?.first();
        const language = getLanguageByChannelId(message.channelId);
        await handleSendRealtimeGuides(message, targetUser, message.author, false, language);
    },
};

export default Realtime;
