const mongoose = require('mongoose');
const path = require('path');
const express = require('express');
const userController = require('../controllers/user');
const authenticate = require('../middleware/authenticate');
const router = express.Router();
const passport = require('passport');
const uid = require('uid2');
const Token = require('../models/token');

function generatetoken(number){
   return uid(number);
}


router.get('/cart', authenticate ,userController.getCart);

router.put('/cart/:id',authenticate,userController.addCart);

router.delete('/cart/delete/:id', authenticate ,userController.getdeletefromCart);

router.post('/checkout', authenticate ,userController.postCheckout);

router.post('/order', authenticate, userController.postOrder);

router.get('/order', authenticate, userController.getOrder);

module.exports = router;


