/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('doctor_schedules', function(table) {
    table.increments('id').primary();
    table.integer('doctor_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.integer('weekday').notNullable(); // 0 = domingo, 6 = sábado
    table.text('start_time').notNullable(); // formato: '08:00'
    table.text('end_time').notNullable();   // formato: '17:00'
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('doctor_schedules');
};