var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Users = require('../models/users');

var userRouter = express.Router();

userRouter.use(bodyParser.json());


userRouter.route('/signup')
.post((req,res,next) => {
  Users.findOne({username : req.body.user})
  .then(user=>{
    if(user != null) {
      var err = new Error('User: '+ req.body.username + ' already exists!');
      err.status = 403;
      next(err);
    } else {
      Users.create({
        username: req.body.username,
        password: req.body.password
      })
      .then(user => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({status: 'Registration Successful!', user: user});
      },(err) => next(err))
    }
  },(err) => next(err))
  .catch(err =>{ next(err)});
});

userRouter.route('/login')
.post((req,res,next) => {
  if(!req.session.user) {
    if(!req.headers.authorization) {
      var err = new Error('You are not Authenticated!');
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      return next(err);
    }
    var auth = new Buffer.from(req.headers.authorization.split(' ')[1],'base64').toString().split(':');
    var userName = auth[0];
    var passWord = auth[1];
    Users.findOne({username : userName})
    .then((user)=>{
      if(user == null) {
        var err = new Error('User ' + userName + ' does not exist!');
        err.status = 403;
        return next(err);
      } else if(user.password != passWord) {
        var err = new Error('Password for User '+ userName + ' is Invalid!');
        err.status = 403;
        return next(err);
      } else {
        req.session.user = 'authenticated';
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('You are Authenticated!')
      }
    }, err => next(err))
    .catch((err) => next(err));
  } else {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('You are already authenticated!');
  }

});

userRouter.route('/logout')
.get((req,res,next) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});

module.exports = userRouter;
