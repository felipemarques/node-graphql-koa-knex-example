import { Knex } from 'knex';

const planets = require('../planets.json');

export async function seed(knex: Knex): Promise<void> {
  await knex('planets').del();
  await knex('planets').insert(planets);
}
