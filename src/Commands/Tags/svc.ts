import { MessageReplyOptions } from "discord.js";
import { PrefixCommand } from "../../Interfaces/Command";
import { delay, getRandomFromArray, getRandomNumber } from "../../Utils/generalUtilities";

const SVC: PrefixCommand = {
	name: 'svc',
	category: 'Tags',
	description: 'why do you still use svc',
	aliases: [],
	syntax: 'svc',
	async run(client, message) {
		const { botResponses } = client;
		const botResponse: MessageReplyOptions = {};

		const randomNumber = getRandomNumber(0, 9);
		if (randomNumber !== 0) {
			botResponse.content = 'https://cdn.discordapp.com/attachments/1159822429137412177/1194008385113301003/svc.gif?ex=65c13ef6&is=65aec9f6&hm=ce1f57bc316793f641c80f9b359ba9db7d1312af6918b1aed9c8468c74035bac&';
			return message.reply(botResponse);
		}
		const selectedMessage = getRandomFromArray(botResponses.responses.svc);
		botResponse.content = selectedMessage;

		let mentionedUser = null;

		if (message.mentions.members?.size) {
			mentionedUser = message.mentions.members.first();
		}

		if (mentionedUser) {
			botResponse.content = `${mentionedUser} ${selectedMessage}`;

			// if mentioned a bot send 'how to make ai cover sticker'
			if (mentionedUser.user.bot) {
				botResponse.allowedMentions = { repliedUser: true };
				botResponse.content = '';
				botResponse.stickers = ['1159360069557813268'];
				return message.reply(botResponse);
			}

			await message.channel.sendTyping();
			await delay(selectedMessage.length * 350);
			return message.channel.send(botResponse);
		}

		await message.channel.sendTyping();
		await delay(selectedMessage.length * 350);
		return message.reply(botResponse);
	},
};

export default SVC;