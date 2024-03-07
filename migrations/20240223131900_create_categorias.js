/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
     return knex.schema.createTable('categorias', function (table) {
          table.increments('id');
          table.integer('vaquejada_id').unsigned().references('vaquejadas.id');
          table.string('nome');
          table.integer('quantidade_de_senhas');
          table.integer('quantidade_por_cpf');
          table.decimal('preçoPadrão', 10, 2);
     });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
     return knex.schema.dropTable('categorias');
};
