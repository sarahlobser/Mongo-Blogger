$(function(){
    $('#new_post').click(function(){
        $('#post').empty().hide();
        $('#posts').empty().hide();
        //$('#newPostDiv').load('new_post.html #new_post_div');
        $('#newPostDiv').show();
        
        var $newPostDiv = $('<div class="new_post" id="new_post_div">');
        var $postForm = $('<form id="post_form">');
        var $title = $('<input type="text" name="title" placeholder="Title" required>');
        var $body = $('<textarea name="body" rows="20" required>');
        var $tags = $('<input type="text" name="tags" placeholder="Tags">');
        var $author = $('<input type="text" name="author" placeholder="Anonymous">');
        var $button = $('<input id="new_post_button" class="form_button" type="submit" value="Post">');
        
        
        $postForm.append($title).append($body).append($tags).append($author).append($button);
        $newPostDiv.append($postForm);
        $('#newPostDiv').empty();
        $('#newPostDiv').append($newPostDiv);
        
        $('#new_post_button').click(function(event){
            console.log("in new post thing");
        event.preventDefault();
        var post = {};
        var $formValues = $('#post_form').serializeArray();
        $.each($formValues, function(){
            post[this.name] = this.value;
        });
            console.log(post);
        $.ajax({
            type: "POST",
            url: "api/posts",
            dataType: "json",
            data: post,
            success: createPostResult
        });
    });
    
    $('#addCom').click(function(event){
        event.preventDefault();
        //$('#comment_form').serializeArray();
        var comment = {};
        var $formValues = $('#comment_form').serializeArray();
        $.each($formValues, function(){
            comment[this.name] = this.value;
        });
        console.log(comment);
        $.ajax({
            type: "PUT",
            url: "api/posts/" + event.target.name + "/comments",
            data: comment,
            success: createCommentResult
        });
    });
        
        
        
    });
});

function createPostResult(result){
    loadSinglePost(result.insertedIds[0]);
    $('#message').text(result.insertedIds[0]);
};