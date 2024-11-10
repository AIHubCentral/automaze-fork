"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line @typescript-eslint/no-require-imports
const Chance = require('chance');
const chance = new Chance();
const discord_js_1 = require("discord.js");
const botUtilities_1 = require("../../Utils/botUtilities");
const Doxx = {
    category: 'Fun',
    cooldown: 60,
    data: new discord_js_1.SlashCommandBuilder()
        .setName('doxx')
        .setDescription('NOT ACTUAL DOXXING. creates random ip and house address')
        .addUserOption((option) => option.setName('user').setDescription('User to doxx').setRequired(true)),
    async execute(interaction) {
        const client = interaction.client;
        try {
            const targetUser = interaction.options.getUser('user');
            const guild = interaction.guild;
            if (!targetUser || !guild) {
                client.logger.error('Failed to retrieve user or guild', {
                    more: {
                        guild: guild,
                        targetUser: targetUser,
                    },
                });
                return;
            }
            let guildMember = guild.members.cache.get(targetUser.id);
            if (!guildMember) {
                client.logger.debug(`Guild member ${targetUser.id} not found in cache...Fetching`);
                guildMember = await guild.members.fetch(targetUser.id);
            }
            const bot = interaction.client.user;
            const [ip, ipv6, mac, address] = client.doxx.ensure(targetUser.id, () => [
                chance.ip(),
                chance.ipv6(),
                chance.mac_address(),
                chance.address(),
            ]);
            const fetchingEmbed = new discord_js_1.EmbedBuilder().setTitle('⏳ Fetching...').setColor('Yellow');
            const reply = await interaction.reply({ embeds: [fetchingEmbed] });
            const doxxData = {
                title: '❌ Failed to retrieve information!',
                IP: 'N/A',
                IPv6: 'N/A',
                MAC: 'N/A',
                address: 'Not found',
                embedColor: 'Red',
                duration: 6000,
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
            const foundEmbed = new discord_js_1.EmbedBuilder()
                .setTitle(doxxData.title)
                .setDescription(embedDescription)
                .setColor(doxxData.embedColor);
            setTimeout(async () => {
                await reply.edit({ embeds: [foundEmbed] });
            }, doxxData.duration);
        }
        catch (error) {
            await (0, botUtilities_1.sendErrorLog)(client, error, {
                command: `/${interaction.commandName}`,
                message: 'failure on /doxx',
                guildId: interaction.guildId ?? '',
                channelId: interaction.channelId,
            });
        }
    },
};
exports.default = Doxx;
