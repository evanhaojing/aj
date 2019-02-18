function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}

$(document).ready(function(){
    // $('.popup_con').fadeIn('fast');
    // $('.popup_con').fadeOut('fast');
    $.ajax({
        url:'/house/area_facilities/',
        dataType:'json',
        type:'GET',
        success:function(data){
            if (data.code == 200){
                for (var i=0; i<data.area.length; i++){
                    area_str = '<option value="'+data.area[i].id+'">'+data.area[i].name+'</option>'
                    $('#area-id').append(area_str)
                }
                for (var k=0; k<data.facility.length; k++){
                    facility_str = '<li><div class="checkbox">'
                    facility_str += '<input type="checkbox" name="facility" value="'+data.facility[k].id+'">'+data.facility[k].name+'</label></div></li>'
                    $('.clearfix').append(facility_str)
                }
            }
        }
    });

    $('#form-house-info').submit(function(e){
        e.preventDefault()
        $(this).ajaxSubmit({
            url:'/house/new_house/',
            dataType:'json',
            type:'POST',
            success:function(data){
                if (data.code == 200){
                    alert(data.msg)
                    $('#form-house-info').hide()
                    $('#form-house-image').show()
                    $("#house-id").val(data.data.id)
                    console.log(data.data)
                }
            }
        })
    });

    $('#form-house-image').submit(function(e){
        e.preventDefault()
        $(this).ajaxSubmit({
            url:'/house/house_image/',
            dataType:'json',
            type:'POST',
            success:function(data){
                if (data.code == 200){
                    var img_src = '<img src="\/static\/media\/'+data.images_url+'">'
                    $('.house-image-cons').append(img_src)
                }
            }
        })
    });
})