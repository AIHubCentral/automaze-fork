module.exports = {
	name: 'howtoask',
	category: 'Tags',
	description: 'How to ask for help properly.',
	aliases: ['ask', 'hta'],
	syntax: 'howtoask',
	run: async (client, message) => {
		await message.reply('This command has been changed to `!howtoask`');
	},
};