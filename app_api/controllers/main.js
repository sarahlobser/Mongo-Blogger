var ObjectId = require('mongodb').ObjectId;
var Mongo = require('mongodb').MongoClient;
var dbURL = 'mongodb://localhost:27017/blog';

module.exports.index = function(req, res) {
    Mongo.connect(dbURL, function(err, db){
        if(err) console.error(err);
        var posts = db.collection('posts');
        posts.find().sort({"date":-1}).toArray(function(err, docs){
            if(err) console.log(err);
            res.json(docs);
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
            res.json(doc);
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
            res.json(docs);
            db.close();
        });
    });
};

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
            res.json(result);
        });
    });
};

module.exports.addComment = function(req, res) {
    console.log("in add comment");
    Mongo.connect(dbURL, function(err, db){
        if(err) console.error(err);
        var posts = db.collection('posts');
        posts.updateOne({_id:ObjectId(req.params.id)},
                     {$addToSet:{comments:{_id:new ObjectId(),
                              body:req.body.body,
                              author:((req.body.author === "")? "Anonymous" : req.body.author),
                              date:new Date()}}}, function(err, result){
            if(err) console.error(err);
            res.json(result);
        });
    });
};

module.exports.deletePost = function(req, res) {
    Mongo.connect(dbURL, function(err, db){
        if(err) console.log(err);
        var posts = db.collection('posts');
        posts.remove({_id:ObjectId(req.params.id)}, function(err, result){
            if(err) console.log(err);
            res.json(result);
        });
    });
}

module.exports.deleteComment = function(req, res) {
    var commentId = req.params.cid;
    var postId = req.params.id;
    Mongo.connect(dbURL, function(err, db){
        if(err) console.log(err);
        var posts = db.collection('posts');
        posts.update({_id:ObjectId(postId)}, {$pull:{comments:{_id:ObjectId(commentId)}}}, function(err, result){
            if(err) console.log(err);
            res.json(result);
        });
    });
};

module.exports.updatePost = function(req, res) {
    var postId = req.params.id;
    Mongo.connect(dbURL, function(err, db){
        if(err) console.log(err);
        var posts = db.collection('posts');
        posts.updateOne({_id:ObjectId(postId)}, 
            {$set:{"body":req.body.body, "title":req.body.title,
                  "author":req.body.author}}, function(err, result){
            if(err) console.log(err);
            res.json(result);

        });
    });
};

module.exports.updateComment = function(req, res) {
    var commentId = req.params.cid;
    var postId = req.params.id;
    Mongo.connect(dbURL, function(err, db){
        if(err) console.log(err);
        var posts = db.collection('posts');
        posts.updateOne({_id:ObjectId(postId), "comments._id":ObjectId(commentId)}, {$set:
            {"comments.$.body":req.body.body}}, function(err, result){
            if(err) console.log(err);
            res.json(result);

        });
    });
};