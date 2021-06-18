const express = require('express');
const router = express.Router({ mergeParams: true });


const authorization = require('../middleware/authorization');
const authenticate = require('../middleware/authenticate');
const commentController = require('../controllers/comment');

router.get('/add', authenticate, commentController.getComment);

router.post('/add', authenticate, commentController.postComment);

router.get('/:cid/edit', commentController.getEdit);

router.put('/:cid/edit',  commentController.putEdit);

router.delete('/:cid/delete', commentController.delete);

module.exports = router;