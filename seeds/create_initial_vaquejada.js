/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('vaquejadas').del()
  await knex('vaquejadas').insert([
    {
      nome: 'Copa CVARN Equino Vip De Vaquejada',
      nome_dono: 'Celestino',
      foto: 'image2.png',
      status: 'confirmado',
      descrição: `A Copa CVARN completará em 2024 seus 3 anos e com o intuito de celebrar esse momento!`
    }
  ]);
};
