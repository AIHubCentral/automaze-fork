const { ApplicationCommandType, ContextMenuCommandBuilder } = require('discord.js');
const { BotResponseBuilder } = require('../../utils');

module.exports = {
	category: 'Tags',
	type: 'context-menu',
	data: new ContextMenuCommandBuilder()
		.setName('Send upload guides')
		.setType(ApplicationCommandType.User),
	async execute(interaction) {
		const { client, targetUser } = interaction;

		if (targetUser.bot) return await interaction.reply({ content: 'That user is a bot.', ephemeral: true });

		const { botData, botConfigs } = client;
		const embeds = botData.embeds.guides.upload.en.embeds;

		const botResponse = new BotResponseBuilder();
		botResponse.setText(`Suggestion for ${targetUser}`);
		botResponse.addEmbeds(embeds, botConfigs);
		await interaction.reply(botResponse.build());
	},
};
