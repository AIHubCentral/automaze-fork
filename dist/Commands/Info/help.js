"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discordUtilities_1 = require("../../Utils/discordUtilities");
const { StringSelectMenuBuilder, ActionRowBuilder } = require('discord.js');
const help = require(`../../../JSON/help.json`);
function createCommandList(commands, prefix) {
    const commandList = [];
    commands.forEach((command) => {
        const aliases = command.aliases.length ? ` || \`${command.aliases.join(', ')}\`` : '';
        commandList.push(`**‣ \`${prefix}${command.syntax}\`${aliases}** - ${command.description}`);
    });
    return commandList;
}
const Help = {
    name: 'help',
    category: 'Info',
    description: 'Provides all commands of the bot',
    aliases: [],
    syntax: 'help',
    async run(client, message, args, prefix) {
        if (!message)
            return;
        if (!args)
            return;
        if (!prefix)
            return;
        const categories = [...new Set(client.commands.map((command) => command.category))];
        const placeholderEmbed = (0, discordUtilities_1.createEmbed)({
            title: 'Please choose a category',
            color: client.botConfigs.colors.theme.primary,
        });
        const options = new StringSelectMenuBuilder()
            .setCustomId('dropdown')
            .setPlaceholder('Nothing selected');
        for (const category of categories) {
            options.addOptions({
                label: category,
                description: help[category],
                value: category,
            });
        }
        const dropdownActionRow = new ActionRowBuilder().addComponents(options);
        const reply = await message.reply({ embeds: [placeholderEmbed], components: [dropdownActionRow] });
        const filter = (i) => i.customId === 'dropdown' && i.user.id === message.author.id;
        // shows the help message for 5 minutes (300 seconds), multiply by 1000 to convert to milliseconds
        const collector = reply.createMessageComponentCollector({ filter, time: 300 * 1000 });
        collector.on('collect', (i) => {
            const commandsInCategory = client.commands.filter((command) => command.category === i.values[0]);
            const commandList = createCommandList(commandsInCategory, prefix);
            i.update({
                embeds: [
                    (0, discordUtilities_1.createEmbed)({
                        title: `${i.values[0]} commands`,
                        color: client.botConfigs.colors.theme.secondary,
                        description: commandList,
                        footer: `Parameters in <...> are required, whereas [...] is optional`,
                    }),
                ],
            });
        });
        collector.on(`end`, () => {
            reply.edit({
                embeds: [(0, discordUtilities_1.createEmbed)({ title: 'Command has expired', color: 'Red' })],
                components: [],
            });
        });
    },
};
exports.default = Help;
