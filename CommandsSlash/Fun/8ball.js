const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Chance = require(`chance`);
const chance = new Chance;

module.exports = {
	category: `Fun`,
	scope: `global`,
	type: `slash`,
	data: new SlashCommandBuilder()
		.setName('8ball')
		.setDescription('Answer questions of your life')
		.addStringOption(option => option.setName('question').setDescription('Ask questions about your life').setRequired(true)),
	async execute(client, interaction) {
		if (interaction.client.disallowedChannelIds.includes(interaction.channelId)) {
            await interaction.reply({ content: 'This command is not available here.', ephemeral: true});
            return;
        }
		
		const question = interaction.options.getString('question');
		if (!question) {
			await interaction.reply('You need to provide a question!\n\n> Example: `/8ball` `Is RVC better than SVC?`')
		}
		else {
			const botResponses = interaction.client.botResponses.responses['8ball'];
			const affirmativeResponses = botResponses.affirmative;
			const noncommittalResponses = botResponses.nonCommital;
			const negativeResponses = botResponses.negative;

			const percent = chance.natural({ min: 1, max: 100 });
			let response;

			if (percent <= 50) {
				response = [affirmativeResponses[Math.floor(Math.random() * affirmativeResponses.length)], `Green`];
			} else if (percent > 50 && percent <= 75) {
				response = [noncommittalResponses[Math.floor(Math.random() * noncommittalResponses.length)], `Yellow`];
			} else {
				response = [negativeResponses[Math.floor(Math.random() * negativeResponses.length)], `Red`];
			}

			function percentToBar(percentile) {
				const filled = Math.floor(percentile / 10);
				const bar = [`*[*`, Array(filled).fill(`▰`), Array(10 - filled).fill(`▱`), `*]*`].flat();
				return bar.join(``);
			}

			const loadingEmbed = new EmbedBuilder()
				.setTitle(`🎱 Predicting the future... 🎱`)
				.setColor(`DarkButNotBlack`);

			const msg = await interaction.reply({ embeds: [loadingEmbed] });

			setTimeout(() => {
				const answerEmbed = new EmbedBuilder()
											.setTitle(question)
											.setColor(response[1])
											.setDescription(`## ${response[0]}\n# ${percentToBar(100 - percent)} - ${100 - percent}% possible`);
				msg.edit({ embeds: [answerEmbed] });
			}, 3000);
		}
	}
}
