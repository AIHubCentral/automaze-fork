"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seed = seed;
async function seed(knex) {
    // Deletes ALL existing entries
    await knex('settings').del();
    const initialSettings = {
        id: 'main_settings',
        theme: 'default',
        send_logs: false,
        send_automated_replies: false,
        add_reactions: true,
        delete_messages: true,
    };
    await knex('settings').insert(initialSettings);
}
