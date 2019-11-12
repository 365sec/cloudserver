function app_click(page) {
    /*
     * 软件应用点击
     *
     */
    $.ajax( {
        url: '/app',
        dataType:"html",
        type: "get",
        success: function (res) {
            $("#div_container").html($(res));
            if (page == null || page < 1) {
                page = 1;
            }
            $(this).addClass("active router-link-active").siblings().removeClass("active router-link-active");

            app_click_search(0)
        }
    });
}
function app_click_search(app_page) {

}
