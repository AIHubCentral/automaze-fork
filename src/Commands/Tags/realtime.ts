import {
    StringSelectMenuBuilder, StringSelectMenuOptionBuilder,
    ActionRowBuilder, ComponentType,
    Message,
    MessageReplyOptions,
    InteractionUpdateOptions,
    MessageEditOptions
} from 'discord.js';

import ExtendedClient from '../../Core/extendedClient';
import { SelectMenuOption } from '../../Interfaces/BotData';
import { PrefixCommand } from '../../Interfaces/Command';
import { createEmbeds } from '../../Utils/discordUtilities';

function createMenuOptions(availableOptions: SelectMenuOption[]): StringSelectMenuOptionBuilder[] {
    const menuOptions: StringSelectMenuOptionBuilder[] = [];

    for (const option of availableOptions ?? []) {
        const optionBuilder = new StringSelectMenuOptionBuilder()
            .setLabel(option.label)
            .setDescription(option.description)
            .setValue(option.value);
        if (option.emoji) {
            optionBuilder.setEmoji(option.emoji);
        }
        menuOptions.push(optionBuilder);
    }

    return menuOptions;
}

const Realtime: PrefixCommand = {
    name: 'realtime',
    category: 'Tags',
    description: 'RVC real-time conversion guide',
    aliases: ['rt', 'tts'],
    syntax: `realtime [member]`,
    run: async (client: ExtendedClient, message: Message) => {
        const { botData, botConfigs, botUtils } = client;
        const availableColors = botUtils.getAvailableColors(botConfigs);

        const realtimeSelectOptions = botData.embeds.realtime.en['menuOptions'];

        if (!realtimeSelectOptions) throw new Error('Missing menu options');

        let selectedGuide = botData.embeds.realtime.en['local'];

        const menuOptions = createMenuOptions(realtimeSelectOptions);

        var realtimeGuidesSelectMenu = new StringSelectMenuBuilder()
            .setCustomId('realtime_guides')
            .setPlaceholder('Select a guide')
            .addOptions(menuOptions);

        const realtimeActionRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(realtimeGuidesSelectMenu);

        let botResponse: MessageReplyOptions = {
            embeds: createEmbeds(selectedGuide!.embeds, availableColors),
            components: [realtimeActionRow]
        };

        let selectMenuDisplayMinutes = 15;  // allow interaction with the select menu for 15 minutes
        let targetUser = message.mentions.members?.first();
        let mainUser = message.author;

        if (targetUser) {
            botResponse.content = `*Tag suggestion for ${message.mentions.members?.first()}*`;
        }

        const botReply = await message.reply(botResponse);

        const collector = botReply.createMessageComponentCollector({
            componentType: ComponentType.StringSelect,
            time: selectMenuDisplayMinutes * 60 * 1000
        });

        collector.on('collect', (i) => {
            let allowedToInteract = i.user.id === mainUser.id;

            if (targetUser) {
                allowedToInteract = i.user.id === mainUser.id || i.user.id === targetUser.id;
            }

            if (allowedToInteract) {
                const selectMenuResult = i.values[0];

                const realtimeGuides = botData.embeds.realtime.en;
                let guide;

                if (selectMenuResult === 'realtime_local') {
                    guide = realtimeGuides.local
                }
                else if (selectMenuResult === 'realtime_online') {
                    guide = realtimeGuides.online
                }
                else if (selectMenuResult === 'realtime_faq') {
                    guide = realtimeGuides.faq

                }

                if (targetUser) {
                    botResponse.content = `\nSuggestions for ${targetUser}`;
                }

                botResponse.embeds = createEmbeds(guide!.embeds, availableColors);

                i.update(<InteractionUpdateOptions>botResponse);
            } else {
                i.reply({ content: 'You didn\'t start this interaction, use `/guides realtime` if you wish to choose an option.', ephemeral: true });
            }
        });

        collector.on('end', () => {
            botResponse.content = '> This interaction has expired, use the command `/guides realtime` if you wish to see it again.';
            botResponse.embeds = [];
            botResponse.components = [];
            botReply.edit(<MessageEditOptions>botResponse);
        });
    }
}

export default Realtime;