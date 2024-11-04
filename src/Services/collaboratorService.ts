import Knex from 'knex';
import BaseService from './BaseService';

export interface ICollaborator {
    id: string;
    username: string;
    displayName?: string;
}

export default class CollaboratorService extends BaseService<ICollaborator> {
    constructor(knex: Knex.Knex) {
        super(knex, 'collaborators');
    }
}
