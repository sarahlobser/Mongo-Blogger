$(function(){
$('#home').click(function(event){
                loadAllPosts();
            });
});

// Sends ajax request to retrieve a single post
var loadSinglePost = function(id){
    $.ajax({
        type: "GET",
        url: "api/posts/" + id,
        dataType:"json",
        success: loadpost
    })
    .fail(function(){
        console.log('Could not load this post');
    });
};

// Loads a single post to the page
function loadpost(data){
    console.log(data);
        $('#post').empty();
        var postDiv = $('<div class="post">');
        var title = $('<h3>' + data.title + '</h3>');
            postDiv.append(title);
        var author = $('<h4>' + data.author + '</h4>');
            postDiv.append(author);
        var body = $('<p>' + data.body + '</p>');
            postDiv.append(body);
        
            
        // Display tags    
            
        if(data.tags[0].body.length > 0) {
        data.tags.forEach(function(elem, index){
           var tag = $('<span class="tag">' + elem.body + '</span>');
            tag.click(function(event){
                loadPostsByTag(elem.body);
            });
            postDiv.append(tag);
        });
        };
    
        // Display new comment form
    
        var $newCommentDiv = $('<div class="new_comment">');
        var $commentForm = $('<form id="comment_form">');
        var $bodyArea = $('<textarea id="bodyArea" name="body" rows="5" required>');
        var $authorField = $('<input id="authorField" type="text" name="author" placeholder="Anonymous">');
        var $commentButton = $('<input id="addCom" name="' + data._id + '" type="submit" value="Post" class="form_button">');
        $commentForm.append($bodyArea).append($authorField).append($commentButton);
        $newCommentDiv.append($commentForm);
        postDiv.append($newCommentDiv);
    
        // Add event listener to post comment button
    
        $commentButton.click(function(event){
            event.preventDefault();
            //$('#comment_form').serializeArray();
            var comment = {};
            var $formValues = $('#comment_form').serializeArray();
            $.each($formValues, function(){
                comment[this.name] = this.value;
            });
            
            function addComment(){
            $.ajax({
                type: "POST",
                url: "api/posts/" + data._id + "/comments",
                data: comment,
                success: loadSinglePost(data._id)
            });
            }
            $.when(addComment()).done(loadSinglePost(data._id));
        });

    
        // Display comments
    
        if(data.comments){
        data.comments.forEach(function(elem, index){
            elem.index = index;
           var comment = $('<div class="comment" id=' + index + '>');
             comment.append('<p>' + elem.body + '</p>');
             comment.append('<p>' + elem.author + " " + elem.date + '</p>');
            
            // Add Buttons To The Comment
        
            var $commentButtonDiv = $('<div class="comment_button">');
            var $editCommentButton = $('<button>Edit</button>');
            var $deleteCommentButton = $('<button>Delete</button>');
            $commentButtonDiv.append($editCommentButton).append($deleteCommentButton);
            comment.append($commentButtonDiv);
        
            // Delete Button Event Listener
        
            $deleteCommentButton.click(function(event){
                var response = confirm('Are you sure you want to delete this comment?');
                if(response){
                    console.log("/api/posts/" + data._id + "/comments/" + elem._id);
                
                function deleteComment(){
                $.ajax({
                    type:"DELETE",
                    url:"/api/posts/" + data._id + "/comments/" + elem._id,
                    dataType: "json",
                    success: loadSinglePost(data._id)
                })
                .fail(function(){
                    console.log('It blew up');
                });
                };
                
                $.when(deleteComment()).done(loadSinglePost(data._id));
                }
            });
            
            // Edit Button Event Listener
            
            $editCommentButton.click(function(event){
                
                // Insert update comment form into comment div
                
                var $updateCommentDiv = $('<div class="new_comment">');
                var $updateCommentForm = $('<form id="update_comment_form">');
                var $updateBodyArea = $('<textarea id="bodyArea" name="body" rows="5"                     required>');
                var $updateAuthorField = $('<input id="authorField" type="text" name="author"             placeholder="Anonymous">');
                var $updateCommentButton = $('<input id="updateCom" name="' + data._id + '"               type="submit" value="Update" class="form_button">');
                $updateCommentForm.append($updateBodyArea).append($updateAuthorField).append($updateCommentButton);
                $updateCommentDiv.append($updateCommentForm);
                
                // Add event listener to update comment button
                
                $updateCommentButton.click(function(event){
                    event.preventDefault();
                    var comment = {};
                    var $commentFormValues = $('#update_comment_form').serializeArray();
                        $.each($commentFormValues, function(){
                            comment[this.name] = this.value;
                        });
                    
                    console.log("/api/posts/" + data._id + "/comments/" + elem._id);
                    //updateComment();
                    function updateComment() {
                        console.log("/api/posts/" + data._id + "/comments/" + elem.body);
                        $.ajax({
                        type:"POST",
                        url:"/api/posts/" + data._id + "/comments/" + elem._id,
                        data: comment,
                        success: console.log("it worked")//loadSinglePost(data._id)
                    })
                    .fail(function(){
                        console.log('Could not edit comment');
                    });
                    };
                    
                    $.when(updateComment()).done(loadSinglePost(data._id));
                });
                
            $('#'+ elem.index).empty();
            $('#'+ elem.index).append($updateCommentDiv);
            $updateBodyArea.text(elem.body);
            $updateAuthorField.text(elem.author);
            
            
            }); // end of edit comment button event listener
            
            postDiv.append(comment);
        });
        };
        $('#post').append(postDiv);
        $('#post').show();
        $('#posts').hide();
        $('#newPostDiv').hide();
}; // END OF LOAD SINGLE POST
    
    

// Sends ajax request to retrieve all posts
var loadAllPosts = function(){
    $.ajax({
    type: "GET",
    url: "/api/posts",
    dataType: "json",
    success: loadposts
    })
    .fail(function(){
        console.log('It blew up');
    });
};

// Loads all post stubs to the page
function loadposts(data){
    $('#posts').empty();
    $('#post').hide();
    $('#newPostDiv').hide();
    $('#posts').show();
    //var $ul = $('<ul id="post_list">');
    data.forEach(function(elem, index){
        elem.index = index;
        var postDiv = $('<div class="post_stub" id="'+index+'">');
        var title = $('<h3>' + elem.title + '</h3>');
            postDiv.append(title);
        var author = $('<h4>' + elem.author + '</h4>');
            postDiv.append(author);
        var date = $('<h4>' + elem.date + '</h4>');
            postDiv.append(date);
        var id = $('<h5>' + elem._id + '</h5>');
            postDiv.append(id);
        
        
        // Display tags
        
        if(elem.tags[0].body.length > 0) {
        elem.tags.forEach(function(t, index){
           var tag = $('<span class="tag">' + t.body + '</span>');
            tag.click(function(event){
                loadPostsByTag(t.body);
            });
            postDiv.append(tag);
        });
        };
        
        // Add Buttons
        
        var $buttonDiv = $('<div class="post_button">');
        var $editButton = $('<button>Edit</button>');
        var $deleteButton = $('<button>Delete</button>');
        $buttonDiv.append($editButton).append($deleteButton);
        postDiv.append($buttonDiv);
        
        // Delete Button Event Listener
        
        $deleteButton.click(function(event){
            var response = confirm('Are you sure you want to delete this post?');
            if(response){
            $.ajax({
                type:"DELETE",
                url:"/api/posts/" + elem._id,
                dataType:"json",
                success: loadAllPosts
            })
            .fail(function(){
                console.log('It blew up');
            });
            }
        });
        
        // Edit Button Event Listener
        
        $editButton.click(function(event){
            var $newPostDiv = $('<div class="new_post" id="new_post_div">');
            var $postForm = $('<form id="post_form">');
            var $title = $('<input type="text" name="title" placeholder="Title" required>');
            var $body = $('<textarea name="body" rows="20" required>');
            var $tags = $('<input type="text" name="tags" placeholder="Tags">');
            var $author = $('<input type="text" name="author" placeholder="Anonymous">');
            var $updatePostButton = $('<input id="update_post_button" class="form_button" type="submit" value="Post">');
            
            
        
            $postForm.append($title).append($body).append($tags).append($author).append($updatePostButton);
            $newPostDiv.append($postForm);
            
            $('#'+elem.index).empty();
            $('#'+elem.index).append($newPostDiv);
            
            
            
            
            $updatePostButton.click(function(event){
            console.log("in update post thing");
            event.preventDefault();
            //$('#post_form').serializeArray();
            var post = {};
            var $formValues = $('#post_form').serializeArray();
            $.each($formValues, function(){
                post[this.name] = this.value;
            });
            console.log(post);
                function editPost() {
                $.ajax({
                    type: "POST",
                    url: "api/posts/" + elem._id,
                    dataType: "json",
                    data: post,
                    success: loadSinglePost(elem._id)
                });
                };
                
                $.when(editPost()).done(loadSinglePost(elem._id));
            });
            
            $title.val(elem.title);
            $body.text(elem.body);
            $author.val(elem.author);
            $tags.val(elem.tags[0].body);
            
            
        });
        
        
        
        
        $('#posts').append(postDiv);
        title.click(function(event){
            loadSinglePost(elem._id);
        });
    });
};

// Sends an ajax call to retrieve all posts with a given tag
var loadPostsByTag = function(body){
    $.ajax({
        type: "GET",
        url: "/api/search/" + body,
        dataType: "json",
        success: loadposts
    })
    .fail(function(){
        console.log('It blew up');
    });
};

// Once a comment is added, the post will be displayed.
function createCommentResult(result){
    console.log(result);
    //loadSinglePost(id);
    $('#message').text(result);
};