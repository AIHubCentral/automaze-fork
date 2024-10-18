"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const botUtilities_1 = require("../../Utils/botUtilities");
const Tracker = {
    name: 'tracker',
    description: 'RVC real time tracker in spreadsheet',
    aliases: ['ss', 'spreadsheet'],
    async run(client, message) {
        const content = [
            {
                title: '📊 RVC Archive Tracker(outdated)',
                color: discord_js_1.Colors.Red,
                description: ['Massive spreadsheet with RVC models created by **kalomaze**.'],
            },
        ];
        const sender = new botUtilities_1.TagResponseSender(client);
        sender.setEmbeds(content);
        sender.setButtons([
            {
                label: 'View Spreadsheet',
                url: 'https://docs.google.com/spreadsheets/d/1tAUaQrEHYgRsm1Lvrnj14HFHDwJWl0Bd9x0QePewNco/edit#gid=0',
            },
        ]);
        sender.config(message);
        await sender.send();
    },
};
exports.default = Tracker;
