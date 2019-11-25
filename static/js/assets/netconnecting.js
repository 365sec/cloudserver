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
    // let netconnecting_msg = $("#netconnecting_msg").val();
    let netconnecting_host = $("#netconnecting_host").val();
    let netconnecting_name = $("#netconnecting_name").val();
    let netconnecting_port = $("#netconnecting_port").val();
    let netconnecting_remote_addr = $("#netconnecting_remote_addr").val();
    let netconnecting_remote_port = $("#netconnecting_remote_port").val();

    // if (netconnecting_msg === undefined) {netconnecting_msg = ""}
    if (netconnecting_host === undefined) {netconnecting_host = ""}
    if (netconnecting_name === undefined) {netconnecting_name = ""}
    if (netconnecting_port === undefined) {netconnecting_port = ""}
    if (netconnecting_remote_addr === undefined) {netconnecting_remote_addr = ""}
    if (netconnecting_remote_port === undefined) {netconnecting_remote_port = ""}

    // data['netconnecting_msg'] = netconnecting_msg;

    data['netconnecting_host'] = netconnecting_host;
    data['netconnecting_name'] = netconnecting_name;
    data['netconnecting_port'] = netconnecting_port;
    data['netconnecting_remote_addr'] = netconnecting_remote_addr;
    data['netconnecting_remote_port'] = netconnecting_remote_port;
    data['page'] = page;


    $.ajax({
        url: "assets/query_network",
        type: 'POST',
        data: data,
        //dataType: "json",
        success: function (data_list) {
            console.log(data_list);
            let now_page = data_list['page'];
            let max_size = data_list['max_size'];
            let hostname=data_list['hostname'];
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
            // html_select += '<div class="search_button" ><span class="btnvalue"  >关键词: </span>';

            html_select += '<div class="search_button">';
            html_select += '<select id="netconnecting_host" class="form-btn" style="width: 140px">';
            html_select += '<option value="" >' + "--请选择主机名称--" + '</option>';
            for (agent_id in hostname) {
                html_select += '<option value="' + agent_id + '" >' + hostname[agent_id][0]+"("+hostname[agent_id][1] +")"+ '</option>'
            }
            html_select += '</select></div>';
            html_select += '<input id="netconnecting_port" placeholder="本地端口" value="' + netconnecting_port + '" />';
            html_select += '<input id="netconnecting_remote_addr" placeholder="远程地址" value="' + netconnecting_remote_addr + '" />';
            html_select += '<input id="netconnecting_remote_port" placeholder="远程端口" value="' + netconnecting_remote_port + '" />';
            html_select += '<input id="netconnecting_name"  placeholder="进程名称" value="' + netconnecting_name + '" />';

            // html_select += '<input id="netconnecting_msg" value="' + netconnecting_msg + '" /></div>';
            html_select += '<div  class="btn" onclick="netconnecting_click_search(0)" >查询</div>';
            html_select += '<div  class="btn" onclick="netconnecting_reset()" >重置</div>';
            html_select += '</div>';
            html_select += '</div>';
            select_div.html(html_select);
            // $("#server_attack_time").val(attack_time);

            // $("#netconnecting_msg").val(netconnecting_msg);
            $("#netconnecting_host").val(netconnecting_host);
            $("#netconnecting_name").val(netconnecting_name);
            $("#netconnecting_port").val(netconnecting_port);
            $("#netconnecting_remote_addr").val(netconnecting_remote_addr);
            $("#netconnecting_remote_port").val(netconnecting_remote_port);
            //----------------------------------------------------------
            let netconnecting_table_data = data_list['data'];
            let netconnecting_table = '';
            for(let j=0,len = netconnecting_table_data.length;j<len;j++) {
                let server_img;
                if (netconnecting_table_data[j]['os'].toLowerCase().indexOf("windows") !== -1){
                    server_img='<img src="/static/images/os_windows_on.png" style="width: 20px"/>';
                }else{
                    server_img='<img src="/static/images/os_linux_on.png" style="width: 20px"/>';
                }
                netconnecting_table += '<tr>' +
                    '<td class="port_add">'+server_img + '<div>'+ netconnecting_table_data[j]['host_name'] + '<p>' + netconnecting_table_data[j]['host_ip'] + '</p></div></td>' +
                    '<td>' + netconnecting_table_data[j]['local_addr'] + '</td>' +
                    '<td>' + netconnecting_table_data[j]['local_port'] + '</td>' +
                    '<td>' + netconnecting_table_data[j]['remote_addr'] + '</td>' +
                    '<td>' + netconnecting_table_data[j]['remote_port'] + '</td>' +
                    '<td>' + netconnecting_table_data[j]['name'] + '</td>' +
                    '<td>' + netconnecting_table_data[j]['proname'] + '</td>' +
                    '<td>' + netconnecting_table_data[j]['pid'] + '</td>' +
                    '<td title="' + netconnecting_table_data[j]['path'] + '">' + netconnecting_table_data[j]['path'] + '</td>';
            }

            let page = '<ul role="menubar" aria-disabled="false" aria-label="Pagination" class="pagination b-pagination pagination-md justify-content-center">' +
                '<a href="javascript:void(0);" onclick="netconnecting_click_search(' + (now_page - 1)+')">上一页</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp' +
                '<a href="javascript:void(0);">' + (now_page+1) + "/" + max_size + '</a>' +
                '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp' +
                '<a href="javascript:void(0);" onclick="netconnecting_click_search(' + (now_page + 1) + ')">下一页</a>' +
                '<input id = "netconnecting_jump" value="' + (now_page+1) + '" />' +
                '<a href="javascript:void(0);" onclick="netconnecting_click_search_jump()">跳转</a>' +
                '</ul>';
            $('.paging').html(page);
            $('#netconnecting_table>tbody').html(netconnecting_table);

        }});



}
function netconnecting_click_search_jump() {

    let page= $("#netconnecting_jump").val();
    netconnecting_click_search(parseInt(page)-1)

}
function netconnecting_reset() {


    $("#netconnecting_msg").val("");
    $("#netconnecting_host").val("");
    $("#netconnecting_name").val("");
    $("#netconnecting_port").val("");
    $("#netconnecting_remote_addr").val("");
    $("#netconnecting_remote_port").val("");
    netconnecting_click_search(0);
}