function showSuccessMsg() {
    $('.popup_con').fadeIn('fast', function() {
        setTimeout(function(){
            $('.popup_con').fadeOut('fast',function(){}); 
        },1000) 
    });
}

$(document).ready(function(){
    $.ajax({
        url:'/user/auth_info/',
        dataType:'json',
        type:'GET',
        success:function(data){
            if (data.code == 200){
                console.log(data)
                $('#real-name').attr('placeholder', data.data.id_name)
                $("#real-name").attr('disabled','disabled')
                $('#id-card').attr('placeholder', data.data.id_card)
                $("#id-card").attr('disabled','disabled')
                $('.btn-success').hide()
            }
        }
    })

    $('#form-auth').submit(function(e){
        e.preventDefault()
        $(this).ajaxSubmit({
            url:'/user/auth/',
            dataType:'json',
            type:'PATCH',
            success:function(data){
                if (data.code == 200){
                    alert(data.msg)
                    $('#real-name').attr('placeholder', data.data.id_name)
                    $("#real-name").attr('disabled','disabled')
                    $('#id-card').attr('placeholder', data.data.id_card)
                    $("#id-card").attr('disabled','disabled')
                    $('.btn-success').hide()
                }
                if (data.code == 1001){
                    $('.error-msg').html(data.msg)
                    $('.error-msg').show()
                }
                if (data.code == 1002){
                    $('.error-msg').html(data.msg)
                    $('.error-msg').show()
                }
                if (data.code == 1003){
                    $('.error-msg').html(data.msg)
                    $('.error-msg').show()
                }
                if (data.code == 1004){
                    $('.error-msg').html(data.msg)
                    $('.error-msg').show()
                }
            }
        })
    })
})
