import Knex from 'knex';
import BaseService from './BaseService';

export interface UserDTO {
    id: string;
    username: string;
    display_name: string;
    bananas?: number;
}

export default class UserService extends BaseService<UserDTO> {
    constructor(knex: Knex.Knex) {
        super(knex, 'users');
    }
}
