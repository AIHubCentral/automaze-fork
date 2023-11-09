const {
    StringSelectMenuBuilder, StringSelectMenuOptionBuilder,
    ActionRowBuilder, ButtonBuilder, ButtonStyle,
    SlashCommandBuilder,
    ComponentType
} = require('discord.js');

module.exports = {
    name: 'realtime',
    category: 'Tags',
    description: 'RVC real-time conversion guide',
    aliases: ['rt', 'tts'],
    syntax: `realtime [member]`,
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: async (client, message, args, prefix) => {
        const { botData, botConfigs, botUtils } = client;
        const availableColors = botUtils.getAvailableColors(botConfigs);

        const realtimeSelectOptions = botData.embeds.guides.realtime.en['menuOptions'];
        selectedGuide = botData.embeds.guides.realtime.en['local']['embeds'];

        var realtimeGuidesSelectMenu = new StringSelectMenuBuilder()
            .setCustomId('realtime_guides')
            .setPlaceholder('Select a guide')
            .addOptions(
                realtimeSelectOptions.map(menuOption =>
                    new StringSelectMenuOptionBuilder()
                        .setLabel(menuOption.label)
                        .setDescription(menuOption.description)
                        .setValue(menuOption.value)
                        .setEmoji(menuOption.emoji)
                ));

        const realtimeActionRow = new ActionRowBuilder().addComponents(realtimeGuidesSelectMenu);

        let botResponse = {
            content: selectedGuide.content,
            embeds: botUtils.createEmbeds(selectedGuide, availableColors),
            components: [realtimeActionRow]
        };

        if (message.mentions.members.first()) {
            botResponse.content = `*Tag suggestion for ${message.mentions.members.first()}*`;
        }

        const botReply = await message.reply(botResponse);

        const selectMenuDisplayMinutes = 5;  // allow interaction with the select menu for 5 minutes

        const collector = botReply.createMessageComponentCollector({
            componentType: ComponentType.StringSelect,
            time: selectMenuDisplayMinutes * 60 * 1000
        });

        collector.on('collect', (i) => {
            let allowedToInteract = i.user.id === message.author.id;

            if (message.mentions.members.first()) {
                allowedToInteract = i.user.id === message.author.id || i.user.id === message.mentions.members.first().id;
            }

            if (allowedToInteract) {
                const selectMenuResult = i.values[0];

                const realtimeGuides = botData.embeds.guides.realtime.en;
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

                botResponse.content = guide.content;
                botResponse.embeds = botUtils.createEmbeds(guide.embeds, availableColors);

                i.update(botResponse);
            } else {
                i.reply({ content: 'You didn\'t start this interaction, use `/guides realtime` if you wish to choose an option.', ephemeral: true });
            }
        });

        collector.on('end', (i) => {
            botResponse.content = '> This interaction has expired, use the command `/guides realtime` if you wish to see it again.';
            botResponse.embeds = [];
            botResponse.components = [];
            botReply.edit(botResponse);
        });
    }
}