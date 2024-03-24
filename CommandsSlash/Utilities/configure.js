/* eslint-disable indent */
const { SlashCommandBuilder,
	ActivityType,
	StringSelectMenuBuilder,
	StringSelectMenuOptionBuilder,
	ActionRowBuilder,
	ComponentType,
	EmbedBuilder,
} = require('discord.js');

const { getThemes } = require('../../utils.js');

const delay = require('node:timers/promises').setTimeout;

module.exports = {
	category: 'Utilities',
	cooldown: 30,
	type: 'slash',
	data: new SlashCommandBuilder()
		.setName('configure')
		.setDescription('Configure bot settings')
		.addSubcommand(subcommand =>
			subcommand
				.setName('comission')
				.setDescription('Configure bot behavior in paid model requests')
				.addBooleanOption(option =>
					option
						.setName('bot_responses')
						.setDescription('Whether the bot should send messages')
						.setRequired(true),
				)
				.addBooleanOption(option =>
					option
						.setName('delete_messages')
						.setDescription('Whether the bot should delete messages from users that doesnt have appropriate roles')
						.setRequired(true),
				),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('theme')
				.setDescription('Configure color theme'),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('status')
				.setDescription('Configure bot status')
				.addStringOption(option =>
					option
						.setName('statuses')
						.setDescription('Choose a status')
						.setRequired(true)
						.addChoices(
							{ name: 'Online', value: 'online' },
							{ name: 'Idle', value: 'idle' },
							{ name: 'Do Not Disturb', value: 'dnd' },
							{ name: 'Invisible', value: 'invisible' },
						),
				),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('activity')
				.setDescription('Configure bot activity')
				.addStringOption(option =>
					option
						.setName('activity_type')
						.setDescription('Choose an activity')
						.setRequired(true)
						.addChoices(
							{ name: 'Watching', value: 'watching' },
							{ name: 'Listening', value: 'listening' },
							{ name: 'Reset', value: 'reset' },
						),
				)
				.addStringOption(option =>
					option
						.setName('activity_name')
						.setDescription('Choose a name for the activity'),
				),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('general')
				.setDescription('General bot configs')
				.addBooleanOption(option =>
					option
						.setName('bot_reactions')
						.setDescription('Whether the bot should add reactions'),
				)
				.addBooleanOption(option =>
					option
						.setName('send_logs')
						.setDescription('Whether the bot should send logs to development server'),
				),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('cooldown_immune')
				.setDescription('Makes a user immune to cooldowns')
				.addStringOption(option =>
					option
						.setName('user_id')
						.setDescription('The target user')
						.setRequired(true),
				)
				.addBooleanOption(option =>
					option
						.setName('immune')
						.setDescription('Whether this user is immune to cooldowns')
						.setRequired(true),
				),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('automated_messages')
				.setDescription('Send automate messages')
				.addBooleanOption(option =>
					option
						.setName('send_messages')
						.setDescription('If the bot should send automated messages')
						.setRequired(true),
				),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('logs')
				.setDescription('Configure logs')
				.addStringOption(option =>
					option
						.setName('category')
						.setDescription('Which log to configure')
						.setRequired(true)
						.addChoices(
							{ name: 'Emojis', value: 'emojis' },
							{ name: 'Stickers', value: 'stickers' },
							{ name: 'Models', value: 'models' },
						),
				)
				.addBooleanOption(option =>
					option
						.setName('enabled')
						.setDescription('Enable or disable this log'),
				),
		),
	async execute(interaction) {
		const { client } = interaction;
		const { botConfigs } = client;

		if (interaction.options.getSubcommand() === 'comission') {
			const sendMessages = interaction.options.getBoolean('bot_responses');
			const deleteMessages = interaction.options.getBoolean('delete_messages');

			client.botConfigs.commissions.sendMessages = sendMessages;
			client.botConfigs.commissions.deleteMessages = deleteMessages;

			await interaction.reply({ content: `Bot configured:\n- sendMessages: **${sendMessages}**\n- deleteMessages: **${deleteMessages}**`, ephemeral: true });
		}
		else if (interaction.options.getSubcommand() === 'theme') {
			const themeOptions = [
				{
					label: 'Default',
					description: 'Default theme',
					value: 'defaultTheme',
					emoji: '📁',
				},
				{
					label: 'Christmas',
					description: 'Christmas theme',
					value: 'xmasTheme',
					emoji: '🎄',
				},
			];

			const selectMenu = new StringSelectMenuBuilder()
				.setCustomId(interaction.id)
				.setPlaceholder('Select the desired theme')
				.addOptions(themeOptions.map((theme) =>
					new StringSelectMenuOptionBuilder()
						.setLabel(theme.label)
						.setDescription(theme.description)
						.setValue(theme.value)
						.setEmoji(theme.emoji),
				));

			const actionRow = new ActionRowBuilder().addComponents(selectMenu);

			const botReply = await interaction.reply({ components: [actionRow] });

			const collector = botReply.createMessageComponentCollector({
				ComponentType: ComponentType.StringSelect,
				filter: (i) => i.user.id === interaction.user.id && i.customId === interaction.id,
				time: 60_000,
			});

			collector.on('collect', (i) => {
				const themeName = i.values[0];
				const themes = getThemes();
				client.botConfigs.colors.theme = themes[themeName];
				i.reply(`Theme changed to **${themeName}**.`);
			});
		}
		else if (interaction.options.getSubcommand() === 'status') {
			await interaction.deferReply({ ephemeral: true });
			const selectedStatus = interaction.options.getString('statuses');
			client.user.setStatus(selectedStatus);
			await delay(5000);
			await interaction.editReply({ content: `Status: ${selectedStatus}` });
		}
		else if (interaction.options.getSubcommand() === 'activity') {
			await interaction.deferReply({ ephemeral: true });
			let activityType = interaction.options.getString('activity_type');
			const activityName = interaction.options.getString('activity_name');

			if (activityType === 'reset') {
				client.user.setPresence({});
				await delay(3000);
				await interaction.editReply({ content: 'Activity reseted' });
			}
			else {
				switch (activityType) {
					case 'watching':
						activityType = ActivityType.Watching;
						break;
					case 'listening':
						activityType = ActivityType.Listening;
						break;
				}
				client.user.setActivity({
					name: activityName ?? 'AI HUB',
					type: activityType,
				});
				await delay(3000);
				await interaction.editReply({ content: 'Activity updated!' });
			}
		}
		else if (interaction.options.getSubcommand() === 'general') {
			const botReactions = interaction.options.getBoolean('bot_reactions');
			const sendLogs = interaction.options.getBoolean('send_logs');
			const botResponse = { content: 'Nothing changed.', ephemeral: true };

			if ((botReactions == null) && (sendLogs == null)) return await interaction.reply(botResponse);

			botResponse.content = ['### General configs changed'];

			if (botReactions != null) {
				client.botConfigs.general.reactions = botReactions;
				botResponse.content.push(`- Reactions: \`${botReactions}\``);
			}

			if (sendLogs != null) {
				client.botConfigs.general.sendLogs = sendLogs;
				botResponse.content.push(`- Send logs: \`${sendLogs}\``);
			}

			botResponse.content = botResponse.content.join('\n');

			await interaction.reply(botResponse);
		}
		else if (interaction.options.getSubcommand() === 'cooldown_immune') {
			const userId = interaction.options.getString('user_id');
			const cooldownImmunity = interaction.options.getBoolean('immune');

			if (cooldownImmunity) {
				client.botData.cooldownImmuneUsers.set(userId, cooldownImmunity);
				client.cooldowns.reactions.delete(userId);
				client.cooldowns.banana.delete(userId);
				client.cooldowns.slashCommands.delete(userId);
			}
			else {
				client.botData.cooldownImmuneUsers.delete(userId);
			}
			await interaction.reply({ content: `User: ${userId}\nCooldown immunity: ${cooldownImmunity}`, ephemeral: true });
		}
		else if (interaction.options.getSubcommand() === 'automated_messages') {
			const sendMessages = interaction.options.getBoolean('send_messages');
			const botResponse = { ephemeral: true };

			if (sendMessages) {
				if (client.scheduler.isRunning) {
					botResponse.content = 'Scheduler is already running.';
				}
				else {
					botResponse.content = 'Scheduler started.';
					client.scheduler.start();
				}
			}
			else {
				botResponse.content = 'Scheduler stopped.';
				client.scheduler.stop();
			}

			await interaction.reply(botResponse);
		}
		else if (interaction.options.getSubcommand() === 'logs') {
			const logsCategory = interaction.options.getString('category');
			const logEnabled = interaction.options.getBoolean('enabled');

			client.logger.info('Configuring logs...', { more: { logsCategory, logEnabled } });

			if (logEnabled != null) {
				botConfigs.logs[logsCategory] = logEnabled;
			}

			const embedDescription = [];

			for (const key in botConfigs.logs) {
				embedDescription.push(`- ${key}: \`${botConfigs.logs[key]}\``);
			}

			const embed = new EmbedBuilder()
				.setTitle('Logs configuration')
				.setDescription(embedDescription.join('\n'))
				.setColor('Blurple');

			await interaction.reply({
				embeds: [embed],
				ephemeral: true,
			});
		}
	},
};