const knexConfig = require('../knexfile');
const knex = require('knex')(knexConfig);

module.exports = async (req, res, next) => {
     // res.redirect('/login');
     if (!req.session || !req.session.logged_as) { return res.redirect('/login') };

     const idAdmLogado = req.session.logged_as;
     const administrador = await knex.select().from('administradores').where('id', idAdmLogado).first();

     res.locals.administrador = administrador;
     next();

}