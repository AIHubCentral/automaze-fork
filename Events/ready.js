const logger = require('../logger');

module.exports = {
	name: 'ready',
	once: true,
	async run(client) {
		logger.info(`Ready! Logged in as ${client.user.tag}`);
		logger.info(`Node version: ${process.version}`);

		const guilds = client.guilds.cache;
		logger.info(`Bot is currently in ${guilds.size} guild(s):`);

		guilds.forEach((guild) => {
			logger.info(`${guild.id}: ${guild.name}`);
		});

		const { botConfigs } = client;

		if (botConfigs.messageOnStartup) {
			const devServerGuild = client.guilds.cache.get(botConfigs.devServerId);
			let botDebugChannel = devServerGuild.channels.cache.get(botConfigs.debugChannelId);

			if (!botDebugChannel) {
				botDebugChannel = await devServerGuild.channels.fetch(botConfigs.debugChannelId);

				if (!botDebugChannel) {
					logger.error(`Failed to fetch ${botConfigs.debugChannelId}`);
					return;
				}
			}

			await botDebugChannel.send('🟢 Bot is online!');
		}
	},
};