var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Users = require('../models/users');
const passport = require('passport');
var{ getToken } = require('../authenticate');

var userRouter = express.Router();

userRouter.use(bodyParser.json());


userRouter.route('/signup')
.post((req,res,next) => {
  Users.register(new Users({username : req.body.username}),
  req.body.password, (err,user) =>{
    if(err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json(err);
    } else {
      passport.authenticate('local')(req,res,()=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({status: 'Registration Successful!', success: true});
      }) 
    }
  })
});

userRouter.route('/login')
.post(passport.authenticate('local'),(req,res) => {
  var token = getToken({_id: req.user._id});
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({status: 'Tou are successfully logged In!', success: true, 
  token: token});
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
