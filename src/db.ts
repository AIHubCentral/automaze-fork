import Knex from 'knex';
import knexConfig, { Environment } from './Database/knexfile';

const environment = (process.env.NODE_ENV || 'development') as Environment;
const config = knexConfig[environment];
const knexInstance = Knex(config);

export default knexInstance;
