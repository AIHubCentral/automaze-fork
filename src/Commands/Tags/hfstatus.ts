import axios from 'axios';
import { PrefixCommand } from '../../Interfaces/Command';
import { getResourceData } from '../../Utils/botUtilities';
import { delay } from '../../Utils/generalUtilities';
import winston from 'winston';
import { EmbedBuilder, Colors } from 'discord.js';

const HFStatus: PrefixCommand = {
    name: 'hfstatus',
    description: 'Check hugginface status for the spaces',
    aliases: [],
    async run(client, message) {
        const { botCache, logger } = client;

        const resources = await getResourceData('hf', botCache, logger);
        if (resources.length === 0) return;

        const embed = new EmbedBuilder().setTitle('⏳ Checking...').setColor(Colors.Yellow);
        embed.setDescription(resources.map((resource) => `- ❔ ${resource.url}`).join('\n'));

        const botReply = await message.reply({ embeds: [embed] });

        const results: string[] = [];

        for (const resource of resources) {
            let statusEmoji = '❔';

            if (await checkSpaceStatus(resource.url, logger)) {
                statusEmoji = '🟢';
            } else {
                statusEmoji = '❌';
                embed.setColor(Colors.DarkOrange);
            }

            results.push(`- ${statusEmoji} ${resource.url}`);
        }

        embed.setTitle('🤗 Hugginface Status');
        embed.setDescription(results.join('\n'));
        embed.setURL('https://status.huggingface.co/');
        await botReply.edit({ embeds: [embed] });
    },
};

export default HFStatus;

async function checkSpaceStatus(url: string, logger: winston.Logger): Promise<boolean> {
    logger.info(`Checking HF spaces status for ${url}...`);

    await delay(1_500);

    try {
        const response = await axios.get(url);

        // If request is successful, space is up and running
        if (response.status === 200) {
            logger.info('Space is up and running.');
            return true;
        } else {
            logger.info('Space might be down.');
            return false;
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response && error.response.status === 404) {
                logger.error('Space not found. Ensure the Space ID is correct.');
            } else {
                logger.error('Error checking space status:', error.message);
            }
        } else {
            logger.error('Unexpected error:', error);
        }

        return false;
    }
}
