/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
     return knex.schema.createTable('administradores', function (table) {
          table.increments('id');
          table.string('cpf').notNullable();
          table.string('senha').notNullable();
     });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
     return knex.schema.dropTable('administradores');
};
