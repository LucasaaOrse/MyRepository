/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('appointments', function(table){
    table.increments('id').primary()
    table.integer('doctor_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
    table.integer('client_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
    table.date('date').notNullable()
    table.time('time').notNullable()
    table.unique(['doctor_id', 'date', 'time'])
    table.timestamps(true, true)

  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('appointments')
};
