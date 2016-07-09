$(function(){
    $('#new_post_button').click(function(event){
        event.preventDefault();
        //$('#post_form').serializeArray();
        var post = {};
        var $formValues = $('#post_form').serializeArray();
        $.each($formValues, function(){
            post[this.name] = this.value;
        });
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

function createPostResult(result){
    loadSinglePost(result.insertedIds[0]);
    $('#message').text(result.insertedIds[0]);
};

//function createCommentResult(result){
//    console.log(result);
//    loadSinglePost(result.insertedIds[0]);
//    $('#message').text(result.insertedIds[0]);
//};