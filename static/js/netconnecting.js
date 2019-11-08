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
            $(".container1").css('background-color', '#f0f2f5');

            if (page == null ) {
                page = 0;
            }
            $(this).addClass("active router-link-active").siblings().removeClass("active router-link-active");
            netconnecting_click_search(page)


        }})

}

function netconnecting_click_search(page) {
    let data = {};
    let netconnecting_msg = $("#netconnecting_msg").val();

    if (netconnecting_msg === undefined) {
        netconnecting_msg = ""
    }
    data['netconnecting_msg'] = netconnecting_msg;
    data['page'] = page;
    $.ajax({
        url: "assets/query_port",
        type: 'POST',
        data: data,
        //dataType: "json",
        success: function (data_list) {
            console.log(data_list)
            let now_page = data_list['page'];
            let max_size = data_list['max_size'];
            if (now_page == null ) {
                now_page = 0;
            }
            if (now_page > max_size) {
                now_page = max_size;
            }
            //搜索框-----------------------------------------------------
            let select_div = $("#netconnecting_select_div");
            let html_select = "";
            html_select = '<div>';
            html_select += '<div id="" class="search_btngroup">';
            html_select += '<div class="search_button" ><span class="btnvalue"  >关键词: </span>';
            html_select += '<input id="netconnecting_msg" value="' + netconnecting_msg + '" /></div>';
            html_select += '<div  class="btn" onclick="netconnecting_click_search(1)" >查询</div>';
            html_select += '<div  class="btn" onclick="netconnecting_reset()" >重置</div>';
            html_select += '</div>';
            html_select += '</div>';
            select_div.html(html_select);
            // $("#server_attack_time").val(attack_time);
            $("#netconnecting_msg").val(netconnecting_msg);
            //----------------------------------------------------------
            let netconnecting_table_data = data_list['data'];
            let netconnecting_table = '';
            for(let j=0,len = netconnecting_table_data.length;j<len;j++) {
                netconnecting_table += '<tr><td>' + netconnecting_table_data[j]['agent_id'] + '</td>' +
                    '<td>' + netconnecting_table_data[j]['pid'] + '</td>' +
                    '<td>' + netconnecting_table_data[j]['name'] + '</td>' +
                    '<td>' + netconnecting_table_data[j]['name'] + '</td>' +
                    '<td>' + netconnecting_table_data[j]['path'] + '</td>' +
                    '<td>' + netconnecting_table_data[j]['local_addr'] + '</td>' +
                    '<td>' + netconnecting_table_data[j]['local_addr'] + '</td>' +
                    '<td>' + netconnecting_table_data[j]['remote_addr'] + '</td>' +
                    '<td>' + netconnecting_table_data[j]['remote_port'] + '</td>';
            }

            let page = '<ul role="menubar" aria-disabled="false" aria-label="Pagination" class="pagination b-pagination pagination-md justify-content-center">' +
                '<a href="javascript:void(0);" onclick="netconnecting_click_search(' + (now_page - 1)+')">上一页</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp' +
                '<a href="javascript:void(0);">' + (now_page+1) + "/" + max_size + '</a>' +
                '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp' +
                '<a href="javascript:void(0);" onclick="netconnecting_click_search(' + (now_page + 1) + ')">下一页</a>' +
                '<input id = "netconnecting_jump" value="' + (now_page+1) + '" />' +
                '<a href="javascript:void(0);" onclick="netconnecting_click_search_jump()">跳转</a>' +
                '</ul>';
            $('.page').html(page);
            $('#netconnecting_table>tbody').html(netconnecting_table);

        }});



}
function netconnecting_click_search_jump() {

    let page= $("#netconnecting_jump").val();
    netconnecting_click_search(parseInt(page))

}
function netconnecting_reset() {
    $("#netconnecting_msg").val("");
    netconnecting_click_search(1);
}