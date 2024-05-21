import { ApplicationCommandType, ContextMenuCommandBuilder } from 'discord.js';
import { ContextCommand } from '../../Interfaces/Command';
import ExtendedClient from '../../Core/extendedClient';
import { createEmbeds, getAvailableColors } from '../../Utils/discordUtilities';

const SendUploadGuides: ContextCommand = {
	category: 'Tags',
	type: 'context-menu',
	data: new ContextMenuCommandBuilder()
		.setName('Send upload guides')
		.setType(ApplicationCommandType.User),
	async execute(interaction) {
		const { targetUser } = interaction;
		if (targetUser.bot) return await interaction.reply({ content: 'That user is a bot.', ephemeral: true });

		const client = interaction.client as ExtendedClient;
		const { botData, botConfigs } = client;

		const guides = botData.embeds.upload.en;
		if (!guides.embeds) return await interaction.reply({ content: 'This guide is not available anymore.', ephemeral: true });

		await interaction.reply({ embeds: createEmbeds(guides.embeds, getAvailableColors(botConfigs)) });
	},
};

export default SendUploadGuides;