"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seed = seed;
async function seed(knex) {
    // Deletes ALL existing entries
    await knex('settings').del();
    // Inserts seed entries
    await knex('settings').insert([
        { debug_guild_id: '1234567890' },
        { debug_guild_channel_id: '0987654321' },
        { sendLogs: true },
        { send_automated_replies: false },
    ]);
}
