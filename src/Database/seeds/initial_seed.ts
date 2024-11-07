import { Knex } from 'knex';
import { ISettings } from '../../Services/settingsService';

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex('settings').del();

    const initialSettings: ISettings = {
        id: 'main_settings',
        theme: 'default',
        send_logs: false,
        send_automated_replies: false,
        add_reactions: true,
        delete_messages: true,
    };
    await knex('settings').insert(initialSettings);
}
