function process_click(page) {
    if (page == null ) {
        page = 0;
    }
    $.ajax( {
        url: '/process',
        dataType:"html",
        type: "get",
        success: function (res) {
            $("#div_container").html($(res));
            $(this).addClass("active router-link-active").siblings().removeClass("active router-link-active");

            process_click_search(page)
        }
    });
}

function process_click_search(page) {
    let data = {};
    let process_msg = $("#process_msg").val();
    let process_host = $("#process_host").val();
    let process_name = $("#process_name").val();
    let process_command = $("#process_command").val();
    let process_user = $("#process_user").val();
    let process_level = $("#process_level").val();

    if (process_msg === undefined) {process_msg = ""}
    if (process_host === undefined) {process_host = ""}
    if (process_name === undefined) {process_name = ""}
    if (process_command === undefined) {process_command = ""}
    if (process_user === undefined) {process_user = ""}
    if (process_level === undefined) {process_level = ""}

    data['process_msg'] = process_msg;
    data['process_host'] = process_host;
    data['process_name'] = process_name;
    data['process_command'] = process_command;
    data['process_user'] = process_user;
    data['process_level'] = process_level;
    data['page'] = page;
    $.ajax({
        url: "assets/process_query",
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
            let select_div = $("#process_select_div");
            let html_select = "";
            html_select = '<div>';
            html_select += '<div id="" class="search_btngroup">';
            html_select += '<div class="search_button" >';

            html_select += '<div class="search_button"><span class="btnvalue">主机名称: </span>';
            html_select += '<select id="process_host" class="form-btn" style="width: 140px">';
            html_select += '<option value="" >' + "--请选择主机名称--" + '</option>';
            for (agent_id in hostname) {
                html_select += '<option value="' + agent_id + '" >' + hostname[agent_id][0]+"("+hostname[agent_id][1] +")"+ '</option>'
            }
            html_select += '</select></div>';
            html_select += '<input id="process_name" placeholder="进程名称" value="' + process_name + '" />';
            html_select += '<input id="process_command" placeholder="启动命令" value="' + process_command + '" />';
            html_select += '<input id="process_user" placeholder="启动用户" value="' + process_user + '" /></div>';

            html_select += '<div class="search_button"><span class="btnvalue">是否管理员: </span>';
            html_select += '<select id="process_level" class="form-btn" style="width: 140px">';
            html_select += '<option value="" >' + "--是否管理员--" + '</option>';
            html_select += '<option value="1" >' + '管理员'+ '</option>';
            html_select += '<option value="0" >' + '非管理员'+ '</option>';
            html_select += '</select></div>';
            html_select += '<div  class="btn" onclick="process_click_search(0)" >查询</div>';
            html_select += '<div  class="btn" onclick="process_reset()" >重置</div>';
            html_select += '</div>';
            html_select += '</div>';
            select_div.html(html_select);
            // $("#server_attack_time").val(attack_time);
            $("#process_msg").val(process_msg);
            $("#process_host").val(process_host);
            $("#process_name").val(process_name);
            $("#process_command").val(process_command);
            $("#process_user").val(process_user);
            $("#process_level").val(process_level);
            //----------------------------------------------------------
            let process_table_data = data_list['data'];
            let process_table = '';
            for(let j=0,len = process_table_data.length;j<len;j++) {
                process_table += '<tr>' +
                    '<td>' + process_table_data[j]['host_name']+'<br>('+ process_table_data[j]['host_ip']+ ')</td>' +
                    '<td>' + process_table_data[j]['pid'] + '</td>' +
                    '<td>' + process_table_data[j]['name'] + '</td>' +
                    '<td>' + process_table_data[j]['command'] + '</td>' +
                    '<td>' + process_table_data[j]['path'] + '</td>'+
                    '<td>' + process_table_data[j]['user'] + '</td>'+
                    '<td>' + process_table_data[j]['level'] + '</td>';
            }

            let page = '<ul role="menubar" aria-disabled="false" aria-label="Pagination" class="pagination b-pagination pagination-md justify-content-center">' +
                '<a href="javascript:void(0);" onclick="process_click_search(' + (now_page - 1)+')">上一页</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp' +
                '<a href="javascript:void(0);">' + (now_page+1) + "/" + max_size + '</a>' +
                '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp' +
                '<a href="javascript:void(0);" onclick="process_click_search(' + (now_page + 1) + ')">下一页</a>' +
                '<input id = "process_jump" value="' + (now_page+1) + '" />' +
                '<a href="javascript:void(0);" onclick="process_click_search_jump()">跳转</a>' +
                '</ul>';
            $('.page').html(page);
            $('#process_table>tbody').html(process_table);

        }});


}

function process_click_search_jump() {

    let page= $("#process_jump").val();

    process_click_search(parseInt(page-1))

}
function process_reset() {
    $("#process_msg").val("");
    $("#process_host").val("");
    $("#process_name").val("");
    $("#process_command").val("");
    $("#process_user").val("");
    $("#process_level").val("");
    process_click_search(0);
}