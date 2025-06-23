/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('doctor_specialties', function(table){
    table.increments('id').primary
    table.integer('doctor_id').unsigned().notNullable()
    .references('id').inTable('users').onDelete('CASCADE')
    table.integer('specialty_id').unsigned().notNullable()
    .references('id').inTable('specialties').onDelete('CASCADE')
    table.unique(['doctor_id', 'specialty_id'])
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('doctor_specialties')
};
