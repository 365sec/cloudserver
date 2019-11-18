function port_click(page) {
    if (page == null ) {
        page = 0;
    }
    $.ajax( {
        url: '/port',
        dataType:"html",
        type: "get",
        success: function (res) {
            $("#div_container").html($(res));
            $(this).addClass("active router-link-active").siblings().removeClass("active router-link-active");

            port_click_search(page)
        }
    });
}

function port_click_search(page) {
    let data = {};

    let port_host = $("#port_host").val();
    let port_local_port = $("#port_local_port").val();
    let port_proname = $("#port_proname").val();

    if (port_host === undefined) {port_host = ""}
    if (port_local_port === undefined) {port_local_port = ""}
    if (port_proname === undefined) {port_proname = ""}

    data['port_host'] = port_host;
    data['port_local_port'] = port_local_port;
    data['port_proname'] = port_proname;


    data['page'] = page;
    $.ajax({
        url: "assets/query_port",
        type: 'POST',
        data: data,
        //dataType: "json",
        success: function (data_list) {
            console.log(data_list);
            let hostname=data_list['hostname'];
            let now_page = data_list['page'];
            let max_size = data_list['max_size'];
            if (now_page == null ) {
                now_page = 0;
            }
            if (now_page > max_size) {
                now_page = max_size;
            }
            //搜索框-----------------------------------------------------
            let select_div = $("#port_select_div");
            let html_select = "";
            html_select = '<div>';
            html_select += '<div id="" class="search_btngroup">';
            html_select += '<div class="search_button" >';

            html_select += '<div class="search_button">';
            html_select += '<select id="port_host" class="form-btn" style="width: 140px">';
            html_select += '<option value="" >' + "--请选择主机名称--" + '</option>';
            for (agent_id in hostname) {
                html_select += '<option value="' + agent_id + '" >' + hostname[agent_id][0]+"("+hostname[agent_id][1] +")"+ '</option>'
            }
            html_select += '</select></div>';
            html_select += '<input id="port_local_port" placeholder="本地端口" value="' + port_local_port + '" />';
            html_select += '<input id="port_proname" placeholder="进程名" value="' + port_proname + '" />';
            // html_select += '<input id="port_user" placeholder="协议类型" value="' + port_user + '" /></div>';


            html_select += '<div  class="btn" onclick="port_click_search(0)" >查询</div>';
            html_select += '<div  class="btn" onclick="port_reset()" >重置</div>';
            html_select += '</div>';
            html_select += '</div>';
            select_div.html(html_select);
            // $("#server_attack_time").val(attack_time);

            $("#port_host").val(port_host);
            $("#port_local_port").val(port_local_port);
            $("#port_proname").val(port_proname);

            //----------------------------------------------------------
            let port_table_data = data_list['data'];
            let port_table = '';
            for(let j=0,len = port_table_data.length;j<len;j++) {
                port_table += '<tr>' +
                    '<td class="port_add">' + port_table_data[j]['host_name']+'<p >('+ port_table_data[j]['host_ip']+ ')</p></td>' +
                    '<td>' + port_table_data[j]['local_addr'] + '</td>'+
                    '<td>' + port_table_data[j]['local_port'] + '</td>'+
                    '<td>' + port_table_data[j]['name'] + '</td>' +
                    '<td>' + port_table_data[j]['pid'] + '</td>' +
                    '<td>' + port_table_data[j]['proname'] + '</td>' +
                    '<td>' + port_table_data[j]['path'] + '</td>';
            }

            let page = '<ul role="menubar" aria-disabled="false" aria-label="Pagination" class="pagination b-pagination pagination-md justify-content-center">' +
                '<a href="javascript:void(0);" onclick="port_click_search(' + (now_page - 1)+')">上一页</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp' +
                '<a href="javascript:void(0);">' + (now_page+1) + "/" + max_size + '</a>' +
                '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp' +
                '<a href="javascript:void(0);" onclick="port_click_search(' + (now_page + 1) + ')">下一页</a>' +
                '<input id = "port_jump" value="' + (now_page+1) + '" />' +
                '<a href="javascript:void(0);" onclick="port_click_search_jump()">跳转</a>' +
                '</ul>';
            $('.paging').html(page);
            $('#port_table>tbody').html(port_table);

        }});


}

function port_click_search_jump() {

    let page= $("#port_jump").val();

    port_click_search(parseInt(page-1))

}
function port_reset() {
    $("#port_host").val("");
    $("#port_local_port").val("");
    $("#port_proname").val("");

    port_click_search(0);
}