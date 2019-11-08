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
            if (page == null || page < 1) {
                page = 1;
            }
            $(this).addClass("active router-link-active").siblings().removeClass("active router-link-active");

            $.ajax({
                url: "/server_agent/query/",
                type: 'POST',
                data: {
                    "page": page
                },
                //dataType: "json",
                success: function (data_list) {
                    if(data_list.hasOwnProperty('auth')){
                        window.location.href = '/login'
                        // redirect('/login');
                    }
                    // console.log(data_list);
                    data = data_list['agents'];
                    let now_page = data_list['page'];
                    let max_size = data_list['max_size'];
                    // data = data.replace(/}{/g, "}****{").split("****");
                    let div_container = $(".netconnectingDIV");
                    let div_container2 = $(".table-manage");
                    div_container.text("");
                    let html = '<h1 class="page-title" ><i class="iconfont">&#xe73b;</i>网络连接资产</h1>';
                    html += '<div class="card">';
                    html += '<div class = "search_btngroup btnGroup">' +
                        '<div class="search_button"><span class="btnvalue">关键词: </span>' +
                        '<input id="netconnecting_msg" /></div>' +
                        '<div  class="btn" onclick="netconnecting_click_search(1)" >查询</div></div>';
                    html += '<div id="table_div">' +
                        '<div class="card-body">';
                    html += '<table class="table table-bordered table-striped table-hover">';
                    html += '<thead>';
                    html += '<tr>';
                    html += '<th style="width: 46px;padding: 14px;">\n' +
                    '  <div class="list_checkbox"><input class="regular_checkbox check_all" id="net_table_list" type="checkbox"> <label for="net_table_list"></label> </div>' +
                    '</th>';
                    // html += '<th>AGENT_ID</th>';
                    html += '<th>进程名</th>';
                    html += '<th>进程ID</th>';
                    html += '<th>服务器名</th>';
                    html += '<th>分组标签</th>';
                    html += '<th>进程路径</th>';
                    html += '<th>本地地址</th>';
                    html += '<th>本地端口</th>';
                    html += '<th>远程地址</th>';
                    html += '</tr>';
                    html += '</thead>';
                    html += '<tbody>';
                    for (x in data) {
                        let server_img;
                        data[x] = JSON.parse(data[x]);
                        if (data[x]['score']==='-1'||data[x]['score']==='None')
                        {
                            data[x]['score']=''
                        }
                        if (data[x]['online']==="在线")
                        {
                            if (data[x]['os'].toLowerCase().indexOf("windows") !== -1){
                                server_img='<img src="/static/images/os_windows_on.png" style="width: 20px"/>';
                            }else{
                                server_img='<img src="/static/images/os_linux_on.png" style="width: 20px"/>';
                            }
                        }
                        else
                        {
                            if (data[x]['os'].toLowerCase().indexOf("windows") !== -1){
                                server_img='<img src="/static/images/os_windows_off.png" style="width: 20px"/>';
                            }else{
                                server_img='<img src="/static/images/os_linux_off.png" style="width: 20px"/>';
                            }
                        }
                        html += '<tr>';

                        let agent_id = data[x]['agent_id'];
                        let b = new Base64();
                        let data1 = b.encode(JSON.stringify(data[x]));
                        html += '<td style="display: none">' + agent_id + '</td>';
                        html += '<td style="width: 46px;padding: 14px;">\n' +
                            '      <div class="list_checkbox"><input class="regular_checkbox check_single net_table_list" name="net_table_list" type="checkbox" online="'+data[x]['online']+'" id="'+agent_id+'"> <label for="'+agent_id+'"></label> </div>' +
                            '</td>' ;
                        html += '<td>'+ server_img +
                            '<a class="" href="javascript:void(0)" data-name="' + data1 + '"   >' + data[x]['host_name'] + '</a> </td>';
                        html += '<td>' + data[x]['internal_ip'] + '</td>';
                        html += '<td>' + data[x]['os'] + '</td>';
                        html += '<td><div class="tag green">test</div></td>';

                        html += '<td>C:\Output</td>';
                        html += '<td>' + data[x]['internal_ip'] + '</td>';
                        html += '<td>' + data[x]['own_user'] + '</td>';
                        html += '<td>' + data[x]['internal_ip'] + '</td>';

                        // html += '<td>' +
                        //     '<input class="web_tip_text" placeholder="点击编辑" data-type="server" data-id="'+data[x]['agent_id']+'" value="' + data[x]['remark'] + '"/>'+
                        //     '</td>';
                        // html +=  score;
                        html += '</tr>';
                    }
                    html += '</tbody>';
                    html += '</table>';
                    html += '</div>';


                    html += '<ul role="menubar" aria-disabled="false" aria-label="Pagination" class="pagination b-pagination pagination-md justify-content-center">';
                    html += '<a href="javascript:void(0);" onclick="netconnecting_click(' + (now_page - 1) + ')">上一页</a>';
                    html += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp';
                    html += '<a href="javascript:void(0);">' + now_page + "/" + max_size + '</a>';
                    html += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp';
                    html += '<a href="javascript:void(0);" onclick="netconnecting_click(' + (now_page + 1) + ')">下一页</a>';
                    //html += '<input id = "agent_jump" value="'+now_page+'" />';
                    //  html += '<a href="javascript:void(0);" onclick="agent_jump()">跳转</a>';
                    html += '</ul></div>';
                    div_container.append(html);
                }
            });
            $(".container1").css('background-color', '#f0f2f5');

        }

    });
}
function netconnecting_click_search(netconnecting_page) {
    let data = {};
    let netconnecting_msg = $("#netconnecting_msg").val();

    if (netconnecting_msg === undefined) {
        netconnecting_msg = ""
    }
    data['netconnecting_msg'] = netconnecting_msg;
    data['page'] = netconnecting_page;
    if (netconnecting_page == null || netconnecting_page < 1) {
        netconnecting_page = 1;
    }
    // let div_container1 = $(".attackDiv");
    // let div_container2 = $(".btnGroup");
    // div_container2.append("<div id='table_select_div'></div>");
//    div_container1.append("<div id='table_div'></div>");

    $.ajax({
        url: "/server_agent/query/",
        type: 'POST',
        data: data,
        // async: false,
        dataType: "json",
        success: function (data_list) {
            data = data_list['agents'];
            let now_page = data_list['page'];
            let max_size = data_list['max_size'];
            // data = data.replace(/}{/g, "}****{").split("****");

            //let select_div=$("#table_select_div");
            let div_container = $("#table_div");
            div_container.text("");

            let html = "<div>";

            html += '<div class="card-body">';
            html += '<table class="table table-bordered table-striped table-hover">';
            html += '<thead>';
            html += '<tr>';
            html += '<th style="width: 46px;padding: 14px;">\n' +
                '  <div class="list_checkbox"><input class="regular_checkbox check_all" id="net_table_list" type="checkbox"> <label for="net_table_list"></label> </div>' +
                '</th>';
            // html += '<th>AGENT_ID</th>';
            html += '<th>进程名</th>';
            html += '<th>进程ID</th>';
            html += '<th>服务器名</th>';
            html += '<th>分组标签</th>';
            html += '<th>进程路径</th>';
            html += '<th>本地地址</th>';
            html += '<th>本地端口</th>';
            html += '<th>远程地址</th>';
            html += '</tr>';
            html += '</thead>';
            html += '<tbody>';
            for (x in data) {
                let server_img;
                data[x] = JSON.parse(data[x]);
                if (data[x]['score']==='-1'||data[x]['score']==='None')
                {
                    data[x]['score']=''
                }
                if (data[x]['online']==="在线")
                {
                    if (data[x]['os'].toLowerCase().indexOf("windows") !== -1){
                        server_img='<img src="/static/images/os_windows_on.png" style="width: 20px"/>';
                    }else{
                        server_img='<img src="/static/images/os_linux_on.png" style="width: 20px"/>';
                    }
                }
                else
                {
                    if (data[x]['os'].toLowerCase().indexOf("windows") !== -1){
                        server_img='<img src="/static/images/os_windows_off.png" style="width: 20px"/>';
                    }else{
                        server_img='<img src="/static/images/os_linux_off.png" style="width: 20px"/>';
                    }
                }
                html += '<tr>';

                let agent_id = data[x]['agent_id'];
                let b = new Base64();
                let data1 = b.encode(JSON.stringify(data[x]));
                html += '<td style="display: none">' + agent_id + '</td>';
                html += '<td style="width: 46px;padding: 14px;">\n' +
                    '      <div class="list_checkbox"><input class="regular_checkbox check_single net_table_list" name="net_table_list" type="checkbox" online="'+data[x]['online']+'" id="'+agent_id+'"> <label for="'+agent_id+'"></label> </div>' +
                    '</td>' ;
                html += '<td>'+ server_img +
                    '<a class="" href="javascript:void(0)" data-name="' + data1 + '"   >' + data[x]['host_name'] + '</a> </td>';
                html += '<td>' + data[x]['internal_ip'] + '</td>';
                html += '<td>' + data[x]['os'] + '</td>';
                html += '<td><div class="tag green">test</div></td>';

                html += '<td>C:\Output</td>';
                html += '<td>' + data[x]['internal_ip'] + '</td>';
                html += '<td>' + data[x]['own_user'] + '</td>';
                html += '<td>' + data[x]['internal_ip'] + '</td>';

                // html += '<td>' +
                //     '<input class="web_tip_text" placeholder="点击编辑" data-type="server" data-id="'+data[x]['agent_id']+'" value="' + data[x]['remark'] + '"/>'+
                //     '</td>';
                // html +=  score;
                html += '</tr>';
            }
            html += '</tbody>';
            html += '</table>';
            html += '</div>';

            html += '<ul role="menubar" aria-disabled="false" aria-label="Pagination" class="pagination b-pagination pagination-md justify-content-center">';

            html += '<a href="javascript:void(0);" onclick="netconnecting_click(' + (now_page - 1) + ')">上一页</a>';
            html += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp';
            html += '<a href="javascript:void(0);">' + now_page + "/" + max_size + '</a>';
            html += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp';
            html += '<a href="javascript:void(0);" onclick="netconnecting_click(' + (now_page + 1) + ')">下一页</a>';
            // html += '<input id="netconnecting_jump" value="' + now_page + '" />';

            // html += '<a href="javascript:void(0);" onclick="netconnecting_jump()">跳转</a>';

            html += '</ul>';
            div_container.append(html);
            $(".container1").css('background-color', '#f0f2f5');

        }
    });
}
// function netconnecting_jump() {
//     let jump_page = $("#netconnecting_jump").val();
//     attack_click(jump_page);
// }