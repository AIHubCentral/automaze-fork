import Knex from 'knex';
import BaseService from './BaseService';

export interface ISettings {
    id: string;
    theme: string;
    send_logs: boolean;
    send_automated_replies: boolean;
    add_reactions: boolean;
    delete_messages: boolean;
    debug_guild_id?: string;
    debug_guild_channel_id?: string;
}

export default class SettingsService extends BaseService<ISettings> {
    constructor(knex: Knex.Knex) {
        super(knex, 'settings');
    }
}
