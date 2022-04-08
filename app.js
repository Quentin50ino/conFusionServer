var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var FileStore = require('session-file-store')(session)
var passport = require('passport')
var authenticate = require('./authenticate')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var promotionsRouter = require('./routes/promotionsRouter');
var leadersRouter = require('./routes/leadersRouter');

const mongoose = require('mongoose')
const Dishes = require('./models/dishes')

const url = 'mongodb://localhost:27017/conFusion'
const connect = mongoose.connect(url)

connect.then((db) => {
  console.log('Connected correctly to the server')
}, (err) => {
  console.log(err)
})

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser('12345-67890-09876-54321')); //passo una chiave segreta al cookie parser
app.use(session({
  name : 'session-id',
  secret : '12345-67890',
  saveUninitialized: false,
  resave : false,
  store : new FileStore()
}))
app.use(passport.initialize())
app.use(passport.session())
app.use('/', indexRouter);
app.use('/users', usersRouter);
function auth(req, res, next) {
  console.log(req.session)

  if(!req.user){
    /*var authHeader = req.headers.authorization
    if(!authHeader){
      var err = new Error('You are not authenticated!')
      res.setHeader('WWW-Authenticate', 'Basic')
      err.status = 401
      return next(err)
    }
    else {
      //divido l'auth in 2 e prendo la parte dopo lo spazio, poi la divido in due con i : (perchè per standard è così scritta nell'auth username:password)
      var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
      var username = auth[0]
      var password = auth[1]
      if(username === 'admin' && 'password'){
        //se l'autenticazione ha successo, allora setto il cookie
        //res.cookie('user', 'admin', {signed : true})
        req.session.user = 'admin'
        next()
      }
      else{
        var err = new Error('You are not authenticated!')
        res.setHeader('WWW-Authenticate', 'Basic')
        err.status = 401
        return next(err)
      }
    }*/
    var err = new Error('You are not authenticated')
    err.status = 401
    return next(err)
  }
  else{
    //caso in cui il cookie è stato precedentemente settato e quindi esiste
   // if(req.session.user === 'authenticated'){
      next()
    /*}
    else{
      var err = new Error('You are not authenticated!')
      //res.setHeader('WWW-Authenticate', 'Basic')
      err.status = 401
      return next(err)
    }*/
  }
}
  
//se fallisce l'autenticazione si ferma tutta l'esecuzione del programma in questo punto
//in questo modo non posso accedere a nessun route se non sono autenticato
app.use(auth);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/dishes', dishRouter);
app.use('/promotions', promotionsRouter);
app.use('/leaders', leadersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
