/**
 * Cache models to be consulted later when a user requests a new model
 * The purpose is to check if a model they are requesting already exists
 */

import Knex from 'knex';
import BaseService from './BaseService';

export interface IModelThread {
    /** Thread channel id */
    id: string;

    /** Parent channel id */
    parent_id: string;

    /** Thread author id */
    author_id: string;

    /** The title of the thread */
    title: string;

    /** If the model is being requested on request-models channel */
    is_request: boolean;

    /** The thread starter message */
    description: string;
}

export default class ModelService extends BaseService<IModelThread> {
    constructor(knex: Knex.Knex) {
        super(knex, 'models');
    }
}

export interface WeightsModel {
    id: string;
    url: string;
    image_url: string;
    title: string;
    description: string;
}

export class WeightsModelService extends BaseService<WeightsModel> {
    constructor(knex: Knex.Knex) {
        super(knex, 'weights_models');
    }

    async create(data: Partial<WeightsModel>): Promise<string | number> {
        if (!data.url) {
            data.url = `https://www.weights.gg/models/${data.id}`;
        }
        return super.create(data);
    }
}
