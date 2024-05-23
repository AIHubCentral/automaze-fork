import { Message } from "discord.js";
import IEventData from "../Interfaces/Events";
import { delay } from "../Utils/generalUtilities";

const BotChat: IEventData = {
	name: 'messageCreate',
	once: false,
	async run(client, message: Message) {
		// only proceed if feture is enabled in configs
		if (!client.botConfigs.general.chat) return;

		if (message.author.bot) return;

		// skip prefix commands
		const prefix = client.prefix;
		if (message.content.startsWith(prefix)) return;

		const messageLowercase = message.content.toLowerCase();

		if (messageLowercase.endsWith('?')) {
			messageLowercase.replace('?', '');
		}

		const { botResponses, botUtils } = client;

		const questions = botResponses.botChat.en;
		let selectedAnswer = null;

		for (const msg of questions) {
			if (msg.prompts.includes(messageLowercase)) {
				const responseTypes = ['positive', 'negative'];
				if (botUtils.getRandomFromArray(responseTypes) === 'positive') {
					selectedAnswer = botUtils.getRandomFromArray(msg.answers.positive);
				}
				else {
					selectedAnswer = botUtils.getRandomFromArray(msg.answers.negative);
				}

				if (selectedAnswer.includes('$user')) {
					selectedAnswer = selectedAnswer.replace('$user', message.author);
				}

				const answerLength = selectedAnswer.length;
				const typingDurationMs = 500;
				await message.channel.sendTyping();
				await delay(answerLength * typingDurationMs);
				await message.reply(selectedAnswer);
				client.logger.info('Bot chat', {
					more: {
						channelId: message.channel.id,
						guildId: message.guild?.id,
						reply: selectedAnswer,
					}
				});
			}
		}
	}
}

export default BotChat;