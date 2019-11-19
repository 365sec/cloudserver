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
            $(".container1").css('background-color', '#f0f2f5');
            $(this).addClass("active router-link-active").siblings().removeClass("active router-link-active");

            port_chart();
            port_click_search(page)
        }
    });
}

function port_click_search(page) {
    let data = {};
    let port_msg = $("#port_msg").val();
    let port_host = $("#port_host").val();
    let port_name = $("#port_name").val();
    let port_command = $("#port_command").val();
    let port_user = $("#port_user").val();
    let port_level = $("#port_level").val();

    if (port_msg === undefined) {port_msg = ""}
    if (port_host === undefined) {port_host = ""}
    if (port_name === undefined) {port_name = ""}
    if (port_command === undefined) {port_command = ""}
    if (port_user === undefined) {port_user = ""}
    if (port_level === undefined) {port_level = ""}

    data['port_msg'] = port_msg;
    data['port_host'] = port_host;
    data['port_name'] = port_name;
    data['port_command'] = port_command;
    data['port_user'] = port_user;
    data['port_level'] = port_level;
    data['page'] = page;
    let hostname= []; //主机列表
    let port_list = []; //进程列表
    let now_page = 0;
    let max_size;
    $.ajax({
        url: "assets/query_process_num",
        type: 'POST',
        data: data,
        async:false,
        //dataType: "json",
        success: function (data_list) {
            hostname=data_list['hostname'];
            port_list=data_list['process_list'];
            now_page=data_list['page'];
            max_size=data_list['max_size'];

        }});

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
    html_select += '<input id="port_name" placeholder="进程名称" value="' + port_name + '" />';
    html_select += '<input id="port_command" placeholder="启动命令" value="' + port_command + '" />';
    html_select += '<input id="port_user" placeholder="启动用户" value="' + port_user + '" /></div>';

    html_select += '<div class="search_button">';
    html_select += '<select id="port_level" class="form-btn" style="width: 140px">';
    html_select += '<option value="" >' + "--是否管理员--" + '</option>';
    html_select += '<option value="1" >' + '管理员'+ '</option>';
    html_select += '<option value="0" >' + '非管理员'+ '</option>';
    html_select += '</select></div>';
    html_select += '<div  class="btn" onclick="port_click_search(0)" >查询</div>';
    html_select += '<div  class="btn" onclick="port_reset()" >重置</div>';
    html_select += '</div>';
    html_select += '</div>';
    select_div.html(html_select);
    // $("#server_attack_time").val(attack_time);
    $("#port_msg").val(port_msg);
    $("#port_host").val(port_host);
    $("#port_name").val(port_name);
    $("#port_command").val(port_command);
    $("#port_user").val(port_user);
    $("#port_level").val(port_level);
    //----------------------------------------------------------
    let next_page='<a href="javascript:void(0);" onclick="port_click_search(' + (now_page + 1) + ')">下一页</a>';
    if (parseInt(now_page)+1===parseInt(max_size))
    {
        next_page='<a href="javascript:void(0);" onclick="port_click_search(' + (now_page + 1) + ')"></a>';
    }
    let pagecontent = '<ul role="menubar" aria-disabled="false" aria-label="Pagination" class="pagination b-pagination pagination-md justify-content-center">' +
        '<a href="javascript:void(0);" onclick="port_click_search(' + (now_page - 1)+')">上一页</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp' +
        '<a href="javascript:void(0);">' + (now_page+1) + "/" + max_size + '</a>' +
        '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp' +
        next_page +
        '<input id = "port_jump" value="' + (now_page+1) + '" />' +
        '<a href="javascript:void(0);" onclick="port_click_search_jump()">跳转</a>' +
        '</ul>';
    $('#port_table>tbody').html('');
    for(let i=0;i<port_list.length;i++) {
        let base_id=port_list[i][0];
        base_id=hex_md5(base_id);
        let port_table = '';
        port_table += '<tr id="'+ base_id+'" port_id="'+ port_list[i][0]+'">' +
            '<td width="60%" >进程：<span>'+port_list[i][0]+'</span></td>' +
            '<td width="40%">主机数：<span>'+port_list[i][1]+'</span></td>' +
            '<td width="45px" style="text-align: center"><i class="iconfont slide_mark">&#xe64a;</i></td>' +
            '</tr>' +
            '<tr style="display: none">' +
            '<td colspan="3" >' +
            '<table class="table table-striped table_fixed w100">' +
            '<thead>' +
            '<tr>' +
            '<th width="15%">主机</th>' +
            '<th width="20%">进程名</th>' +
            '<th width="6%">进程ID</th>' +
            '<th width="22%">进程路径</th>' +
            '<th width="22%">启动命令</th>' +
            '<th width="10%">用户</th>' +
            '<th width="12%">是否管理员</th>' +
            '</tr>' +
            '</thead>' +
            '<tbody>' +
            '</tbody>' +
            '</table><div class="paging2"></div>'+
            '</td>' +
            '</tr>';
        $('#port_table>tbody').append(port_table);

    }

    $('.paging').html(pagecontent);
}

function port_detail(data,port_name1,now_page) {
    // console.log(port_name1);
    if (typeof data === "string") {
        data=JSON.parse(data);
    }
    data['page']=now_page;
    $.ajax({
        url: "assets/query_process",
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
            let port_table_data = data_list['data'];
            let port_detail_html= '';
            for (let j = 0, len = port_table_data.length; j < len; j++) {
                let server_img;
                if (port_table_data[j]['os'].toLowerCase().indexOf("windows") !== -1){
                    server_img='<img src="/static/images/os_windows_on.png" style="width: 20px"/>';
                }else{
                    server_img='<img src="/static/images/os_linux_on.png" style="width: 20px"/>';
                }
                let command = port_table_data[j]['command'].replace(/\"/, "");
                port_detail_html += '<tr>' +
                    '<td class="port_add">'+server_img + port_table_data[j]['host_name'] + '<p>' + port_table_data[j]['host_ip'] + '</p></td>' +

                    '<td title="' + port_table_data[j]['name'] + '">' + port_table_data[j]['name'] + '</td>' +
                    '<td>' + port_table_data[j]['pid'] + '</td>' +
                    '<td title="' + port_table_data[j]['path'] + '">' + port_table_data[j]['path'] + '</td>' +

                    '<td title="' + command + '">' + port_table_data[j]['command'] + '</td>' +
                    '<td>' + port_table_data[j]['user'] + '</td>' +
                    '<td>' + port_table_data[j]['level'] + '</td>';
            }
            let str_data=JSON.stringify(data).replace(/"/g,'&quot;');

            let next_page='<a href="javascript:void(0);" onclick="port_detail(\''+str_data+'\',\'' +port_name1+'\',\''+ (now_page + 1)+'\')">下一页</a>';
            if (parseInt(now_page)+1===parseInt(max_size))
            {
                next_page='<a href="javascript:void(0);" onclick="port_detail(\''+str_data+'\',\'' +port_name1+'\',\''+ (now_page + 1)+'\')"></a>';
            }
            let pagecontent = '<ul role="menubar" aria-disabled="false" aria-label="Pagination" class="pagination b-pagination pagination-md justify-content-center">' +
                '<a href="javascript:void(0);" onclick="port_detail(\''+str_data+'\',\'' +port_name1+'\',\''+ (now_page - 1)+'\')">上一页</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp' +
                '<a href="javascript:void(0);">' + (now_page+1) + "/" + max_size + '</a>' +
                '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp' +
                next_page+
                '<input id = "port_detial_jump" value="' + (now_page+1) + '" />' +
                '<a href="javascript:void(0);" onclick="port_detial_search_jump(\''+str_data+'\',\'' +port_name1+'\',\''+ (0)+'\')">跳转</a>' +
                '</ul>';



            let port_info = $("#"+port_name1).next();
            port_info.find('.paging2').html(pagecontent);
            port_info.find('tbody').html(port_detail_html);
        }});

}

function port_click_search_jump() {

    let page= $("#port_jump").val();


    port_click_search(parseInt(page-1))

}
function port_detial_search_jump(data,port_name1,now_page) {

    let page= $("#port_detial_jump").val();

    if (typeof data === "string") {
        data=JSON.parse(data);
    }
    data['page']=now_page;

    port_detail(data,port_name1,parseInt(page-1))

}
function port_reset() {
    $("#port_msg").val("");
    $("#port_host").val("");
    $("#port_name").val("");
    $("#port_command").val("");
    $("#port_user").val("");
    $("#port_level").val("");
    port_click_search(0);
}

$(document).off('click','#port_table>tbody>tr:nth-child(2n+1)').on('click','#port_table>tbody>tr:nth-child(2n+1)',function () {
    $(this).next().slideToggle(300);
    $(this).find('.slide_mark').toggleClass('iconRotate');
    let data = {};
    let port_msg = $("#port_msg").val();
    let port_host = $("#port_host").val();
    let port_name = $("#port_name").val();
    let port_command = $("#port_command").val();
    let port_user = $("#port_user").val();
    let port_level = $("#port_level").val();

    if (port_msg === undefined) {port_msg = ""}
    if (port_host === undefined) {port_host = ""}
    if (port_name === undefined) {port_name = ""}
    if (port_command === undefined) {port_command = ""}
    if (port_user === undefined) {port_user = ""}
    if (port_level === undefined) {port_level = ""}

    data['port_msg'] = port_msg;
    data['port_host'] = port_host;
    data['port_name'] = $(this).attr("port_id");
    data['port_command'] = port_command;
    data['port_user'] = port_user;
    data['port_level'] = port_level;
    // console.log($(this).attr("id"));
    //
    data['page'] = 0;
    port_detail(data,$(this).attr("id"),0);
});

/*
* port图表
* */
function port_chart() {
    console.log('port_chart');
    $.ajax({
        url: "assets/query_port_chart",
        type: 'GET',
        // data: data,
        //dataType: "json",
        success: function (data_list) {

            console.log(data_list["data"]['agent_port_num'])
            agent_port_num_echart('agent_port_num_div',data_list['data']['agent_port_num'])
            agent_port_num_echart('port_num_div',data_list['data']['port_num'])

        }})
}
function agent_port_num_echart(div,data) {
    var chart = echarts.init(document.getElementById(div));
    var datares = [];

    for (x in data) {
        datares.push({'name':data[x][0],'value':data[x][1]})
    }
    var option = {
        tooltip : {
            trigger: 'item',
            formatter: "{b} : {c} ({d}%)"
        },
        series : [
            {
                name: '数量',
                type: 'pie',
                radius : ['40%','70%'],
                center: ['50%', '55%'],
                data:datares,
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };

    chart.setOption(option);
}