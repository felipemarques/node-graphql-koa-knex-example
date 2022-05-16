import { Knex, knex } from 'knex'
import config from './../knexfile';

const env = process.env.NODE_ENV || 'development';
const database = knex(config[env]);

export * from 'knex'
export default database
