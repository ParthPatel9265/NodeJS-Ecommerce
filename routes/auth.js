const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const passport = require('passport');
const uid = require('uid2');
const Token = require('../models/token');
const authController = require('../controllers/auth');

function generatetoken(number){
   return uid(number);
}
router.get('/login', authController.getLogin);

router.post('/login',passport.authenticate('local', {
  
    failureFlash: true,
    failureRedirect:'/login'})
    , function(req, res, next) {
   
      if (!req.body.remember_me) { 
          return next();
       }

      let tokens = generatetoken(64)
      var tk = new Token({  
        token: tokens,
        userId:req.user.id
      });
      tk.save(function(err) {
        if (err) { return done(err); }
        res.cookie('remember_me', tokens, { path:'/', httpOnly: true, maxAge: 604800000});
        return next();
      });
    },
    function(req, res) {
      res.redirect('/book');
    });
  
router.get('/signup', authController.getSignup);

router.post('/signup', authController.postSignup);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

router.get('/logout', authController.logOut);

module.exports = router;