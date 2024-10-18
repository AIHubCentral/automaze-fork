import {
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    ActionRowBuilder,
    Message,
    MessageReplyOptions,
    InteractionUpdateOptions,
    MessageEditOptions,
    Interaction,
    TextChannel,
    StringSelectMenuInteraction,
} from 'discord.js';

import ExtendedClient from '../../Core/extendedClient';
import { EmbedData, SelectMenuData, SelectMenuOption } from '../../Interfaces/BotData';
import { PrefixCommand } from '../../Interfaces/Command';
import { createEmbeds } from '../../Utils/discordUtilities';
import i18next from 'i18next';
import { generateRandomId } from '../../Utils/generalUtilities';

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
    description: 'RVC real-time conversion guide',
    aliases: ['rt', 'tts'],
    run: async (client: ExtendedClient, message: Message) => {
        const { botConfigs, botUtils } = client;
        const availableColors = botUtils.getAvailableColors(botConfigs);

        const realtimeSelectOptions = i18next.t('tags.realtime.menuOptions', {
            returnObjects: true,
        }) as SelectMenuOption[];

        // selects local RVC by default
        const selectedGuide = i18next.t('tags.realtime.local', {
            returnObjects: true,
        }) as SelectMenuData;

        const menuOptions = createMenuOptions(realtimeSelectOptions);

        const menuId = `realtime_${generateRandomId(6)}`;

        const realtimeGuidesSelectMenu = new StringSelectMenuBuilder()
            .setCustomId(menuId)
            .setPlaceholder(i18next.t('tags.realtime.placeholder'))
            .addOptions(menuOptions);

        const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(realtimeGuidesSelectMenu);

        const botResponse: MessageReplyOptions = {
            embeds: createEmbeds(selectedGuide.embeds, availableColors),
            components: [row],
        };

        const selectMenuDisplayMinutes = 10; // allow interaction with the select menu for 10 minutes
        const targetUser = message.mentions.members?.first();
        const mainUser = message.author;

        if (targetUser) {
            botResponse.content = i18next.t('general.suggestions_for_user', { userId: targetUser.id });
        }

        const botReply = await message.reply(botResponse);

        const currentChannel = message.channel as TextChannel;
        const filter = (i: Interaction) => i.isStringSelectMenu() && i.customId === menuId;

        const collector = currentChannel.createMessageComponentCollector({
            filter,
            time: selectMenuDisplayMinutes * 60 * 1000,
        });

        collector.on('collect', async (i: StringSelectMenuInteraction) => {
            let allowedToInteract = i.user.id === mainUser.id;

            if (targetUser) {
                allowedToInteract = i.user.id === mainUser.id || i.user.id === targetUser.id;
            }

            if (allowedToInteract) {
                await i.deferUpdate();

                const selectMenuResult = i.values[0];

                const guideEmbeds = i18next.t(`tags.realtime.${selectMenuResult}.embeds`, {
                    returnObjects: true,
                }) as EmbedData[];

                if (targetUser) {
                    botResponse.content = i18next.t('general.suggestions_for_user', {
                        userId: targetUser.id,
                    });
                }

                botResponse.embeds = createEmbeds(guideEmbeds, availableColors);

                i.editReply(<InteractionUpdateOptions>botResponse);
            } else {
                i.reply({
                    content: i18next.t('tags.realtime.not_allowed_to_interact'),
                    ephemeral: true,
                });
            }
        });

        collector.on('end', () => {
            botResponse.content = i18next.t('tags.realtime.expired');
            botResponse.embeds = [];
            botResponse.components = [];
            botReply.edit(<MessageEditOptions>botResponse);
        });
    },
};

export default Realtime;
