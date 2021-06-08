//admin - authorization
//user - authentication
const express = require('express');
const router = express.Router();

const authorization = require('../middleware/authorization');
const bookController = require('../controllers/book');

router.get('/' , bookController.getBooks);

router.get('/add',authorization,bookController.getAdd);

router.post('/add',authorization,bookController.postAdd);

router.get('/edit/:id',authorization ,bookController.getEdit);

router.post('/edit/:id',authorization ,bookController.postEdit);

router.delete('/delete/:id', authorization ,bookController.delete);

router.get('/bookdetails/:id' ,bookController.getBookDetails);

module.exports = router;
