const mongoose = require('mongoose');
const path = require('path');
const express = require('express');
const userController = require('../controllers/user');
const router = express.Router();
const passport = require('passport');
const Token = require('../models/Token');


router.get('/login', userController.getLogin);

// router.post('/login', userController.postLogin);

router.post('/login',passport.authenticate('local', {
  
    failureFlash: true,
    failureRedirect:'/user/login'})
    , function(req, res, next) {
   
      if (!req.body.remember_me) { 
          console.log("welcome");
          return next();
       }

     
      var token = "12345";
      var tk = new Token({  
        token: token,
        userId:req.user.id
      })
      tk.save(function(err) {
        if (err) { return done(err); }
        res.cookie('remember_me', token, { path: '/', httpOnly: true, maxAge: 604800000 }); // 7 days - remember me 
        return next();
      });
    },
    function(req, res) {
      res.redirect('/book');
    });
  
  

router.get('/signup', userController.getSignup);

router.post('/signup', userController.postSignup);

router.get('/logout', userController.logOut);
module.exports = router;


