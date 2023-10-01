const { SlashCommandBuilder } = require("discord.js");
const { byValue, byNumber } = require('sort-es');
const fs = require('node:fs');
const wait = require('node:timers/promises').setTimeout;

const JSON_PATH = './data/bananaStats.json';

function saveBananaData(filepath, data) {
    /* Saves the /topbanana data as a json file and return whether the operation succeded or not */
    fs.writeFileSync(filepath, JSON.stringify(data), (error) => {
        console.log(error);
        return false;
    });
    return true;
}

module.exports = {
    category: `Fun`,
    type: `slash`, 
    data: new SlashCommandBuilder()
                .setName('banana_data')
                .setDescription('(RESTRICTED) Get /topbanana stats as a JSON file'),
    async execute(client, interaction) {
        // usable on dev server only
        const userId = interaction.user.id;
        const devServerGuildId = '1136971905354711193';
        const commandAllowed = (userId == '676731895647567882' || userId == '262608826467876864') && interaction.guildId == devServerGuildId;
        if (!commandAllowed) {
            return await interaction.reply({content:'You are not allowed to use this command.', ephemeral:true});
        }

        await interaction.deferReply({ephemeral:true});
        await wait(1000);

        const lbUnsorted = JSON.parse(interaction.client.banana.export()).keys;
        const lbSorted = lbUnsorted.sort(byValue(i => i.value, byNumber({ desc: true }))).slice(0, 10);

        const jsonData = [];

        for (const entry of lbSorted) {
            const entryVal = Object.values(entry);
            const user = await interaction.client.users.fetch(entryVal[0]);
            jsonData.push({userId:user.id, username:`${user.username}`, bananaCount:entryVal[1]});
        }

        const dataSaved = saveBananaData(JSON_PATH, jsonData);

        if (dataSaved) {
            await interaction.editReply({content:'JSON saved!', files:[JSON_PATH]});
        }
        else {
            await interaction.editReply('Failed to save JSON.');
        }
    }
}
