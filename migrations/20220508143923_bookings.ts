import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('bookings', (table: Knex.TableBuilder) => {
    table.increments('id');
    table.integer('seat_count');
    table.string('email');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('bookings');
}
