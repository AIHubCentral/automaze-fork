import { TextChannel } from 'discord.js';
import IEventData from '../Interfaces/Events';

interface GuildInfo {
    guildId: string;
    guildName: string;
}

const readyEvent: IEventData = {
    name: 'ready',
    once: true,
    async run(client) {
        client.logger.info(`Ready! Logged in as ${client.user?.tag}`);
        client.logger.info(`Node version: ${process.version}`);

        const guilds = client.guilds.cache;
        client.logger.info(`Bot is currently in ${guilds.size} guild(s):`);

        const guildsInfo: GuildInfo[] = [];

        guilds.forEach((guild) => {
            guildsInfo.push({ guildId: guild.id, guildName: guild.name });
        });

        client.logger.info('Bot guilds', guildsInfo);

        const { botConfigs } = client;

        if (botConfigs.messageOnStartup) {
            let devServerGuild = client.guilds.cache.get(botConfigs.devServerId);

            if (!devServerGuild) {
                devServerGuild = await client.guilds.fetch(botConfigs.devServerId);
            }

            let botDebugChannel = devServerGuild.channels.cache.get(botConfigs.debugChannelId);

            if (!botDebugChannel) {
                botDebugChannel =
                    (await devServerGuild.channels.fetch(botConfigs.debugChannelId)) ?? undefined;
            }

            if (botDebugChannel) {
                botDebugChannel = <TextChannel>botDebugChannel;
                await botDebugChannel.send('🟢 Bot is online!');
            } else {
                client.logger.error(`Failed to fetch ${botConfigs.debugChannelId}`);
            }
        }
    },
};

export default readyEvent;
