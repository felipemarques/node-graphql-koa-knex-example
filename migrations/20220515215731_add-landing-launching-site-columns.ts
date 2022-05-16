import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('flights', (table: Knex.TableBuilder) => {
    table.integer('launchsite_id').after('seat_count');
    table.integer('landingsite_id').after('seat_count');

    table
      .foreign('launchsite_id')
      .references('space_centers.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');

    table
      .foreign('landingsite_id')
      .references('space_centers.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('flights', (table: Knex.TableBuilder) => {
    table.dropForeign('launchsite_id');
    table.dropForeign('landingsite_id');

    table.dropColumn('launchsite_id');
    table.dropColumn('landingsite_id');
  });
}
