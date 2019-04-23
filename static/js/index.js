$(document).on("click", ".nav.nav-tabs li>a", function () {
    $(this).addClass("active router-link-active").parent().siblings().children().removeClass("active router-link-active");
    let value = $(this).attr("data-value");
    // console.log(value);
    switch (value) {
        case "agent":
            agent_click(1);
            break;
        case "attack":
            attack_click(1);
            break;
        case "download":
            download_click(1);
            break;
        case "overview":
            overview_click();
            break;
        case "countDiv":
            count_div_click();
            break;
        default:
    }
});
$(document).on("click", ".map-tab", function () {
    $(this).addClass('current').siblings().removeClass('current');
});
$(document).on("click", ".myTab li", function () {
    $(this).addClass("active").siblings().removeClass("active")
});