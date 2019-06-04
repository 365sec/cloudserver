function website_click(page) {
    /*
    * 网站管理被点击
    * */
    //let page=1;
    $.ajax( {
        url: 'manage',
        dataType:"html",
        type: "get",
        success: function(res){
            let secvalue = $(this).children().attr("data-secvalue");
            $("#div_container").html($(res));
            if (page == null || page < 1) {
                page = 1;
            }
            $(this).addClass("active router-link-active").siblings().removeClass("active router-link-active");
            $.ajax({
                url: "agent/query/",
                type: 'POST',
                data: {
                    "page": page
                },
                //dataType: "json",
                success: function (data_list) {
                    data = data_list['agents'];
                    let now_page = data_list['page'];
                    let max_size = data_list['max_size'];
                    // data = data.replace(/}{/g, "}****{").split("****");
                    let div_container = $(".manageDiv");
                    let div_container2 = $(".table-manage");
                    div_container.text("");
                    let html = '<h1 class="page-title" ><i class="iconfont">&#xe73b;</i>网站管理</h1>';
                    html += '<div class="card">';
                    html += '<div class = "btngroup"><div  class="btn" onclick="javascript:void(0)" >添加主机</div></div>'
                    html += '<div class="card-body">';
                    html += '<table class="table table-bordered">';
                    html += '<thead>';
                    html += '<tr>';
                    html += '<th>网站名称</th>';
                    html += '<th>标签</th>';
                    html += '<th>所属服务器</th>';
                    html += '<th>所属分组</th>';
                    html += '<th>更新时间</th>';
                    html += '</tr>';
                    html += '</thead>';
                    html += '<tbody>';
                    for (x in data) {
                        html += '<tr>';
                        data[x] = JSON.parse(data[x]);
                        let agent_id = data[x]['agent_id'];

                        html += '<td><a class="detail-a-website" href="javascript:void(0)" data-name="' + agent_id + '"   >' + data[x]['register_ip'] + '</a> </td>';
                        html += '<td>' + data[x]['os'] + '</td>';
                        html += '<td>' + data[x]['server_type'] + '</td>';
                        html += '<td>' + data[x]['agent_id'] + '</td>';
                        html += '<td>' + data[x]['version'] + '</td>';
                        // html += '<td>' + data[x]['server_type'] + '</td>';
                        html += '</tr>';
                    }
                    html += '</tbody>';
                    html += '</table>';
                    html += '</div>';


                    html += '<ul role="menubar" aria-disabled="false" aria-label="Pagination" class="pagination b-pagination pagination-md justify-content-center">';
                    html += '<a href="javascript:void(0);" onclick="server_click(' + (now_page - 1) + ')">上一页</a>';
                    html += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp';
                    html += '<a href="javascript:void(0);">' + now_page + "/" + max_size + '</a>';
                    html += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp';
                    html += '<a href="javascript:void(0);" onclick="server_click(' + (now_page + 1) + ')">下一页</a>';
                    //html += '<input id = "agent_jump" value="'+now_page+'" />';
                    //  html += '<a href="javascript:void(0);" onclick="agent_jump()">跳转</a>';
                    html += '</ul>';
                    div_container.append(html);
                }
            });
            $(".container1").css('background-color', '#f0f2f5');

        }

    });
}
//添加主机弹窗
//打开弹窗
$(document).on("click", ".manageDiv .card .btngroup .btn", function() {
    actionIn(".layout", 'action_scale', .3, "");
    $(".shade").css({
        visibility: "visible"
    });
    event.stopPropagation(); //阻止事件向上冒泡
});

//详情
$(document).on("click", ".detail-a-website", function () {
    let id = $(this).attr("data-name");
    $.ajax({
        url: 'website_manage_detail',
        type: 'get',
        dataType: 'html',
        success: function (res) {
            $('#div_container').html($(res));
            $('.page-title').html('主机：'+id);
            $('#machine_name_view span').html(id);

            // 安全分析
            chart_attack_trend();

            // 事件处理
            event_treat(1);

        }
    });
});

// 安全分析
function chart_attack_trend(){
    // chart_attack_trend 服务器攻击趋势
    let tday = [["2:00", 21273],["4:00", 12273],["6:00", 15273],["8:00", 6273],["10:00", 8273],["12:00", 10273]];
    linechart(tday,'chart_attack_trend');

    let attack = [["1", 21273],["没有攻击", 12273]];
    piechart(attack,'chart_attack_kind');

    // 攻击类型攻击次数
    let ana_attack = '';
    for(let i = 0;i<12;i++){
        ana_attack +='<tr><td>'+parseInt(Math.random()*500+1)+'</td>';
        ana_attack +='<td>'+parseInt(Math.random()*500+1)+'</td></tr>';
    }
    $('#ana_attack').html(ana_attack);

    // 被攻击网站列表
    let web_attack = '';
    for(let i = 0;i<12;i++){
        web_attack +='<tr><td style="width: 70%">172.16.39.245'+parseInt(Math.random()*500+1)+'</td>';
        web_attack +='<td>'+parseInt(Math.random()*500+1)+'</td></tr>';
    }
    $('#web_attack').html(web_attack);
}
//安全分析服务器攻击趋势tab切换
$(document).on('click','.server_detail_tab',function () {
    let tday = [["2:00", 21273],["4:00", 12273],["6:00", 15273],["8:00", 6273],["10:00", 8273],["12:00", 10273]];
    let yday = [["2:00", 1273],["4:00", 2273],["6:00", 15273],["8:00", 6273],["10:00", 8273],["12:00", 10273]];
    let week = [["2:00", 21273],["4:00", 12273],["6:00", 15273],["8:00", 273],["10:00", 8273],["12:00", 1273]];
    let value = $(this).attr('data-type');
    let data = [];
    switch (value) {
        case 'tday' :
            data = tday;
            break;
        case 'yday' :
            data = yday;
            break;
        case 'week' :
            data = week;
            break;
    }
    let linechart = echarts.init(document.getElementById('chart_attack_trend'))
    let option = linechart.getOption();
    option.series[0].data = data;
    linechart.setOption(option);
})


// 事件处理
function event_treat(now_page){
    max_size = 3;
    if (now_page == null || now_page < 1) {
        now_page = 1;
    }
    if (now_page > max_size) {
        now_page = max_size;
    }
    let alarm_event_list_table_data = [['111','2019-04-29 17:30:36','发现未知Webshell','可疑进程 C:\\Windows\\System32\\WerFault.exe 创建二进制文件 c:\\windows\\temp\\wax7507.tmp','高危','未处理'],
        ['222','2019-04-29 17:30:36','发现已知Webshell','可疑进程 C:\\Windows\\System32\\WerFault.exe 创建二进制文件 c:\\windows\\temp\\wax7507.tmp','一般','已处理'],
        ['333','2019-04-29 17:30:36','发现已知Webshell','可疑进程 C:\\Windows\\System32\\WerFault.exe 创建二进制文件 c:\\windows\\temp\\wax7507.tmp','一般','已处理'],
        ['444','2019-04-29 17:30:36','发现已知Webshell','可疑进程 C:\\Windows\\System32\\WerFault.exe 创建二进制文件 c:\\windows\\temp\\wax7507.tmp','一般','已处理'],
        ['555','2019-04-29 17:30:36','发现已知Webshell','可疑进程 C:\\Windows\\System32\\WerFault.exe 创建二进制文件 c:\\windows\\temp\\wax7507.tmp','一般','未处理'],
        ['666','2019-04-29 17:30:36','发现已知Webshell','可疑进程 C:\\Windows\\System32\\WerFault.exe 创建二进制文件 c:\\windows\\temp\\wax7507.tmp','一般','已处理'],
        ['777','2019-04-29 17:30:36','发现已知Webshell','可疑进程 C:\\Windows\\System32\\WerFault.exe 创建二进制文件 c:\\windows\\temp\\wax7507.tmp','一般','已处理'],
        ['888','2019-04-29 17:30:36','发现已知Webshell','可疑进程 C:\\Windows\\System32\\WerFault.exe 创建二进制文件 c:\\windows\\temp\\wax7507.tmp','一般','已处理'],
        ['999','2019-04-29 17:30:36','发现已知Webshell','可疑进程 C:\\Windows\\System32\\WerFault.exe 创建二进制文件 c:\\windows\\temp\\wax7507.tmp','一般','已处理'],
        ['000','2019-04-29 17:30:36','发现已知Webshell','可疑进程 C:\\Windows\\System32\\WerFault.exe 创建二进制文件 c:\\windows\\temp\\wax7507.tmp','一般','未处理'],
        ['123','2019-04-29 17:30:36','发现已知Webshell','可疑进程 C:\\Windows\\System32\\WerFault.exe 创建二进制文件 c:\\windows\\temp\\wax7507.tmp','一般','已处理']
    ];
    let alarm_event_list_table = '';
    for(let j=0,len = alarm_event_list_table_data.length;j<len;j++){
        alarm_event_list_table +='<tr><td>'+alarm_event_list_table_data[j][1]+'</td>'+
            '<td>'+alarm_event_list_table_data[j][2]+'</td>'+
            '<td style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">'+alarm_event_list_table_data[j][3]+'</td>';
        switch (alarm_event_list_table_data[j][4]) {
            case '高危':
                alarm_event_list_table +='<td><span class="label label_custom label_high" >'+alarm_event_list_table_data[j][4]+'</span></td>';
                break;
            case '一般':
                alarm_event_list_table +='<td><span class="label label_custom label_norm" >'+alarm_event_list_table_data[j][4]+'</span></td>';
                break;
        }
        alarm_event_list_table +='<td><a class="custom_a event_detail detail-a" href="javascript:void(0)" data-name="eyJzZXJ2ZXJfaG9zdG5hbWUiOiJXSU4tVjQ4U084Q1IzNEsiLCJldmVudF90eXBlIjoicmFzcF9hdHRhY2siLCJhdHRhY2tfc291cmNlIjoiMTcyLjE2LjM5LjE1IiwidGhyZWF0X2xldmVsIjoi6auY5Y2xIiwiYXR0YWNrX3R5cGUiOiJIVFRQ5Y2P6K6u5pS75Ye7IiwiY2l0eSI6IuWxgOWfn+e9kSIsInN5c3RlbV91c2VyIjoiQWRtaW5pc3RyYXRvciIsImV2ZW50X3RpbWUiOiIyMDE5LTA1LTE2IDIzOjQ5OjI0IiwiZXZlbnRfaWQiOjEwMTUsInBsdWdpbl9jb25maWRlbmNlIjo5MCwic2VydmVyX2lwIjoiMTcyLjE2LjM5LjI2IiwibWV0aG9kIjoiUFVUIiwicGx1Z2luX21lc3NhZ2UiOiLmraPlnKjlsJ3or5Xkvb/nlKhIVFRQIHB1dOaWueazlS4iLCJib2R5IjoiIiwic3RhY2tfdHJhY2UiOiJvcmcuYXBhY2hlLmNhdGFsaW5hLmNvcmUuQXBwbGljYXRpb25GaWx0ZXJDaGFpbi5kb0ZpbHRlcihBcHBsaWNhdGlvbkZpbHRlckNoYWluLmphdmEpXG5vcmcuYXBhY2hlLmNhdGFsaW5hLmNvcmUuU3RhbmRhcmRXcmFwcGVyVmFsdmUuaW52b2tlKFN0YW5kYXJkV3JhcHBlclZhbHZlLmphdmE6Mjc1KVxub3JnLmFwYWNoZS5jYXRhbGluYS5jb3JlLlN0YW5kYXJkQ29udGV4dFZhbHZlLmludm9rZShTdGFuZGFyZENvbnRleHRWYWx2ZS5qYXZhOjE2MSlcbm9yZy5hcGFjaGUuY2F0YWxpbmEuY29yZS5TdGFuZGFyZEhvc3RWYWx2ZS5pbnZva2UoU3RhbmRhcmRIb3N0VmFsdmUuamF2YToxNTUpXG5vcmcuYXBhY2hlLmNhdGFsaW5hLnZhbHZlcy5FcnJvclJlcG9ydFZhbHZlLmludm9rZShFcnJvclJlcG9ydFZhbHZlLmphdmE6MTAyKVxub3JnLmFwYWNoZS5jYXRhbGluYS5jb3JlLlN0YW5kYXJkRW5naW5lVmFsdmUuaW52b2tlKFN0YW5kYXJkRW5naW5lVmFsdmUuamF2YToxMDkpXG5vcmcuYXBhY2hlLmNhdGFsaW5hLmNvbm5lY3Rvci5Db3lvdGVBZGFwdGVyLnNlcnZpY2UoQ295b3RlQWRhcHRlci5qYXZhOjM2OClcbm9yZy5hcGFjaGUuY295b3RlLmh0dHAxMS5IdHRwMTFQcm9jZXNzb3IucHJvY2VzcyhIdHRwMTFQcm9jZXNzb3IuamF2YTo4NzcpXG5vcmcuYXBhY2hlLmNveW90ZS5odHRwMTEuSHR0cDExUHJvdG9jb2wkSHR0cDExQ29ubmVjdGlvbkhhbmRsZXIucHJvY2VzcyhIdHRwMTFQcm90b2NvbC5qYXZhOjY3MSlcbm9yZy5hcGFjaGUudG9tY2F0LnV0aWwubmV0LkpJb0VuZHBvaW50JFdvcmtlci5ydW4oSklvRW5kcG9pbnQuamF2YTo5MzApXG5qYXZhLmxhbmcuVGhyZWFkLnJ1bihUaHJlYWQuamF2YTo3NDQpXG4iLCJwcm9jZXNzX3BhdGgiOiJDOlxcUHJvZ3JhbSBGaWxlc1xcSmF2YVxcamRrMS43LjBfNDVcXGpyZVxcamF2YS5leGUiLCJzZXJ2ZXJfdHlwZSI6Impib3NzIGVhcCIsInBsdWdpbl9uYW1lIjoib2ZmaWNhbCIsInRhcmdldF9wb3J0Ijo5MDgwLCJhZ2VudF9pZCI6IjA2MTdmZDkyNzQ2MjUyNzEiLCJwYXRoIjoiL2Noa3Z1bG5fY3AudHh0Iiwic2VydmVyX3ZlcnNpb24iOiIxLjEuMS5HQSIsImludGVyY2VwdF9zdGF0ZSI6IuaLpuaIqiIsInRhcmdldCI6IjE3Mi4xNi4zOS4yNiIsInVybCI6Imh0dHA6Ly8xNzIuMTYuMzkuMjY6OTA4MC9jaGt2dWxuX2NwLnR4dCIsInVzZXJfYWdlbnQiOiJweXRob24tcmVxdWVzdHMvMi4yMS4wIiwiZXZlbnRfaXNzdWVfaWQiOiI1MWU5ZWUwOGJhY2Y0YTZiYWM1OWQwMDBiZDMxODU2YiIsInJlcXVlc3RfaWQiOiJmMDExN2Y4ZmIwMTk0ZTIxODZmNjVmOGUxZTM5YzBkYSIsImF0dGFja19wYXJhbXMiOiJ7fSIsInJlZmVyZXIiOiIiLCJhdHRhY2tfdHlwZTEiOiJyZXF1ZXN0In0=">查看报告</a></td>' ;
        if(alarm_event_list_table_data[j][5]== '未处理'){
            alarm_event_list_table +='<td><div class="deal_cls btn btn_untreated"  id = "btn_'+alarm_event_list_table_data[j][0]+'">'+alarm_event_list_table_data[j][5]+'</div></td></tr>';
        }else{
            alarm_event_list_table +='<td><div class="btn" disabled id = "btn_'+alarm_event_list_table_data[j][0]+'">'+alarm_event_list_table_data[j][5]+'</div></td></tr>';
        }
        let page = '<ul role="menubar" aria-disabled="false" aria-label="Pagination" class="pagination b-pagination pagination-md justify-content-center">'+
            '<a href="javascript:void(0);" onclick="event_treat(' + (now_page - 1) + ')">上一页</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp'+
            '<a href="javascript:void(0);">' + now_page + "/" + max_size + '</a>'+
            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp'+
            '<a href="javascript:void(0);" onclick="event_treat(' + (now_page + 1) + ')">下一页</a>'+
            '<input id = "agent_jump" value="'+now_page+'" />'+
            '<a href="javascript:void(0);" onclick="event_treat()">跳转</a>'+
            '</ul>';
        $('.page').html(page);
    }
    $('#alarm_event_list_table>tbody').html(alarm_event_list_table);
}

//事件处理弹窗
//打开事件处理弹窗
$(document).on("click", ".btn_untreated", function() {
    let id = $(this).attr("id");
    let html = `<div class="layout-title">操作确认：</div>
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
        <form action="post">
            <div style="font-size: 16px;text-align: center;line-height: 180px;"><span>您确定要处理此事件吗？</span></div>
            <div class='layout-btn'>
                <div class="btn layout-close" onclick="treat(`+id+`)"">确定</div>
                <div class="btn layout-close" onclick="javascript:void(0)">取消</div>
            </div>
        </form>`;
    $('.shade>.layout').html(html);
    actionIn(".layout", 'action_scale', .3, "");
    $(".shade").css({
        visibility: "visible"
    });
    event.stopPropagation(); //阻止事件向上冒泡
});
//事件处理事件
function treat(obj) {
    $(obj).attr('disabled','true');
    $(obj).removeClass('btn_untreated');
}
