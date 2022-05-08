import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('planets', (table: Knex.TableBuilder) => {
    table.increments('id');
    table.string('name');
    table.string('code');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('planets');
}
