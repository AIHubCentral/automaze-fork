const { ApplicationCommandType, ContextMenuCommandBuilder } = require('discord.js');

module.exports = {
	category: 'Tags',
	type: 'context-menu',
	data: new ContextMenuCommandBuilder()
		.setName('Send Colab links')
		.setType(ApplicationCommandType.User),
	async execute(interaction) {
		const { client, targetUser } = interaction;
		if (targetUser.bot) return await interaction.reply({ content: 'That user is a bot.', ephemeral: true });

		const { botData, botUtils, botConfigs } = client;

		let embeds = [
			botData.embeds.colab.en.main.content,
		];

		const guidesChannel = interaction.guild.channels.cache.get(client.discordIDs.Forum.Guides) ?? '"❔┋guides"';
		const helpChannel = interaction.guild.channels.cache.get(client.discordIDs.Channel.HelpRVC) ?? '"help-rvc"';

		const moreEmbedData = botData.embeds.colab.en.main.message;

		moreEmbedData.description[0] = moreEmbedData.description[0]
			.replace('$antasma', '[Antasma](https://discordapp.com/users/1037338320960761998)')
			.replace('$fazemasta', '[Faze Masta](https://discordapp.com/users/622856015444049937)')
			.replace('$guides', guidesChannel)
			.replace('$helpRVC', helpChannel);

		embeds.push(moreEmbedData);
		embeds = botUtils.createEmbeds(embeds, botUtils.getAvailableColors(botConfigs));
		interaction.reply({ content: `Suggestions for ${targetUser}`, embeds: embeds });
	},
};
