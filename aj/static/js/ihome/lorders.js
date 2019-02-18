//模态框居中的控制
function centerModals(){
    $('.modal').each(function(i){   //遍历每一个模态框
        var $clone = $(this).clone().css('display', 'block').appendTo('body');    
        var top = Math.round(($clone.height() - $clone.find('.modal-content').height()) / 2);
        top = top > 0 ? top : 0;
        $clone.remove();
        $(this).find('.modal-content').css("margin-top", top-30);  //修正原先已经有的30个像素
    });
}

function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}

$(document).ready(function(){
    $('.modal').on('show.bs.modal', centerModals);      //当模态框出现的时候
    $(window).on('resize', centerModals);
    $(".order-accept").on("click", function(){
        var orderId = $(this).parents("li").attr("order-id");
        $(".modal-accept").attr("order-id", orderId);
    });
    $(".order-reject").on("click", function(){
        var orderId = $(this).parents("li").attr("order-id");
        $(".modal-reject").attr("order-id", orderId);
    });

    $.ajax({
        url:'/order/lorders_info/',
        dataType:'json',
        type:'GET',
        success:function(data){
            console.log(data)
            for (i=0; i<data.data.length; i++){
                lorders_str = '<li order-id='+data.data[i].order_id+'>'
                lorders_str += '<div class="order-title">'
                lorders_str += '<h3>订单编号：52013143344'+data.data[i].order_id+'</h3>'
                lorders_str += '<div class="fr order-operate">'
                lorders_str += '<button type="button" class="btn btn-success order-accept" data-toggle="modal" data-target="#accept-modal">接单</button>'
                lorders_str += '<button type="button" class="btn btn-danger order-reject" data-toggle="modal" data-target="#reject-modal">拒单</button></div></div>'
                lorders_str += '<div class="order-content">'
                lorders_str += '<img src="/static/media'+data.data[i].image+'">'
                lorders_str += '<div class="order-text">'
                lorders_str += '<h3>'+data.data[i].house_title+'</h3><ul>'
                lorders_str += '<li>创建时间：'+data.data[i].create_date+'</li>'
                lorders_str += '<li>入住日期：'+data.data[i].begin_date+'</li>'
                lorders_str += '<li>离开日期：'+data.data[i].end_date+'</li>'
                lorders_str += '<li>合计金额：￥'+data.data[i].amount+'(共'+data.data[i].days+'晚)</li>'
                lorders_str += '<li>订单状态：<span>待接单</span></li>'
                lorders_str += '<li id="comment">客户评价： 挺好的</li></ul></div></div></li>'
                $('.orders-list').append(lorders_str)
                $('.orders-list #comment').hide()
            }
        }
    })
});