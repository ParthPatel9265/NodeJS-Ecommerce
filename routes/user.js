
const path = require('path');
const express = require('express');
const userController = require('../controllers/user');
const router = express.Router();
const passport = require('passport');

router.get('/login', userController.getLogin);

// router.post('/login', userController.postLogin);

router.post('/login',passport.authenticate('local', {
    successFlash: true,
    successRedirect:'/book',
    failureFlash: true,
    failureRedirect:'/user/login',
    
}));


router.get('/signup', userController.getSignup);

router.post('/signup', userController.postSignup);

router.get('/logout', userController.logOut);
module.exports = router;
