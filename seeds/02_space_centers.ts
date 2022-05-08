import { Knex } from 'knex';

const space_centers = require('../space-centers.json');

export async function seed(knex: Knex): Promise<void> {
  await knex('space_centers').del();
  await knex('space_centers').insert(space_centers);
}
