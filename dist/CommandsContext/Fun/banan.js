"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* context menu version of /banana */
const discord_js_1 = require("discord.js");
const botUtilities_1 = require("../../Utils/botUtilities");
const Banan = {
    category: 'Fun',
    data: new discord_js_1.ContextMenuCommandBuilder()
        .setName('banan')
        .setType(discord_js_1.ApplicationCommandType.User),
    async execute(interaction) {
        const client = interaction.client;
        const targetUser = interaction.targetUser;
        let guildMember = interaction.guild?.members.cache.get(targetUser.id);
        if (!guildMember) {
            client.logger.debug(`Guild member ${targetUser.id} not found in cache...Fetching`);
            guildMember = await interaction.guild?.members.fetch(targetUser.id);
        }
        if (!guildMember) {
            client.logger.debug(`Failed to get guild member ${targetUser.id}`);
            return interaction.reply({ content: "Failed to banan user.", ephemeral: true });
        }
        await (0, botUtilities_1.banan)(interaction, targetUser, guildMember);
    }
};
exports.default = Banan;
