/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
*/

const bcrypt = require('bcrypt');

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('administradores').del()
  await knex('administradores').insert([
    { cpf: '710.274.994-57', senha: bcrypt.hashSync('eusoueu.', 10) },
    { cpf: '09475625440', senha: bcrypt.hashSync('123456', 10) }
  ]);
};
