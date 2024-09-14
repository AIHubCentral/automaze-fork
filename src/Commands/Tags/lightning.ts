import { ColorResolvable } from "discord.js";
import { EmbedData } from "../../Interfaces/BotData";
import { PrefixCommand } from "../../Interfaces/Command";
import { getResourceData, resourcesToUnorderedList, TagResponseSender } from "../../Utils/botUtilities";

const Lightning: PrefixCommand = {
    name: 'light',
    category: 'Tags',
    description: 'Links to relevant lightning.ai stuff!',
    aliases: ['lightning', 'lightningai'],
    syntax: 'lightning [member]',
    async run(client, message) {
        const { botCache, logger } = client;

        const resources = await getResourceData("lightning_ai", botCache, logger);

        if (resources.length === 0) {
            await message.reply({ content: "⚡" });
            return;
        }

        let content: EmbedData[] = [{
            title: "⚡ Lightning AI",
            color: "b45aff" as ColorResolvable,
            description: [resourcesToUnorderedList(resources)],
            footer: "More commands: -colabs, -kaggle, -hf, -realtime, -rvc, -help"
        }];

        const sender = new TagResponseSender(client);
        sender.setEmbeds(content);
        sender.config(message);
        await sender.send();
    },
};

export default Lightning;