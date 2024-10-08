"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Chance = require(`chance`);
const chance = new Chance();
const wait = require('node:timers/promises').setTimeout;
const utils = require('../../utils.js');
const EightBall = {
    category: 'Fun',
    data: new discord_js_1.SlashCommandBuilder()
        .setName('8ball')
        .setDescription('Answer questions of your life')
        .addStringOption((option) => option.setName('question').setDescription('Ask questions about your life').setRequired(true)),
    async execute(interaction) {
        const client = interaction.client;
        const question = interaction.options.getString('question');
        if (!question) {
            await interaction.reply('You need to provide a question!\n\n> Example: `/8ball` `Is RVC better than SVC?`');
        }
        else {
            const botResponses = client.botResponses.responses['8ball'];
            const affirmativeResponses = botResponses.affirmative;
            const noncommittalResponses = botResponses.nonCommital;
            const negativeResponses = botResponses.negative;
            const percent = chance.natural({ min: 1, max: 100 });
            let response;
            if (percent <= 50) {
                response = [
                    affirmativeResponses[Math.floor(Math.random() * affirmativeResponses.length)],
                    `Green`,
                ];
            }
            else if (percent > 50 && percent <= 75) {
                response = [
                    noncommittalResponses[Math.floor(Math.random() * noncommittalResponses.length)],
                    `Yellow`,
                ];
            }
            else {
                response = [negativeResponses[Math.floor(Math.random() * negativeResponses.length)], `Red`];
            }
            function percentToBar(percentile) {
                const filled = Math.floor(percentile / 10);
                const bar = [`*[*`, Array(filled).fill(`▰`), Array(10 - filled).fill(`▱`), `*]*`].flat();
                return bar.join(``);
            }
            const loadingEmbed = new discord_js_1.EmbedBuilder()
                .setTitle(`🎱 Predicting the future... 🎱`)
                .setColor(`DarkButNotBlack`);
            await interaction.reply({ embeds: [loadingEmbed] });
            // wait between 3 to 5 seconds
            await wait(utils.getRandomNumber(3000, 5000));
            const answerEmbed = new discord_js_1.EmbedBuilder()
                .setTitle(question)
                .setColor(response[1])
                .setDescription(`## ${response[0]}\n# ${percentToBar(100 - percent)} - ${100 - percent}% possible`);
            interaction.editReply({ embeds: [answerEmbed] });
        }
    },
};
exports.default = EightBall;
