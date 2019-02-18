function hrefBack() {
    history.go(-1);
}

function decodeQuery(){
    var search = decodeURI(document.location.search);
    return search.replace(/(^\?)/, '').split('&').reduce(function(result, item){
        values = item.split('=');
        result[values[0]] = values[1];
        return result;
    }, {});
}

$(document).ready(function(){
    var mySwiper = new Swiper ('.swiper-container', {
        loop: true,
        autoplay: 2000,
        autoplayDisableOnInteraction: false,
        pagination: '.swiper-pagination',
        paginationType: 'fraction'
    })
    $(".book-house").show();

    var search = document.location.search
    id = search.split('=')[1]
    $.ajax({
        url:'/house/detail_info/'+id+'/',
        dataType:'json',
        type:'GET',
        success:function(data){
            console.log(data)
            for (i=0; i<data.data.images.length; i++){
                image_str = '<li class="swiper-slide"><img src="/static/media'+data.data.images[i]+'"></li>'
                $('.swiper-wrapper').append(image_str)
            }
            $('.house-price span').html(data.data.price)
            $('.house-title').html(data.data.title)
            $('.landlord-pic img').attr('src', '/static/media/'+data.data.user_avatar)
            $('.landlord-name span').html(data.data.user_name)
            $('.text-center li').html(data.data.address)
            $('.icon-text #room_count').html(data.data.room_count)
            $('.icon-text #acreage').html(data.data.acreage)
            $('.icon-text #unit').html(data.data.unit)
            $('.icon-text #capacity').html(data.data.capacity)
            $('.icon-text #beds').html(data.data.beds)
            $('.house-info-list #deposit').html(data.data.deposit)
            $('.house-info-list #min_days').html(data.data.min_days)
            $('.house-info-list #max_days').html(data.data.max_days)

            $('.book-house').attr('href', '/house/booking/?id='+data.data.id)
            var mySwiper = new Swiper ('.swiper-container', {
                loop: true,
                autoplay: 2000,
                autoplayDisableOnInteraction: false,
                pagination: '.swiper-pagination',
                paginationType: 'fraction'
            })
        }

    })
})