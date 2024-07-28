"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const fetch = (...args) => Promise.resolve().then(() => __importStar(require('node-fetch'))).then(({ default: fetch }) => fetch(...args));
const fs = require('node:fs');
module.exports = {
    category: 'Utilities',
    data: new SlashCommandBuilder()
        .setName('embed_data')
        .setDescription('Manages embed data for tag commands')
        .addSubcommand(subcommand => subcommand
        .setName('upload')
        .setDescription('Uploads the JSON data')
        .addAttachmentOption(option => option
        .setName('file')
        .setDescription('The JSON file containing the embed data')
        .setRequired(true)))
        .addSubcommand(subcommand => subcommand
        .setName('download')
        .setDescription('Downloads the embed data as a JSON file')),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const client = interaction.client;
        if (interaction.options.getSubcommand() === 'upload') {
            const file = interaction.options.getAttachment('file');
            if (file.contentType.includes('application/json')) {
                try {
                    const response = await fetch(file.url);
                    if (response.ok) {
                        const data = await response.json();
                        client.botData.embeds = data;
                        await interaction.editReply({ content: 'Embed data updated!' });
                    }
                    else {
                        await interaction.editReply({ content: 'Failed to fetch JSON' });
                    }
                }
                catch (error) {
                    await interaction.editReply({ content: `Invalid JSON:\n> ${error.message}` });
                }
            }
            else {
                await interaction.editReply({ content: 'Not a JSON file' });
            }
        }
        else if (interaction.options.getSubcommand() === 'download') {
            const data = JSON.stringify(client.botData.embeds);
            const buffer = Buffer.from(data, 'utf-8');
            const attachment = new AttachmentBuilder(buffer, { name: 'embeds.json' });
            await interaction.editReply({ files: [attachment] });
        }
    }
};
