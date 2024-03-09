var createError = require('http-errors');

var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var cookieSession = require('cookie-session');

var caminhosRouter = require('./routes/caminhos');
var usersRouter = require('./routes/users');
var operaçõesRouter = require('./routes/operações');

var express = require('express');
var app = express();

// usando o cookie-session
app.use(cookieSession({
  name: 'conectvaquejadas_session', // nome do cookie no navegador
  keys: ['chave_secreta_para_criptografia'], // chave necessária para criptografia
  maxAge: 1 * 60 * 60 * 1000, 
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ROTAS:

app.use('/', caminhosRouter);
app.use('/users', usersRouter);
app.use('/operations', operaçõesRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error'); 
});

module.exports = app;
