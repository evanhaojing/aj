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
    $(".order-comment").on("click", function(){
        var orderId = $(this).parents("li").attr("order-id");
        $(".modal-comment").attr("order-id", orderId);
    });

    $.ajax({
        url:'/order/orders_info/',
        dataType:'json',
        type:'GET',
        success:function(data){
            console.log(data)
            for (i=0; i<data.data.length; i++){
                order_info = '<li order-id='+data.data[i].order_id+'>'
                order_info += '<div class="order-title">'
                order_info += '<h3>订单编号：52033441314'+data.data[i].order_id+'</h3>'
                order_info += '<div class="fr order-operate">'
                order_info += '<button type="button" class="btn btn-success order-comment" data-toggle="modal"'
                order_info += 'data-target="#comment-modal" id="comment-modal">发表评价</button></div></div>'
                order_info += '<div class="order-content">'
                order_info += '<img src="/static/media'+data.data[i].image+'">'
                order_info += '<div class="order-text"><h3>订单</h3><ul>'
                order_info += '<li>创建时间：'+data.data[i].create_date+'</li>'
                order_info += '<li>入住日期：'+data.data[i].begin_date+'</li>'
                order_info += '<li>离开日期：'+data.data[i].end_date+'</li>'
                order_info += '<li>合计金额：'+data.data[i].amount+'元(共'+data.data[i].days+'晚)</li>'
                order_info += '<li>订单状态：<span>未接单</span></li>'
                order_info += '<li id="my-comment">我的评价：</li>'
                order_info += '<li id="no-comment">拒单原因：</li></ul></div></div></li>'
                $('.orders-list').append(order_info)
                $('.orders-list #my-comment').hide()
                $('.orders-list #no-comment').hide()
                $('.orders-list #comment-modal').hide()
            }
        }
    })
});