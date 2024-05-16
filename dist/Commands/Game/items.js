"use strict";
const { EmbedBuilder } = require('discord.js');
module.exports = {
    name: 'items',
    category: 'Game',
    description: 'Show your owned items',
    aliases: ['item', 'inv', 'inventory'],
    syntax: `items [member]`,
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
     * @param {String} prefix
     */
    run: async (client, message, args, prefix) => {
        let description = [];
        const member = message.mentions.members.first() || message.member;
        // show bananas in inventory
        const inventory = await client.knexInstance('inventory').where({
            'user_id': member.user.id,
            'item_id': 1
        });
        if (inventory.length === 1) {
            let item = inventory[0];
            let itemQuantity = item.quantity;
            let itemDisplay = '- **Banana**: ' + item.quantity;
            if (itemQuantity > 1) {
                itemDisplay = itemDisplay.replace('Banana', 'Bananas');
            }
            description.push(itemDisplay);
        }
        if (inventory.length === 0 && (!client.items.has(member.user.id) || !Object.values(client.items.get(member.user.id)).filter(entry => entry.value).length)) {
            description.push(`Nothing to see here :(`);
        }
        else {
            //description.push(Object.values(client.items.get(member.user.id)).filter(entry => entry.value).map(entry => `**‣ ${entry.name}**: ${entry.value}`).join(`\n`));
        }
        const embed = new EmbedBuilder()
            .setAuthor({ name: member.user.username, iconURL: member.user.avatarURL() })
            .setDescription(`## Items\n${description.join(`\n`)}`)
            .setColor(client.botConfigs.colors.theme.primary);
        message.reply({ embeds: [embed] });
    }
};
