import { inlineCode, heading, HeadingLevel, bold, unorderedList } from 'discord.js';
import { PrefixCommand } from '../../Interfaces/Command';
import { createEmbed } from '../../Utils/discordUtilities';

const CommandInfo: PrefixCommand = {
    name: 'commandinfo',
    category: 'Info',
    description: 'Information about one specific command',
    aliases: ['cinfo'],
    syntax: 'commandinfo <command_name>',
    async run(client, message, args, prefix) {
        if (!message) return;
        if (!args) return;
        if (!prefix) return;

        if (args.length === 0) {
            return message.reply(
                `Specify a command you want to look up.\n\n> Example: ${inlineCode('-commandinfo')} rvc`
            );
        }

        const commandName = args[0];
        const command: PrefixCommand | undefined =
            client.commands.get(commandName) ||
            client.commands.find((c) => c.aliases && c.aliases.includes(commandName));

        if (!command) {
            return message.reply("That command doesn't exist.");
        }

        const embed = createEmbed({
            description: [
                heading(inlineCode(prefix + command.name), HeadingLevel.One),
                unorderedList([
                    `${bold('Category')}: ${command.category}`,
                    `${bold('Aliases')}: ${command.aliases.join(', ')}`,
                    `${bold('Description')}: ${command.description}`,
                    `${bold('Syntax')}: ${inlineCode(prefix + command.syntax)}`,
                ]),
            ],
            color: client.botConfigs.colors.theme.primary,
        });

        await message.reply({ embeds: [embed] });
    },
};

export default CommandInfo;
