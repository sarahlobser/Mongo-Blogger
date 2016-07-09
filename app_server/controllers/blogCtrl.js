var ObjectId = require('mongodb').ObjectId;
var Mongo = require('mongodb').MongoClient;
var dbURL = 'mongodb://localhost:27017/blog';

module.exports.index = function(req, res) {
    Mongo.connect(dbURL, function(err, db){
        if(err) console.error(err);
        var posts = db.collection('posts');
        posts.find().sort({"date":-1}).toArray(function(err, docs){
            if(err) console.log(err);
            res.render('index', {posts: docs});
            db.close();
        });
    });
};

module.exports.show = function(req, res) {
    Mongo.connect(dbURL, function(err, db){
        if(err) console.error(err);
        var posts = db.collection('posts');
        posts.findOne({_id:ObjectId(req.params.id)}, function(err, doc){
            if(err) console.log(err);
            res.render('post', {post: doc});
            db.close();
        });
    });
};

module.exports.findByTag = function(req, res) {
    Mongo.connect(dbURL, function(err, db){
        if(err) console.error(err);
        var posts = db.collection('posts');
        posts.find({tags: {$elemMatch:{body:req.params.tag}}}).toArray(function(err, docs){
            if(err) console.log(err);
            console.log(docs);
            res.render('index', {posts: docs});
            db.close();
        });
    });
};

module.exports.new = function(req, res) {
    res.render('new');
}

module.exports.addPost = function(req, res) {
    var tags = req.body.tags.split(" ");
    var post = req.body;
    post.tags = [];
    if (req.body.tags !== "") {
        tags.forEach(function(tag){
            post.tags.push({body:tag});
        });
    }
    post.date = new Date();
    Mongo.connect(dbURL, function(err, db){
        var posts = db.collection('posts');
        posts.insert(post, function(err, result){
          if(err) console.log(err);
            posts.find().sort({"date":-1}).toArray(function(err, docs){
                if(err) console.log(err);
                res.render('index', {posts: docs});
                db.close();
            });
        });
    });
};

module.exports.addComment = function(req, res) {
    Mongo.connect(dbURL, function(err, db){
        if(err) console.error(err);
        var posts = db.collection('posts');
        posts.updateOne({_id:ObjectId(req.params.id)},
                     {$addToSet:{comments:{body:req.body.body,
                                      author:((req.body.author === "")? "Anonymous" : req.body.author),
                                      date:new Date()}}}, function(err, result){
            if(err) console.error(err);
            posts.findOne({_id:ObjectId(req.params.id)}, function(err, doc){
                if(err) console.log(err);
                res.render('post', {post: doc, message: "Comment Posted"});
                db.close();
            });
            
        });
    });
};

module.exports.deletePost = function(req, res) {
    Mongo.connect(dbURL, function(err, db){
        if(err) console.log(err);
        var posts = db.collection('posts');
        posts.remove({_id:ObjectId(req.params.id)}, function(err, result){
            if(err) console.log(err);
            posts.find().toArray(function(err, docs){
                if(err) console.log(err);
                res.render('index', {posts:docs, message: "post removed"});
            });
        });
    });
}

module.exports.deleteComment = function(req, res) {
    var body = req.params.body;
    var postId = req.params.id;
    Mongo.connect(dbURL, function(err, db){
        if(err) console.log(err);
        var posts = db.collection('posts');
        posts.update({_id:ObjectId(postId)}, {$pull:{comments:{"body":body}}}, function(err, result){
            if(err) console.log(err);
                posts.findOne({_id:ObjectId(postId)}, function(err, post){
                    if(err) console.log(err);
                    res.render('post', {post: post, message:"Comment removed!"});
                });
                
            });
    });
};