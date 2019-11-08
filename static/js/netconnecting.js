function netconnecting_click(page) {
    /*
     * 网络连接资产点击
     *
     */
    $.ajax( {
        url: '/netconnecting',
        dataType:"html",
        type: "get",
        success: function (res) {
            $("#div_container").html($(res));
            if (page == null ) {
                page = 0;
            }
            $(this).addClass("active router-link-active").siblings().removeClass("active router-link-active");
            netconnecting_click_search(page)


        }})

}

function netconnecting_click_search(page) {

    console.log(page);
    let data={};
    data["page"]=0;
    $.ajax({
        url: "assets/query_port",
        type: 'POST',
        data: data,
        dataType: "json",
        success: function (data_list) {
            console.log(data_list)
        }
    });



}
// function netconnecting_jump() {
//     let jump_page = $("#netconnecting_jump").val();
//     attack_click(jump_page);
// }