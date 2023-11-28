// Libraries needed
const fs = require('fs');
const path = require('node:path');
const { Collection, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

// Will give you all the files in a folder recursively
function getAllFiles(currentPath) {
	let currentFiles = [];
	for (const thatFile of fs.readdirSync(currentPath)) {
		const filePath = currentPath + '/' + thatFile;
		if (fs.lstatSync(filePath).isDirectory()) {
			currentFiles = currentFiles.concat(currentFiles, getAllFiles(filePath));
		}
		else {
			currentFiles.push(filePath);
		}
	}
	return [...new Set(currentFiles)];
}
exports.getAllFiles = getAllFiles;

// Create delay async in the script
async function delay(ms) {
	return new Promise(resolve => {
		setTimeout(resolve, ms);
	});
}
exports.delay = delay;

function getRandomNumber(min, max) {
	/* gets a random number between min and max */
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

exports.getRandomNumber = getRandomNumber;

function getRandomFromArray(arr) {
	/* gets a random value from an array */
	if (arr.length === 0) return null;
	if (arr.length === 1) return arr[0];
	const randomIndex = getRandomNumber(0, arr.length - 1);
	return arr[randomIndex];
}

exports.getRandomFromArray = getRandomFromArray;

function getCommands(basePath, subPath) {
	/* get an array of commands converted to json ready to be sent to discord API */
	const commands = [];

	const foldersPath = path.join(basePath, subPath);
	const commandFolders = fs.readdirSync(foldersPath);

	for (const folder of commandFolders) {
		const commandsPath = path.join(foldersPath, folder);
		const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
		// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
		for (const file of commandFiles) {
			const filePath = path.join(commandsPath, file);
			const command = require(filePath);
			if ('data' in command && 'execute' in command) {
				commands.push(command.data.toJSON());
			}
			else {
				console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
			}
		}
	}

	return commands;
}

exports.getCommands = getCommands;


function createEmbed(data, color = '') {
	/**
	 * Creates a discord embed from an object passed as `data` argument
	 */
	const embed = new EmbedBuilder();

	// if the color not provided as an argument, try to use from data
	if (!color) {
		color = data.color;
	}
	embed.setColor(color ?? 'Yellow');

	if (data.title) {
		embed.setTitle(data.title);
	}

	if (data.description) {
		embed.setDescription(data.description.join('\n'));
	}

	if (data.fields) {
		embed.setFields(data.fields);
	}

	if (data.image) {
		embed.setImage(data.image);
	}

	if (data.thumbnail) {
		embed.setThumbnail(data.thumbnail);
	}

	if (data.footer) {
		embed.setFooter({ text: data.footer });
	}

	if (data.timestamp) {
		embed.setTimestamp();
	}

	return embed;
}

exports.createEmbed = createEmbed;


function createEmbeds(contents, colors) {
	/* create embeds from an array of objects and assign colors */
	let colorIndex = 0;
	const embeds = contents.map(item => {
		if (colorIndex >= colors.length) {
			// goes back to the start of the array after reaching the end
			colorIndex = 0;
		}
		const selectedColor = item.color ?? colors[colorIndex++];
		return createEmbed(item, selectedColor);
	});
	return embeds;
}

exports.createEmbeds = createEmbeds;

function getAvailableColors(configs) {
	return Object.values(configs.colors.theme);
}

exports.getAvailableColors = getAvailableColors;

async function banan(interaction, targetUser, guildMember) {
	const { client, user } = interaction;

	// check if user is on cooldown
	if (Date.now() <= client.cooldowns.banana.get(user.id)) {
		return interaction.reply(`dumbass yuo alredy banan ppl, wait GRRRRRRRRRRRRRRR!!!!!!!!!!!!!!!!!!!!!!!! yu gto ${client.cooldowns.banana.get(interaction.user.id) - Date.now()} milliseconds left im too lazy to do math do it yourself GRRRRRRRRRR`);
	}

	if (client.disallowedChannelIds.includes(interaction.channelId)) {
		return await interaction.reply({ content: 'This command is not available here.', ephemeral: true });
	}

	let member = targetUser;
	const botResponses = client.botResponses.responses.banana;
	let selectedResponse = null;

	// if its true automaze banan the user instead
	let botRevenge = false;

	if (!member) return interaction.reply(botResponses.targetNone);

	if (member.bot) {
		const responses = botResponses.targetBot;
		selectedResponse = responses[Math.floor(Math.random() * responses.length)];
		if (!selectedResponse.startsWith('NO,')) {
			return interaction.reply(selectedResponse);
		}

		// change the banan target to the user who tried to banan automaze or any other bot
		member = interaction.user;
		botRevenge = true;
	}

	// check if user is in database
	let dbResult = await client.knexInstance('user').where('id', `${member.id}`);
	let userData;

	if (dbResult.length === 0) {
		console.log('User not found in database');
		userData = {
			id: `${member.id}`,
			username: member.username,
		};

		if (guildMember.nickname) {
			userData.displayName = guildMember.nickname;
		}

		await client.knexInstance('user').insert(userData);
		console.log(`${member.username} added to database`);
	}
	else if (guildMember.nickname !== dbResult[0].displayName) {
		await client.knexInstance('user').update({ display_name: guildMember.nickname ?? member.displayName }).where({ id: member.id });
		console.log(`Added ${guildMember.nickname ?? member.displayName} display name for ${member.username}`);
	}

	// check if banana is in the user inventory
	dbResult = await client.knexInstance('inventory').where({
		// banana id: 1
		'user_id': `${member.id}`,
		'item_id': 1,
	});

	if (dbResult.length === 0) {
		// add banana to inventory
		await client.knexInstance('inventory').insert({
			'user_id': `${member.id}`,
			'item_id': 1,
			quantity: 1,
		});
	}
	else {
		// if already have banana, increment the value
		await client.knexInstance('inventory').update({
			quantity: dbResult[0].quantity + 1,
		}).where({
			'user_id': `${member.id}`,
			'item_id': 1,
		});
	}

	// last query to check how much bananas
	dbResult = await client.knexInstance('inventory').where({
		'user_id': `${member.id}`,
		'item_id': 1,
	});

	// copy embed data
	const embedData = JSON.parse(JSON.stringify(client.botData.embeds.banana));
	embedData.title = embedData.title.replace('$username', guildMember.nickname ?? member.displayName ?? member.username);
	embedData.description[0] = embedData.description[0].replaceAll('$member', member);
	embedData.footer = embedData.footer.replace('$quantity', dbResult[0].quantity);

	if (dbResult[0].quantity > 1) {
		embedData.footer = embedData.footer.replace('TIME', 'TIMES');
	}

	const embed = client.botUtils.createEmbed(embedData, 'Yellow');

	// cooldown expires in 1 minute
	client.cooldowns.banana.set(interaction.user.id, Date.now() + (1 * 60 * 1000));

	if (botRevenge) {
		await interaction.reply(selectedResponse);
		return interaction.followUp({ embeds: [embed] });
	}

	interaction.reply({ embeds: [embed] });
}

exports.banan = banan;


function saveJSON(filename, data) {
	let success = false;
	const dateString = new Date().toISOString().slice(0, 10);
	const filepath = path.join(process.cwd(), 'Debug', `${filename}-${dateString}.json`);
	try {
		let content = [];
		if (fs.existsSync(filepath)) {
			content = JSON.parse(fs.readFileSync(filepath, 'utf-8'));
		}
		content.push(data);
		fs.writeFileSync(filepath, JSON.stringify(content, null, 4));
		success = true;
	}
	catch (error) {
		console.log(`Failed to save ${filepath}`);
		console.error(error);
	}
	return success;
}

exports.saveJSON = saveJSON;

async function getChannelById(channelId, guild) {
	/* attempts to get a channel from cache, fetch if not found */
	let channel = guild.channels.cache.get(channelId);
	if (!channel) {
		console.log(`Channel ${channelId} not found in cache...Fetching`);
		channel = await guild.channels.fetch(channelId);
	}
	return channel;
}

exports.getChannelById = getChannelById;

const wait = require('node:timers/promises').setTimeout;
const cron = require('node-cron');

class Scheduler {
	constructor(client) {
		this.client = client;
		this.isRunning = false;
		this.task = cron.schedule('0 */6 * * *', () => {
			// runs every 6 hours
			this.executeTask();
		}, { scheduled: false });
	}

	start() {
		this.task.start();
		this.isRunning = true;
		console.log('Task started!');
	}

	stop() {
		this.task.stop();
		this.isRunning = false;
		console.log('Task stopped!');
	}

	executeTask() {
		console.log('Running task...');
		this.sendGuides();
	}

	async sendGuides() {
		const { discordIDs, botUtils, botConfigs, botData } = this.client;
		const availableColors = getAvailableColors(botConfigs);
		const guild = this.client.guilds.cache.get(discordIDs.Guild);
		const botResponse = {};

		// send guides to help-okada
		botResponse.embeds = botUtils.createEmbeds(botData.embeds.help.WOkada, availableColors);
		const helpOkadaChannel = await getChannelById(discordIDs.Channel.HelpWOkada, guild);
		await helpOkadaChannel.send(botResponse);
		await wait(180_000);

		// send guides to help channel
		botResponse.content = '# RVC Guides (How to Make AI Cover)';
		botResponse.embeds = botUtils.createEmbeds([botData.embeds.rvc.main], availableColors);
		const helpChannel = await getChannelById(discordIDs.Channel.HelpRVC, guild);
		await helpChannel.send(botResponse);
		await wait(60_000);

		if (botConfigs.general.sendLogs) {
			// notify dev server
			botResponse.embeds = [];
			botResponse.content = `📚 Guides sent to ${helpChannel} and ${helpOkadaChannel}.`;
			const devServerGuild = this.client.guilds.cache.get(botConfigs.devServerId);
			const debugChannel = await getChannelById(botConfigs.debugChannelId, devServerGuild);
			await debugChannel.send(botResponse);
		}
	}
}

exports.Scheduler = Scheduler;

class BotResponseBuilder {
	/* utility class for creating bot responses */

	constructor() {
		this.text = '';
		this.ephemeral = false;
		this.embeds = [];
		this.components = [];
	}

	setText(text) {
		this.text = text;
	}

	addEmbeds(embedsData, configs) {
		// color theme to use on the embeds
		const availableColors = getAvailableColors(configs);
		this.embeds = createEmbeds(embedsData, availableColors);
	}

	addButtons(buttonsData) {
		const buttons = buttonsData.map(btnData => {
			return new ButtonBuilder().setLabel(btnData.label).setURL(btnData.url).setStyle(ButtonStyle.Link);
		});
		const actionRow = new ActionRowBuilder().addComponents(buttons);
		this.components.push(actionRow);
	}

	build() {
		const response = { content: this.text, ephemeral: this.ephemeral };
		if (this.embeds.length) {
			response.embeds = this.embeds;
		}
		if (this.components.length) {
			response.components = this.components;
		}
		return response;
	}
}

exports.BotResponseBuilder = BotResponseBuilder;

class TagResponseSender {
	/* utility class for sending tags responses like -rvc */

	constructor() {
		this.channel = null;
		this.response = new BotResponseBuilder();
		this.responseData = null;
		this.configs = null;
		this.guides = null;
		this.targetUser = null;
		this.languageChannelResponses = new Collection();
		this.isReply = false;
		this.mentionMessage = 'Suggestion for $user';
	}

	setChannel(channel) {
		this.channel = channel;
	}

	setDefaultResponse(responseData) {
		this.responseData = responseData;
	}

	setConfigs(configs) {
		this.configs = configs;
	}

	setGuides(guides) {
		this.guides = guides;
	}

	setTargetUser(user) {
		if (user) {
			this.targetUser = user;
		}
	}

	setTargetMessage(message) {
		this.message = message;
	}

	setIsReply(isReply) {
		// if true sends the message as reply, otherwise send it to the channel
		this.isReply = isReply;
	}

	async send() {
		if (!this.channel) throw new Error('Discord channel not specified.');
		if (!this.response) throw new Error('Attempted to send an empty response.');
		if (!this.configs) throw new Error('Missing bot configs.');

		// check if channel is a language channel
		if (this.languageChannelResponses.has(this.channel.id)) {
			this.responseData = this.languageChannelResponses.get(this.channel.id);
		}

		if (this.targetUser) {
			let mentionMessage = this.mentionMessage;

			if (this.responseData.mentionMessage) {
				// use the message from json if available
				mentionMessage = this.responseData.mentionMessage;
			}

			mentionMessage = mentionMessage.replace('$user', this.targetUser);
			this.response.setText(this.response.text + '\n' + mentionMessage);
		}

		if (this.responseData.embeds) {
			this.response.addEmbeds(this.responseData.embeds, this.configs);
		}

		if (this.responseData.buttons) {
			this.response.addButtons(this.responseData.buttons);
		}

		if (this.isReply) {
			await this.message.reply(this.response.build());
		}
		else {
			await this.channel.send(this.response.build());
		}
	}
}

exports.TagResponseSender = TagResponseSender;