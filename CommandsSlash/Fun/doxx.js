/* eslint-disable indent */
const Chance = require('chance');
const chance = new Chance;
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	category: 'Fun',
	cooldown: 60,
	type: 'slash',
	data: new SlashCommandBuilder()
		.setName('doxx')
		.setDescription('NOT ACTUAL DOXXING. creates random ip and house address')
		.addUserOption(option =>
			option
				.setName('user')
				.setDescription('User to doxx')
				.setRequired(true),
		),
	async execute(interaction) {

		if (interaction.client.disallowedChannelIds.includes(interaction.channelId)) {
			await interaction.reply({ content: 'This command is not available here.', ephemeral: true });
			return;
		}

		const targetUser = interaction.options.getUser('user');

		let guildMember = interaction.guild.members.cache.get(targetUser.id);

		if (!guildMember) {
			console.log('Guild member not found in cache...Fetching');
			guildMember = interaction.guild.members.fetch(targetUser.id);
		}

		const bot = interaction.client.user;

		const [ip, ipv6, mac, address] = interaction.client.doxx.ensure(
			targetUser.id, () => [chance.ip(), chance.ipv6(), chance.mac_address(), chance.address()],
		);

		const fetchingEmbed = new EmbedBuilder()
			.setTitle('⏳ Fetching...')
			.setColor('Yellow');

		const reply = await interaction.reply({ embeds: [fetchingEmbed] });

		const doxxData = {
			'title': '❌ Failed to retrieve information!',
			'IP': 'N/A',
			'IPv6': 'N/A',
			'MAC': 'N/A',
			'address': 'Not found',
			'embedColor': 'Red',
			'duration': 6000,
		};

		if (!targetUser.bot) {
			doxxData.title = `✅ We found you **${guildMember.nickname ?? targetUser.displayName ?? targetUser.username}**!`;
			doxxData.IP = ip;
			doxxData.IPv6 = ipv6;
			doxxData.MAC = mac;
			doxxData.address = address;
			doxxData.embedColor = 'Green';
			doxxData.duration = 3000;
		}
		else if (targetUser.id === bot.id) {
			// tried to doxx automaze...
			doxxData.title = '❌ yo i aint sharing my info';
			doxxData.address = 'under the bridge';
		}

		const embedDescription = [
			`**IP**: ${doxxData.IP}`,
			`**IPv6**: ${doxxData.IPv6}`,
			`**MAC Address**: ${doxxData.MAC}`,
			`**Address (not exact)**: ${doxxData.address}`,
			`\nUsed: \`/doxx\` ${targetUser}`,
		].join('\n');

		const foundEmbed = new EmbedBuilder()
			.setTitle(doxxData.title)
			.setDescription(embedDescription)
			.setColor(doxxData.embedColor);
		setTimeout(async () => {
			await reply.edit({ embeds: [foundEmbed] });
		}, doxxData.duration);
	},
};
