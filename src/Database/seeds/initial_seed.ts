import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex('settings').del();

    // Inserts seed entries
    await knex('settings').insert([
        { debug_guild_id: '1234567890' },
        { debug_guild_channel_id: '0987654321' },
        { send_logs: true },
        { send_automated_replies: false },
    ]);
}
