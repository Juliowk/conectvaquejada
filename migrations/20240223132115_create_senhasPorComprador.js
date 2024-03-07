/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
     return knex.schema.createTable('senhasPorComprador', function (table) {
          table.increments('id');
          table.integer('idComprador').notNullable().unsigned().references('compradores.id');
          table.integer('idSenha').notNullable().unsigned().references('senhas.id');
          table.string('apelido');
          table.string('cidade');
          table.string('estado');
          table.string('cavalo_puxador');
          table.string('cavalo_esteira');
          table.string('esteira')
          table.string('representação');
     })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('senhasPorComprador');
};