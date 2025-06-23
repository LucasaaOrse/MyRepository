/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.table('appointments', function(table) {
    table.string('status').defaultTo('ativa'); // ativa ou cancelada
    table.timestamp('canceled_at').nullable();
    table.string('canceled_by').nullable(); // cliente | medico | admin
  });
};

exports.down = function(knex) {
  return knex.schema.table('appointments', function(table) {
    table.dropColumn('status');
    table.dropColumn('canceled_at');
    table.dropColumn('canceled_by');
  });
};
