function showSuccessMsg() {
    $('.popup_con').fadeIn('fast', function() {
        setTimeout(function(){
            $('.popup_con').fadeOut('fast',function(){}); 
        },1000)

    });
}

function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}

$(document).ready(function(){
    $('#form-avatar').submit(function(e){
        e.preventDefault()
        $(this).ajaxSubmit({
            url:'/user/profile/',
            dataType:'json',
            type:'PATCH',
            success:function(data){
                if (data.code == 200){
                    alert(data.msg)
                    $('#user-avatar').attr('src', '/static/media/' + data.avatar)
                }
                if (data.code == 1011){
                    $('.error-ico').html(data.msg)
                    $('.error-ico').show()
                }
            }
        })
    })
    $('#form-name').submit(function(e){
        e.preventDefault()
        $(this).ajaxSubmit({
            url:'/user/profile/',
            dataType:'json',
            type:'PATCH',
            success:function(data){
                if(data.code == 1010){
                    alert(data.msg)
                }
                if(data.code == 1009){
                    $('.error-msg').html(data.msg)
                    $('.error-msg').show()
                }
                if(data.code == 1011){
                    $('.error-msg').html(data.msg)
                    $('.error-msg').show()
                }
            }
        })
    })
})
