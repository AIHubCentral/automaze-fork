module.exports = {
	name: 'ready',
	once: true,
	async run(client) {
		console.log(`\nReady! Logged in as ${client.user.tag}`);
		console.log(`Node version: ${process.version}`);

		const guilds = client.guilds.cache;
		console.log(`\nBot is currently in ${guilds.size} guild(s):`);

		guilds.forEach((guild) => {
			console.log(`${guild.id}: ${guild.name}`);
		});

		const { botConfigs } = client;

		if (botConfigs.messageOnStartup) {
			const devServerGuild = client.guilds.cache.get(botConfigs.devServerId);
			let botDebugChannel = devServerGuild.channels.cache.get(botConfigs.debugChannelId);

			if (!botDebugChannel) {
				botDebugChannel = await devServerGuild.channels.fetch(botConfigs.debugChannelId);

				if (!botDebugChannel) {
					console.error('Failed to fetch ', botConfigs.debugChannelId);
					return;
				}
			}

			await botDebugChannel.send('🟢 Bot is online!');
		}
	},
};