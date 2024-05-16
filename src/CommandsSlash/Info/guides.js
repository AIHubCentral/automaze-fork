/* eslint-disable indent */
const {
	SlashCommandBuilder,
	StringSelectMenuBuilder,
	StringSelectMenuOptionBuilder,
	ActionRowBuilder,
	ComponentType,
} = require('discord.js');
const { TagResponseSender, BotResponseBuilder } = require('../../utils');

module.exports = {
	category: 'Info',
	type: 'slash',
	data: new SlashCommandBuilder()
		.setName('guides')
		.setDescription('Guides for RVC (how to make ai cover).')
		.addStringOption(option =>
			option.setName('category')
				.setDescription('Choose a category')
				.setRequired(true)
				.addChoices(
					{ name: 'RVC', value: 'rvc' },
					{ name: 'Applio', value: 'applio' },
					{ name: 'Audio', value: 'audio' },
					{ name: 'Paperspace', value: 'paperspace' },
					{ name: 'Realtime', value: 'realtime' },
					{ name: 'Upload', value: 'upload' },
					{ name: 'UVR', value: 'uvr' },
				),
		)
		.addStringOption(option =>
			option.setName('language')
				.setDescription('(Optional) Choose a language by country')
				.addChoices(
					{ name: 'DE', value: 'de' },
					{ name: 'EN', value: 'en' },
					{ name: 'ES', value: 'es' },
					{ name: 'FR', value: 'fr' },
					{ name: 'IT', value: 'it' },
					{ name: 'JP', value: 'jp' },
					{ name: 'KR', value: 'kr' },
					{ name: 'PL', value: 'pl' },
					{ name: 'PT', value: 'pt' },
					{ name: 'RU', value: 'ru' },
				),
		)
		.addUserOption(option =>
			option.setName('user')
				.setDescription('(Optional) Send this guide to an user'),
		),
	async execute(interaction) {
		const category = interaction.options.getString('category');
		const language = interaction.options.getString('language') ?? 'en';
		const targetUser = interaction.options.getUser('user');
		const mainUser = interaction.user;

		const { client } = interaction;
		const { botData, botConfigs, botUtils } = client;
		const availableColors = botUtils.getAvailableColors(botConfigs);

		let selectedGuide;
		let botResponse = new BotResponseBuilder();
		botResponse.setEphemeral(true);
		botResponse.setText('This guide is not available in the selected language yet.');

		const sender = new TagResponseSender();
		// sender.setChannel(interaction.channel);
		sender.setConfigs(botConfigs);
		sender.setResponse(botResponse);
		sender.setTargetMessage(interaction);
		sender.setTargetUser(targetUser);

		client.logger.debug('sending guide', {
			more: {
				category, language,
				channelId: interaction.channel.id,
				guildId: interaction.guild.id,
			}
		});

		if (category === 'realtime') {
			selectedGuide = botData.embeds.realtime[language];
			if (!selectedGuide) return interaction.reply(botResponse.build());
			botResponse.setEphemeral(false);

			const realtimeSelectOptions = selectedGuide['menuOptions'].map(menuOption =>
				new StringSelectMenuOptionBuilder()
					.setLabel(menuOption.label)
					.setDescription(menuOption.description)
					.setValue(menuOption.value)
					.setEmoji(menuOption.emoji),
			);

			const realtimeGuidesSelectMenu = new StringSelectMenuBuilder()
				.setCustomId('realtime_guides')
				.setPlaceholder('Select a guide')
				.addOptions(realtimeSelectOptions);

			const realtimeActionRow = new ActionRowBuilder().addComponents(realtimeGuidesSelectMenu);

			botResponse.setText(selectedGuide.local.content);
			if (targetUser) {
				botResponse.setText(botResponse.text + '\n' + `Suggestion for ${targetUser}`);
			}
			botResponse.addEmbeds(selectedGuide.local.embeds, botConfigs);

			botResponse = botResponse.build();
			botResponse.components = [realtimeActionRow];

			const botReply = await interaction.reply(botResponse);
			const selectMenuDisplayMinutes = 30;

			const collector = botReply.createMessageComponentCollector({
				componentType: ComponentType.StringSelect,
				time: selectMenuDisplayMinutes * 60 * 1000,
			});

			collector.on('collect', (i) => {
				let allowedToInteract = i.user.id === mainUser.id;

				if (targetUser) {
					allowedToInteract = i.user.id === mainUser.id || i.user.id === targetUser.id;
				}

				if (allowedToInteract) {
					const selectMenuResult = i.values[0];

					const realtimeGuides = botData.embeds.realtime.en;
					let guide;

					if (selectMenuResult === 'realtime_local') {
						guide = realtimeGuides.local;
					}
					else if (selectMenuResult === 'realtime_online') {
						guide = realtimeGuides.online;
					}
					else if (selectMenuResult === 'realtime_faq') {
						guide = realtimeGuides.faq;

					}

					botResponse.content = guide.content;
					botResponse.embeds = botUtils.createEmbeds(guide.embeds, availableColors);

					i.update(botResponse);
				}
				else {
					i.reply({ content: 'You didn\'t start this interaction, use `/guides realtime` if you wish to choose an option.', ephemeral: true });
				}
			});

			collector.on('end', (i) => {
				botResponse.content = '> This interaction has expired, use the command `/guides realtime` if you wish to see it again.';
				botResponse.embeds = [];
				botResponse.components = [];
				botReply.edit(botResponse);
			});
		}
		else {
			if (category === 'applio') {
				selectedGuide = botData.embeds.guides.applio[language];
				if (!selectedGuide) return interaction.reply(botResponse.build());
			}
			else if (category === 'audio') {
				selectedGuide = botData.embeds.guides.audio[language];
				if (!selectedGuide) return interaction.reply(botResponse.build());
			}
			else if (category === 'paperspace') {
				selectedGuide = botData.embeds.guides.paperspace[language];
				if (!selectedGuide) return interaction.reply(botResponse.build());
			}
			else if (category === 'upload') {
				selectedGuide = botData.embeds.guides.upload[language];
				if (!selectedGuide) return interaction.reply(botResponse.build());
			}
			else if (category === 'uvr') {
				selectedGuide = botData.embeds.guides.uvr[language];
				if (!selectedGuide) return interaction.reply(botResponse.build());
			}
			else if (category === 'rvc') {
				selectedGuide = botData.embeds.guides.rvc[language];
				if (!selectedGuide) return interaction.reply(botResponse.build());
			}

			botResponse.setText('');
			botResponse.setEphemeral(false);

			if (selectedGuide.embeds) {
				botResponse.addEmbeds(selectedGuide.embeds, botConfigs);
			}
			else {
				botResponse.addEmbeds(selectedGuide, botConfigs);
			}

			if (selectedGuide.buttons) {
				botResponse.addButtons(selectedGuide.buttons);
			}

			await sender.send();
		}
	},
};
