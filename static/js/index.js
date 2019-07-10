// 一级
$(document).on("click", ".nano-content li>div", function () {
    $(this).children().addClass("active");
    $(this).parents().siblings().find('.nav-link.active').removeClass("active");
    $(this).siblings().find('.active').removeClass("active");
    let value = $(this).children().attr("data-value");
    // console.log(value);
    switch (value) {
        // case "agent":
        //     agent_click(1);
        //     break;
        case "attack":
            attack_click(1);
            break;
        case "download":
            download_click();
            break;
        case "overview":
            overview_click();
            break;
        case "countDiv":
            count_div_click();
            break;
        case "server":
            server_click();
            break;
        case "website":
            website_click();
            break;
        case "user":
            user_click();
            break;
        default:
    }
});
$(document).on("click", ".tab", function (e) {
    $(this).addClass('current').siblings().removeClass('current');
});
$(document).on("click", ".nav-tabs>li", function (e) {
    $(this).addClass('active').siblings().removeClass('active');
});
$(function() {
    $('.d-firstNav').click(function() {
        if ($(this).parents().find('.side_open').is('.side_open')) {
            $(this).parent().find('.d-secondDrop').slideUp();
            dropSwift($(this), '.d-firstDrop');

        }
    });
    $('.d-secondNav').click(function() {
        dropSwift($(this), '.d-secondDrop');
    });

    function dropSwift(dom, drop) {
        dom.next().slideToggle();
        dom.parent().siblings().find(drop).slideUp();
        dom.parent().siblings().find('.iconRotate').removeClass('iconRotate');
        let iconChevron = dom.find('.slide_mark');
        if (iconChevron.hasClass('iconRotate')) {
            iconChevron.removeClass('iconRotate');
        } else {
            iconChevron.addClass('iconRotate');
        }
    }
})

$(document).on('click','.menu_button',function () {
    if ($('.s-side').hasClass('side_close')){
        $('.s-side').removeClass('side_close').addClass('side_open');
    }else{
        $('.s-side').removeClass('side_open').addClass('side_close');
        $('.d-firstDrop, .d-secondDrop').css('display','none');
        $('.nano-content').find('.slide_mark').removeClass('iconRotate')
    }
})
$(document).on('click','.side_close>.nano-content>.s-firstItem',function() {
    $('.s-side').removeClass('side_close').addClass('side_open');
});

