import { ApplicationCommandType, ContextMenuCommandBuilder, EmbedBuilder } from "discord.js";
import { ContextCommand } from "../../Interfaces/Command";
import ExtendedClient from "../../Core/extendedClient";
import { SelectMenuData } from "../../Interfaces/BotData";
import { createEmbed } from "../../Utils/discordUtilities";

function createEmbeds(guides: SelectMenuData[]): EmbedBuilder[] {
    const embeds: EmbedBuilder[] = [];

    for (const guide of guides) {
        for (const data of guide.embeds) {
            const embed = createEmbed(data);
            embeds.push(embed);
        }
    }

    return embeds;
}

const SendRealtimeGuides: ContextCommand = {
    category: 'Tags',
    data: new ContextMenuCommandBuilder()
        .setName('Send Realtime guides')
        .setType(ApplicationCommandType.User)
    ,
    async execute(interaction) {
        const { targetUser } = interaction;
        const client = interaction.client as ExtendedClient;

        if (targetUser.bot) return await interaction.reply({ content: 'That user is a bot.', ephemeral: true });

        const { botData } = client as ExtendedClient;

        const embedData = botData.embeds.realtime.en;

        const guides: SelectMenuData[] = [];

        if (embedData.local) {
            guides.push(embedData.local);
        }

        if (embedData.online) {
            guides.push(embedData.online);
        }

        if (embedData.faq) {
            guides.push(embedData.faq);
        }

        interaction.reply({ content: `Suggestions for ${targetUser}`, embeds: createEmbeds(guides) });
    }
}

export default SendRealtimeGuides;