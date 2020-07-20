var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
const Dishes = require('./models/dishes');
const Promotions = require('./models/promotions');
const Leaders = require('./models/leaders');

const url = 'mongodb://localhost:27017/conFusion';
const connect = mongoose.connect(url);

connect.then((db)=>{
  console.log('connected successfully to MONGO DB');
})
.catch((err)=>{
  console.log(err);
})

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var leaderRouter= require('./routes/leaderRouter');
var promoRouter = require('./routes/promoRouter');

var app = express();

// function auth(req, res, next) {
//   console.log(req.headers);
//   if(!req.headers.authorization) {
//     var err = new Error('You are not Authenticated!');
//     res.setHeader('WWW-Authenticate', 'Basic');
//     err.status = 401;
//     next(err);
//     return;
//   }
//   var auth = new Buffer.from(req.headers.authorization.split(' ')[1],'base64').toString().split(':');
//   var userName = auth[0];
//   var passWord = auth[1];
//   if(userName == 'admin' && passWord == 'P@ssw0rd') {
//     next();
//   } else {
//     var err = new Error('You are not Authenticated!');
//     res.setHeader('WWW-Authenticate', 'Basic');
//     err.status = 401;
//     next(err);
//     return;
//   }
// }

// app.use(auth);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dishes', dishRouter);
app.use('/leaders', leaderRouter);
app.use('/promotions', promoRouter);

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