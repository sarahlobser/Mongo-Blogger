var express = require('express');
var router = express.Router();
var blogCtrl = require('../controllers/blogCtrl.js');

router.get('/posts', blogCtrl.index);
router.get('/posts/:id', blogCtrl.show);
router.get('/new', blogCtrl.new);
router.get('/search/:tag', blogCtrl.findByTag);

router.post('/posts', blogCtrl.addPost);
router.post('/comments/:id', blogCtrl.addComment);

router.get('/remove/:id', blogCtrl.deletePost);
router.get('/removeComment/:id/:body', blogCtrl.deleteComment);

module.exports = router;