$(document).ready(function(){
    $(".auth-warn").show();
    $.ajax({
        url:'/house/my_house/',
        dataType:'json',
        type:'GET',
        success:function(data){
            if (data.code == 200){
                $('.auth-warn').hide()
                $('.new-house').show()
                for (var i=0; i<data.data.length; i++){
                    house_str = '<a href="/house/detail/?id='+data.data[i].id+'"><div class="house-title"><h3>ID:'+data.data[i].id+' —— '+data.data[i].title+'</h3></div>'
                    house_str += '<div class="house-content"><img src="/static/media'+data.data[i].image+'" >'
                    house_str += '<div class="house-text"><ul>'
                    house_str += '<li>位于：'+data.data[i].area+'</li>'
                    house_str += '<li>价格：￥'+data.data[i].price+'/晚</li>'
                    house_str += '<li>发布时间：'+data.data[i].create_time+'</li></ul></div></div></a>'
                    $('#house-info').append(house_str);

                }
            }
            if (data.code == 1001){
                $('#houses-list').hide()
                }
            }
    })
})