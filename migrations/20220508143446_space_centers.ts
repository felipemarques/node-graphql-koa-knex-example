import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(
    'space_centers',
    (table: Knex.TableBuilder) => {
      table.increments('id');
      table.uuid('uid');
      table.string('name');
      table.string('description');
      table.float('latitude');
      table.float('longitude');
    },
  );
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('space_centers');
}
