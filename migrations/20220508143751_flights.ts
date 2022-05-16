import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('flights', (table: Knex.TableBuilder) => {
    table.increments('id');
    table.uuid('code');
    table.string('description');
    table.dateTime('departure_at');
    table.integer('seat_count');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('flights');
}
