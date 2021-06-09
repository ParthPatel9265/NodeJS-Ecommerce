const mongoose = require('mongoose');
const path = require('path');
const express = require('express');
const userController = require('../controllers/user');
const authenticate = require('../middleware/authenticate');
const router = express.Router();
const passport = require('passport');
const uid = require('uid2');
const Token = require('../models/Token');
function generatetoken(number){
   return uid(number);
}

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

      let tokens = generatetoken(64)
      var tk = new Token({  
        token: tokens,
        userId:req.user.id
      });
      tk.save(function(err) {
        if (err) { return done(err); }
        console.log("hii hello");
        res.cookie('remember_me', tokens, { path:'/', httpOnly: true, maxAge: 604800000});
        return next();
      });
    },
    function(req, res) {
      res.redirect('/book');
    });
  
  

router.get('/signup', userController.getSignup);

router.post('/signup', userController.postSignup);

router.get('/logout', userController.logOut);

router.get('/dashboard', authenticate ,userController.getDashboard);

router.put('/cart/:id',authenticate,userController.addCart);

router.delete('/cart/delete/:id', authenticate ,userController.getdeletefromCart);

router.post('/checkout', authenticate ,userController.postCheckout);


module.exports = router;


