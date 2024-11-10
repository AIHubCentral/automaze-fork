import { EmbedBuilder, SlashCommandBuilder, SlashCommandStringOption } from 'discord.js';
import { SlashCommand } from '../../Interfaces/Command';
import ExtendedClient from '../../Core/extendedClient';
import { sendErrorLog } from '../../Utils/botUtilities';
import { delay, getRandomNumber } from '../../Utils/generalUtilities';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const Chance = require(`chance`);
const chance = new Chance();

const EightBall: SlashCommand = {
    category: 'Fun',
    data: new SlashCommandBuilder()
        .setName('8ball')
        .setDescription('Answer questions of your life')
        .addStringOption((option: SlashCommandStringOption) =>
            option.setName('question').setDescription('Ask questions about your life').setRequired(true)
        ),
    async execute(interaction) {
        const client = <ExtendedClient>interaction.client;
        const question = interaction.options.getString('question', true);

        try {
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
            } else if (percent > 50 && percent <= 75) {
                response = [
                    noncommittalResponses[Math.floor(Math.random() * noncommittalResponses.length)],
                    `Yellow`,
                ];
            } else {
                response = [negativeResponses[Math.floor(Math.random() * negativeResponses.length)], `Red`];
            }

            function percentToBar(percentile: number) {
                const filled = Math.floor(percentile / 10);
                const bar = [`*[*`, Array(filled).fill(`▰`), Array(10 - filled).fill(`▱`), `*]*`].flat();
                return bar.join(``);
            }

            const loadingEmbed = new EmbedBuilder()
                .setTitle(`🎱 Predicting the future... 🎱`)
                .setColor(`DarkButNotBlack`);

            await interaction.reply({ embeds: [loadingEmbed] });

            // wait between 3 to 5 seconds
            await delay(getRandomNumber(3000, 5000));

            const answerEmbed = new EmbedBuilder()
                .setTitle(question)
                .setColor(response[1])
                .setDescription(
                    `## ${response[0]}\n# ${percentToBar(100 - percent)} - ${100 - percent}% possible`
                );

            interaction.editReply({ embeds: [answerEmbed] });
        } catch (error) {
            await sendErrorLog(client, error, {
                command: `/${interaction.commandName}`,
                message: 'failure on /8ball',
                guildId: interaction.guildId ?? '',
                channelId: interaction.channelId,
            });
        }
    },
};

export default EightBall;
