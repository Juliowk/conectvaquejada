// ROTAS QUE RENDERIZAM PÁGINAS (PASSANDO OBJETOS CONTENDO DADOS DAS VAQUEJADAS QUANDO NECESSARIO)

var express = require('express');
var router = express.Router();

const requerAutenticacao = require('../middlewares/requerAutenticacao');

var knexConfig = require('../knexfile');
var knex = require('knex')(knexConfig);


// PAGINA INDEX;
router.get('/', (req, res, next) => {
  res.render('index');
});

// ROTA DE ERRO;
router.get('/erro', (req, res) => {
  const erro = req.query.erro;
  res.render('erro', { erro });
});

// PAGINA DAS VAQUEJADAS PASSANDO UM OBJETO QUE ARMAZENA TODAS AS VAQUEJADAS;
router.get('/vaquejadas', async (req, res) => {
  const vaquejadas = await knex.table('vaquejadas').select();

  let vaquejadasConfirmadas = [];
  vaquejadas.forEach((vaquejada) => {
    if (vaquejada.status === 'confirmado') {
      vaquejadasConfirmadas.push(vaquejada);
    }
  });

  res.render('vaquejadas', { vaquejadasConfirmadas });
});

// PAGIANA QUE FAZ A SOLICITAÇÃO PARA ADICIONAR UMA VAQUEJADA;
router.get('/adicionar-vaquejada', (req, res) => {
  res.render('adicionar-vaquejada');
});

// PAGINA DE DETALHES/COMPRA DA VAQUEJADA, PASSANDO O OBJETO DE UMA VAQUEJADA SELECIONADA PELO ID;
router.get('/vaquejada-selecionada', async (req, res) => {
  const vaquejada = await knex.table('vaquejadas').where('id', req.query.id).first();
  res.render('vaquejada-selecionada', { vaquejada });
});


// PAGINA QUE SELECIONA CATEGORIA E MOSTRA SENHAS DISPONIVEIS, PASSANDO VAQUEJADA SELECIONADA PELO ID;
router.get('/selecionar-categoria-senha', async (req, res) => {
  const vaquejada = await knex.table('vaquejadas').where('id', req.query.idVaquejada).first();
  const categorias = await knex.table('categorias').where('vaquejada_id', vaquejada.id);
  const senhas = await knex.select().from('senhas').where('vaqueja_id', vaquejada.id)

  let nomeCategorias = [];
  categorias.forEach(categoria => {
    let object = {}
    object['nome'] = categoria.nome;
    object['id'] = categoria.id
    nomeCategorias.push(object);
  });

  let idCategoria;
  if (req.query.idCategoria) idCategoria = req.query.idCategoria;

  let msgComprador;
  if (req.query.senhaExistente) { msgComprador = 'CPF já cadastrado, senha atualizada!' };

  for (let senha of senhas) {
    if (senha.status === 'CONFIRMADA') {
      const apelido = await knex.select('apelido').from('senhasporcomprador').where('idSenha', senha.id).first();
      senha.nomeComprador = apelido.apelido;
    }
  }

  res.render('selecionar-senha', { vaquejada, categorias, nomeCategorias, senhas, idCategoria, msgComprador });

});

// REDIRECIONA O PAINEL DE SENHAS DISPONIVEIS,PENDENTES OU RESERVADAS;
router.get('/renderizar-senhas', (req, res) => {
  const idVaquejada = req.query.idVaquejada;
  const idCategoria = req.query.idCategoria;
  res.redirect(`/selecionar-categoria-senha?idVaquejada=${idVaquejada}&idCategoria=${idCategoria}`);
});


// FORMULARIO DE COMPRA;
router.get('/cadastro-de-compra', async (req, res) => {
  const vaquejada = await knex.table('vaquejadas').where('id', req.query.idVaquejada).first();
  const senhas = await knex.table('senhas').where('id', req.query.senha);
  const categorias = await knex.table('categorias').where('id', senhas[0].categoria_id);

  const categoria = categorias[0]
  const senha = senhas[0];

  const erro = req.query.erro;

  res.render('cadastro', { vaquejada, senha, categoria, erro });
});

// LOGIN E ACESSO A ADMINITRADORES;

// PÁGINA DE ADMINISTRADORES;
router.get('/adm', [requerAutenticacao], (req, res) => {
  res.render('paginaAdm');
});

// PAGINA DE LOGIN;
router.get('/login', (req, res) => {
  let erroDeLogin;
  if (req.query.erroDeLogin) { erroDeLogin = req.query.erroDeLogin }
  res.render('login', { erroDeLogin });
});

// LOGADO COMO CLIENTE (MOSTRA TODAS AS SENHAS COMPRADAS PELO CLIENTE);
router.get('/loginVaqueiro/:idComprador', async (req, res) => {
  const idComprador = req.params.idComprador;
  const senhasDoComprador = await knex.select().from('senhasporcomprador').where('idComprador', idComprador);

  const comprador = await knex.select().from('compradores').where('id', idComprador).first();

  var idSenhas = [];
  senhasDoComprador.forEach((senhas) => { idSenhas.push(senhas.idSenha) });

  var senhas = [];
  for (let id of idSenhas) {
    let senha = await knex.select().from('senhas').where('id', id).first();

    let nomeDaCategoria = await knex.select('nome').from('categorias').where('id', senha.categoria_id).first();
    senha.categoria = nomeDaCategoria.nome;

    let nomeVaquejada = await knex.select('nome').from('vaquejadas').where('id', senha.vaqueja_id).first();
    senha.vaquejada = nomeVaquejada.nome;

    senhas.push(senha);
  };

  res.render('senhasdovaqueiro', { comprador, senhasDoComprador, senhas });
});

// ROTAS DE ADMINISTRADORES:

router.get('/vaquejadasParaAdms', async (req, res) => {
  const vaquejadas = await knex.table('vaquejadas').select();
  res.render('vaquejadasAdm', { vaquejadas });
});

router.get('/vaquejada-selecionada-adm', async (req, res) => {
  const vaquejadaId = req.query.id;
  const vaquejada = await knex.table('vaquejadas').where('id', vaquejadaId).first();
  res.render('vaquejada-selecionada-adm', { vaquejada });
});

// FORMULARIO QUE ADICIONA UMA VAQUEJADA NO BD (MUDAR PARA APENAS ADIMINSTRADORES);
router.get('/adicionar_vaquejada_no_bd', (req, res) => {
  const erro = req.query.erro;
  res.render('adicionar_vaquejada_bd', { erro });
});

// PAGINA QUE COMFIRMAMOS CADA SENHA DE CADA CATEGORIA DE UMA VAQUEJADA E PODEMOS FAZER ALTERAÇÕES EM SEUS VALORES;
router.get('/inputs-de-valores-das-senhas', async (req, res) => {
  const vaquejada_id = req.query.id;
  categorias = await knex.select().from('categorias').where('vaquejada_id', req.query.id);

  res.render('senhas_input_valores', { categorias, vaquejada_id });
});

// PAGINA DE CONFIMAR-SENHAS DE CADA VAQUEJADA;
router.get('/senhas_config/:idVaquejada', async (req, res) => {
  const vaquejadaId = req.params.idVaquejada;

  const categorias = await knex.table('categorias').where('vaquejada_id', vaquejadaId);
  const senhasReservadas = await knex.table('senhas').where('vaqueja_id', vaquejadaId).andWhere('status', 'RESERVADA');
  const senhasDisponiveis = await knex.table('senhas').where('vaqueja_id', vaquejadaId).andWhere('status', 'DISPONIVEL');
  const senhasConfirmadas = await knex.table('senhas').where('vaqueja_id', vaquejadaId).andWhere('status', 'CONFIRMADA');

  let erro;
  if (req.query.erro) { erro = req.query.erro };

  res.render('senhas', { senhasReservadas, senhasDisponiveis, senhasConfirmadas, categorias, vaquejadaId, erro });
});

// FORMUALARIO DE CONFIRMAÇÃO DE SENHA;
router.get('/confirmar_senha/:idSenha/:idVaquejada', async (req, res) => {
  const senha = await knex.select().from('senhas').where('id', req.params.idSenha).first();
  const nomeCategoria = await knex.select('nome').from('categorias').where('id', senha.categoria_id).first();
  const senhasporcomprador = await knex.select().from('senhasporcomprador').where('idSenha', senha.id).first()
  const comprador = await knex.select().from('compradores').where('id', senhasporcomprador.idComprador).first();

  const idVaquejada = req.params.idVaquejada;

  res.render('confirmar_senha', { senha, comprador, senhasporcomprador, nomeCategoria, idVaquejada });
});

// SAIR DA AREA DAS SENHAS;
router.get('/voltarDasSenhas/:idVaquejada', (req, res) => {
  const id = req.params.idVaquejada;
  res.redirect(`/vaquejada-selecionada-adm?id=${id}`);
});


// PÁGINA DE IMPRESSÃO DE TODAS AS SENHAS CONFIRMADA
router.get('/impressao/:idVaquejada', async (req, res) => {
  const idVaquejada = req.params.idVaquejada
  const nomeVaquejada = await knex.select('nome').from('vaquejadas').where('id', idVaquejada).first();
  const senhas = await knex.select('id', 'numero', 'status', 'categoria_id').from('senhas').where('vaqueja_id', idVaquejada);

  var senhasConfirmadas = [];
  var senhasReservadas = [];

  for (let senha of senhas) {

    senha.nomeVaquejada = nomeVaquejada.nome;

    const nomeCategoria = await knex.select('nome').from('categorias').where('id', senha.categoria_id).first();
    senha.nomeCategoria = nomeCategoria.nome;

    const dados = await knex.select().from('senhasporcomprador').where('idSenha', senha.id).first();

    if (dados) {
      senha.apelido = dados.apelido
      senha.cidade = dados.cidade
      senha.estado = dados.estado
      senha.cavaloPuxador = dados.cavalo_puxador
      senha.cavaloEsteira = dados.cavalo_esteira
      senha.esteira = dados.esteira
      senha.representacao = dados.representação

      const comprador = await knex.select('nome', 'cpf').from('compradores').where('id', dados.idComprador).first();

      senha.nomeComprador = comprador.nome
      senha.cpfComprador = comprador.cpf

      if (senha.status === 'CONFIRMADA') {
        senhasConfirmadas.push(senha);
      } else if (senha.status === 'RESERVADA') {
        senhasReservadas.push(senha);
      }

    } else {
      senha.apelido = ''
      senha.cidade = ''
      senha.estado = ''
      senha.cavaloPuxador = ''
      senha.cavaloEsteira = ''
      senha.esteira = ''
      senha.representacao = ''
      senha.nomeComprador = ''
      senha.cpfComprador = ''
    };

  }

  var senhasEnvio;
  if (!req.query.render) {
    senhasEnvio = senhas;
    res.render('impressão', { senhasEnvio, idVaquejada });
  } else if (req.query.render === 'sc') {
    senhasEnvio = senhasConfirmadas;
    res.render('impressão', { senhasEnvio, idVaquejada });
  } else if (req.query.render === 'sr') {
    senhasEnvio = senhasReservadas;
    res.render('impressão', { senhasEnvio, idVaquejada });
  }

});

module.exports = router;
