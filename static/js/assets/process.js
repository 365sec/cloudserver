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
            process_chart();
            process_click_search(page);
            $(".container1").css('background-color', '#f0f2f5');
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
    let hostname= []; //主机列表
    let process_list = []; //进程列表
    let now_page = 0;
    let max_size;
    $.ajax({
        url: "assets/query_process_num",
        type: 'POST',
        data: data,
        async:false,
        //dataType: "json",
        success: function (data_list) {
            console.log(data_list)
            hostname=data_list['hostname'];
            process_list=data_list['process_list'];
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
            let select_div = $("#process_select_div");
            let html_select = "";
            html_select = '<div>';
            html_select += '<div id="" class="search_btngroup">';
            html_select += '<div class="search_button" >';

            html_select += '<div class="search_button">';
            html_select += '<select id="process_host" class="form-btn" style="width: 200px">';
            html_select += '<option value="" >' + "--请选择主机名称--" + '</option>';
            for (agent_id in hostname) {
                html_select += '<option value="' + agent_id + '" >' + hostname[agent_id][0]+"("+hostname[agent_id][1] +")"+ '</option>'
            }
            html_select += '</select></div>';
            html_select += '<input id="process_name" placeholder="进程名称" value="' + process_name + '" />';
            html_select += '<input id="process_command" placeholder="启动命令" value="' + process_command + '" />';
            html_select += '<input id="process_user" placeholder="启动用户" value="' + process_user + '" /></div>';

            html_select += '<div class="search_button">';
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
        let next_page='<a href="javascript:void(0);" onclick="process_click_search(' + (now_page + 1) + ')">下一页</a>';
        if (parseInt(now_page)+1===parseInt(max_size))
        {
             next_page='<a href="javascript:void(0);" onclick="process_click_search(' + (now_page + 1) + ')"></a>';
        }
            let pagecontent = '<ul role="menubar" aria-disabled="false" aria-label="Pagination" class="pagination b-pagination pagination-md justify-content-center">' +
                '<a href="javascript:void(0);" onclick="process_click_search(' + (now_page - 1)+')">上一页</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp' +
                '<a href="javascript:void(0);">' + (now_page+1) + "/" + max_size + '</a>' +
                '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp' +
                next_page +
                '<input id = "process_jump" value="' + (now_page+1) + '" />' +
                '<a href="javascript:void(0);" onclick="process_click_search_jump()">跳转</a>' +
                '</ul>';
            $('#process_table>tbody').html('');
            for(let i=0;i<process_list.length;i++) {
                let base_id=process_list[i][0];
                base_id=hex_md5(base_id);
                let process_table = '';
                process_table += '<tr id="'+ base_id+'" process_id="'+ process_list[i][0]+'">' +
                    '<td width="60%" >进程：<span>'+process_list[i][0]+'</span></td>' +
                    '<td width="40%">主机数：<span>'+process_list[i][1]+'</span></td>' +
                    '<td width="45px" style="text-align: center"><i class="iconfont slide_mark">&#xe64a;</i></td>' +
                    '</tr>' +
                    '<tr style="display: none">' +
                    '<td colspan="3" >' +
                    '<table class="table table-striped table-bordered table_fixed w100">' +
                    '<thead>' +
                    '<tr>' +
                    '<th width="15%">主机</th>' +
                    '<th width="20%">进程名</th>' +
                    '<th width="8%">进程ID</th>' +
                    '<th width="20%">进程路径</th>' +
                    '<th width="20%">启动命令</th>' +
                    '<th width="8%">用户</th>' +
                    '<th width="10%">是否管理员</th>' +
                    '</tr>' +
                    '</thead>' +
                    '<tbody>' +
                    '</tbody>' +
                    '</table><div class="paging2"></div>'+
                    '</td>' +
                    '</tr>';
                $('#process_table>tbody').append(process_table);

            }
            
            $('.paging').html(pagecontent);
}
function process_detail(data,process_name1,now_page) {
    // console.log(process_name1);
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
            let process_table_data = data_list['data'];
            let process_detail_html= '';
            for (let j = 0, len = process_table_data.length; j < len; j++) {
                let server_img;
                if (process_table_data[j]['os'].toLowerCase().indexOf("windows") !== -1){
                    server_img='<img src="/static/images/os_windows_on.png" style="width: 20px"/>';
                }else{
                    server_img='<img src="/static/images/os_linux_on.png" style="width: 20px"/>';
                }
                let command = process_table_data[j]['command'].replace(/\"/, "");
                process_detail_html += '<tr>' +
                    '<td class="port_add">'+server_img + '<div><p>' + process_table_data[j]['host_name'] + '</p><p>' + process_table_data[j]['host_ip'] + '</p></div></td>' +

                    '<td title="' + process_table_data[j]['name'] + '">' + process_table_data[j]['name'] + '</td>' +
                    '<td>' + process_table_data[j]['pid'] + '</td>' +
                    '<td title="' + process_table_data[j]['path'] + '">' + process_table_data[j]['path'] + '</td>' +

                    '<td title="' + command + '">' + process_table_data[j]['command'] + '</td>' +
                    '<td>' + process_table_data[j]['user'] + '</td>' +
                    '<td>' + process_table_data[j]['level'] + '</td>';
            }
            let str_data=JSON.stringify(data).replace(/"/g,'&quot;');

            let next_page='<a href="javascript:void(0);" onclick="process_detail(\''+str_data+'\',\'' +process_name1+'\',\''+ (now_page + 1)+'\')">下一页</a>';
            if (parseInt(now_page)+1===parseInt(max_size))
            {
                next_page='<a href="javascript:void(0);" onclick="process_detail(\''+str_data+'\',\'' +process_name1+'\',\''+ (now_page + 1)+'\')"></a>';
            }
            let pagecontent = '<ul role="menubar" aria-disabled="false" aria-label="Pagination" class="pagination b-pagination pagination-md justify-content-center">' +
                '<a href="javascript:void(0);" onclick="process_detail(\''+str_data+'\',\'' +process_name1+'\',\''+ (now_page - 1)+'\')">上一页</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp' +
                '<a href="javascript:void(0);">' + (now_page+1) + "/" + max_size + '</a>' +
                '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp' +
                next_page+
                '<input id = "process_detial_jump" value="' + (now_page+1) + '" />' +
                '<a href="javascript:void(0);" onclick="process_detial_search_jump(\''+str_data+'\',\'' +process_name1+'\',\''+ (0)+'\')">跳转</a>' +
                '</ul>';



            let process_info = $("#"+process_name1).next();
            process_info.find('.paging2').html(pagecontent);
            process_info.find('tbody').html(process_detail_html);
        }});

}

function process_click_search_jump() {

    let page= $("#process_jump").val();


    process_click_search(parseInt(page-1))

}
function process_detial_search_jump(data,process_name1,now_page) {

    let page= $("#process_detial_jump").val();

    if (typeof data === "string") {
        data=JSON.parse(data);
    }
    data['page']=now_page;

    process_detail(data,process_name1,parseInt(page-1))

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

$(document).off('click','#process_table>tbody>tr:nth-child(2n+1)').on('click','#process_table>tbody>tr:nth-child(2n+1)',function () {
    $(this).next().slideToggle(300);
    $(this).find('.slide_mark').toggleClass('iconRotate');
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
    data['process_name'] = $(this).attr("process_id");
    data['process_command'] = process_command;
    data['process_user'] = process_user;
    data['process_level'] = process_level;
    // console.log($(this).attr("id"));
    //
    data['page'] = 0;
    process_detail(data,$(this).attr("id"),0);
});

function process_chart() {
    console.log('process_chart');
    $.ajax({
        url: "assets/query_process_chart",
        type: 'GET',
        // data: data,
        //dataType: "json",
        success: function (data_list) {

            console.log(data_list["data"]);
            agent_process_num_echart_pie('agent_process_num_div',data_list['data']['agent_process_num']);
            agent_process_num_echart_bar('process_num_div',data_list['data']['process_num'])

        }})
}


// function agent_process_num_echart(div,data) {
//     var chart = echarts.init(document.getElementById(div));
//     var datares = [];
//
//     for (x in data) {
//         datares.push({'name':data[x][0],'value':data[x][1]})
//     }
//     var option = {
//         tooltip : {
//             trigger: 'item',
//             formatter: "{b} : {c} ({d}%)"
//         },
//         series : [
//             {
//                 name: '数量',
//                 type: 'pie',
//                 radius : ['50%','70%'],
//                 center: ['50%', '55%'],
//                 data:datares,
//                 itemStyle: {
//                     emphasis: {
//                         shadowBlur: 10,
//                         shadowOffsetX: 0,
//                         shadowColor: 'rgba(0, 0, 0, 0.5)'
//                     }
//                 }
//             }
//         ]
//     };
//
//     chart.setOption(option);
// }
// function agent_process_num_echart_bar(div,data) {
//     var chart = echarts.init(document.getElementById(div));
//     var datares = [];
//     let x_data=[];
//     let y_data=[];
//     for (x in data) {
//         datares.push({'name':data[x][0],'value':data[x][1]})
//         x_data.push(data[x][0])
//         y_data.push(data[x][1])
//     }
//     var option = {
//         tooltip : {
//             trigger: 'item',
//             formatter: "{b} : {c} ({d}%)"
//         },
//         xAxis: {
//             type: 'category',
//             data: x_data
//         },
//         yAxis: {
//             type: 'value'
//         },
//         series : [
//             {
//                 name: '数量',
//                 type: 'bar',
//                 radius : ['50%','70%'],
//                 center: ['50%', '55%'],
//                 data:y_data,
//                 itemStyle: {
//                     emphasis: {
//                         shadowBlur: 10,
//                         shadowOffsetX: 0,
//                         shadowColor: 'rgba(0, 0, 0, 0.5)'
//                     }
//                 }
//             }
//         ]
//     };
//
//     chart.setOption(option);
// }