"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const discordUtilities_1 = require("../../Utils/discordUtilities");
const CommandInfo = {
    name: 'commandinfo',
    category: 'Info',
    description: 'Information about one specific command',
    aliases: ['cinfo'],
    syntax: 'commandinfo <command_name>',
    async run(client, message, args, prefix) {
        if (!message)
            return;
        if (!args)
            return;
        if (!prefix)
            return;
        if (args.length === 0) {
            return message.reply(`Specify a command you want to look up.\n\n> Example: ${(0, discord_js_1.inlineCode)('-commandinfo')} rvc`);
        }
        const commandName = args[0];
        const command = client.commands.get(commandName) ||
            client.commands.find((c) => c.aliases && c.aliases.includes(commandName));
        if (!command) {
            return message.reply("That command doesn't exist.");
        }
        const embed = (0, discordUtilities_1.createEmbed)({
            description: [
                (0, discord_js_1.heading)((0, discord_js_1.inlineCode)(prefix + command.name), discord_js_1.HeadingLevel.One),
                (0, discord_js_1.unorderedList)([
                    `${(0, discord_js_1.bold)('Category')}: ${command.category}`,
                    `${(0, discord_js_1.bold)('Aliases')}: ${command.aliases.join(', ')}`,
                    `${(0, discord_js_1.bold)('Description')}: ${command.description}`,
                    `${(0, discord_js_1.bold)('Syntax')}: ${(0, discord_js_1.inlineCode)(prefix + command.syntax)}`,
                ]),
            ],
            color: client.botConfigs.colors.theme.primary,
        });
        await message.reply({ embeds: [embed] });
    },
};
exports.default = CommandInfo;
