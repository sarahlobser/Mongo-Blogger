var express = require('express');
var router = express.Router();
var controller = require('../controllers/main.js');

router.get('/posts', controller.index);
router.get('/posts/:id', controller.show);

router.get('/search/:tag', controller.findByTag);

router.post('/posts', controller.addPost);
router.post('/posts/:id/comments', controller.addComment);

router.delete('/posts/:id', controller.deletePost);
router.delete('/posts/:id/comments/:cid', controller.deleteComment);

router.post('/posts/:id/comments/:cid', controller.updateComment);
router.post('/posts/:id', controller.updatePost);

module.exports = router;