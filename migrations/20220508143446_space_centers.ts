import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(
    'space_centers',
    (table: Knex.TableBuilder) => {
      table.increments('id');
      table.uuid('uid');
      table.string('name');
      table.text('description');
      table.float('latitude');
      table.float('longitude');
      table.string('planet_code')
      table.foreign('planet_code')
        .references('planets.code')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      table.primary(['id'])
    },
  );
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('space_centers');
}
