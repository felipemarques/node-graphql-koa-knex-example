import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('bookings', (table: Knex.TableBuilder) => {
    table.integer('flight_id').after('email');
    table
      .foreign('flight_id')
      .references('flights.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('bookings', (table: Knex.TableBuilder) => {
    table.dropForeign('flight_id');
    table.dropColumn('flight_id');
  });
}
