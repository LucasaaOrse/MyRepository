/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('passwordtokens', function(table) {
      table.increments('id').primary();
      table.text('token').notNullable();
      
      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
      
      table.boolean('used').notNullable().defaultTo(false);
      table.timestamp('created_at').defaultTo(knex.fn.now()); // útil pra saber a validade do token
    });
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = function(knex) {
    return knex.schema.dropTable('passwordtokens');
  };