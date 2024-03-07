/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
     return knex.schema.createTable('senhas', function (table) {
          table.increments('id');
          table.integer('numero');
          table.decimal('preço', 10, 2);
          table.string('status');
          table.integer('categoria_id').notNullable().unsigned().references('categorias.id');
          table.integer('vaqueja_id').notNullable().unsigned().references('vaquejadas.id');
     });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
     return knex.schema.dropTable('senhas');
};
