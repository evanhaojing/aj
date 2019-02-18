function logout() {
    $.get("/api/logout", function(data){
        if (0 == data.errno) {
            location.href = "/";
        }
    })
}

$(document).ready(function(){
    $.ajax({
        url:'/user/user_info/',
        dataType:'json',
        type:'GET',
        success:function(data){
            console.log(data)
            $('#user-name').html(data.data.name)
            $('#user-mobile').html(data.data.phone)
            $('#user-avatar').attr('src', '/static/media/' + data.data.avatar)
        }
    });
    $('.menu-radius #logout').click(function(){
        $.ajax({
            url:'/user/logout/',
            dataType:'json',
            type:'GET',
            success:function(data){
                console.log(data)
                location.href = '/house/index/'
            }
        })
    })
})
