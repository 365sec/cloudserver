function server_click(page) {
    /*
    * 服务器管理被点击
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
                    let html = '<h1 class="page-title" ><i class="iconfont">&#xe73b;</i>服务器管理</h1>';
                    html += '<div class="card">';
                    html += '<div class = "btngroup"><div  class="btn" onclick="javascript:void(0)" >添加主机</div></div>'
                    html += '<div class="card-body">';
                    html += '<table class="table table-bordered">';
                    html += '<thead>';
                    html += '<tr>';
                    html += '<th>服务器名称</th>';
                    html += '<th>操作系统</th>';
                    html += '<th>IP地址</th>';
                    html += '<th>外网IP</th>';
                    html += '<th>服务器状态</th>';
                    html += '<th>所属分组</th>';
                    html += '<th>风险评估</th>';
                    html += '</tr>';
                    html += '</thead>';
                    html += '<tbody>';
                    for (x in data) {
                        html += '<tr>';
                        data[x] = JSON.parse(data[x]);
                        let agent_id = data[x]['agent_id'];

                        html += '<td><a class="detail-a-server" href="javascript:void(0)" data-name="' + agent_id + '"   >' + data[x]['agent_id'] + '</a> </td>';
                        html += '<td>' + data[x]['os'] + '</td>';
                        html += '<td>' + data[x]['register_ip'] + '</td>';
                        html += '<td>' + data[x]['register_ip'] + '</td>';
                        if (data[x]['online'] == '在线') {
                            html += '<td><img src = "/static/images/online.png" style="width: 12px;">' + data[x]['online'] + '</td>';
                        } else {
                            html += '<td><img src = "/static/images/offline.png" style="width: 12px;">' + data[x]['online'] + '</td>';
                        }
                        html += '<td>' + data[x]['version'] + '</td>';
                        html += '<td>' + data[x]['server_type'] + '</td>';
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
$(document).on("click", ".detail-a-server", function () {
    let id = $(this).attr("data-name");
    $.ajax({
        url: 'server_manage_detail',
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

            //安全设置
            application_security();

            // 网站详情
            server_website_list(1);

            // 黑白名单
            black_white_list();
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

// 安全设置
function application_security(){
    let application_security_table_table = [['Web应用','80','IIS','8.5','微软公司的Windows平台Web服务器软件',[['插件',1],['强制访问控制',0],['端口防护',0],['防暴力破解',1]]],
        ['Web应用','81','IIS2','8.5','微软公司的Windows平台Web服务器软件',[['插件',0],['端口防护',0],['防暴力破解',1]]],
        ['Web应用','82','IIS3','8.5','微软公司的Windows平台Web服务器软件',[['插件',1],['强制访问控制',0],['端口防护',1]]]];
    let application_security_table = '';
    for(let j=0,len = application_security_table_table.length;j<len;j++){

        application_security_table +='<tr><td>'+application_security_table_table[j][0]+'</td>'+
            '<td>'+application_security_table_table[j][1]+'</td>'+
            '<td>'+application_security_table_table[j][2]+'</td>'+
            '<td>'+application_security_table_table[j][3]+'</td>'+
            '<td style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">'+application_security_table_table[j][4]+'</td><td style="position: relative">';
        for(let i = 0;i<application_security_table_table[j][5].length;i++) {
            switch (application_security_table_table[j][5][i][0]) {
                case '插件':
                    if (application_security_table_table[j][5][i][1]) {
                        application_security_table += '<i class="iconfont" data-situation="on" data-tip="plugin" style="color: #00a5e3">&#xe61e;</i>';
                    }else {
                        application_security_table += '<i class="iconfont" data-situation="off" data-tip="plugin" style="color: #cccccc">&#xe61e;</i>';
                    }
                    break;
                case '强制访问控制':
                    if (application_security_table_table[j][5][i][1]) {
                        application_security_table += '<i class="iconfont" data-situation="on" data-tip="access" style="color: #00a5e3">&#xe603;</i>';
                    }else {
                        application_security_table += '<i class="iconfont" data-situation="off" data-tip="access" style="color: #cccccc">&#xe603;</i>';
                    }

                    break;
                case '端口防护':
                    if (application_security_table_table[j][5][i][1]) {
                        application_security_table += '<i class="iconfont" data-situation="on" data-tip="port" style="color: #00a5e3">&#xe835;</i>';

                    }else {
                        application_security_table += '<i class="iconfont" data-situation="off" data-tip="port" style="color: #cccccc">&#xe835;</i>';
                    }

                    break;
                case '防暴力破解':
                    if (application_security_table_table[j][5][i][1]) {
                        application_security_table += '<i class="iconfont" data-situation="on" data-tip="violence" style="color: #00a5e3">&#xe605;</i>';
                    }else {
                        application_security_table += '<i class="iconfont" data-situation="off" data-tip="violence" style="color: #cccccc">&#xe605;</i>';
                    }
                    break;
            }

        }
        application_security_table +='</td>';

    }

    $('#application_security_table>tbody').html(application_security_table);
    $("#application_security_table tbody tr td>i").hover(function() {
        // data_type = $(this).attr('data-tip');
        let ndiv = '<div class="dialogbox"><p style="width: 200px;white-space:pre-wrap;"><span>IIS</span>插件</p>' +
            '<p><span>防护已开启</span><a href="#" style="color: #63C5EA;margin-left: 5px;">点击关闭</a></p>' +
            '<p style="white-space:pre-wrap;">官方支持的扩展模块插件,用于增强此服务的安全性.</p></div>';
        $(this).parent().append(ndiv);
    }, function() {
        $(".dialogbox").remove();
    });
    $("#application_security_table tbody tr td>i").click(function() {
        let html = `<div class="layout-title">操作确认：</div>
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
        <form action="post">
            <div style="font-size: 16px;text-align: center;line-height: 180px;"><span>确认需要安装Web应用IIS的插件吗</span></div>
            <div class='layout-btn'>
<!--                点击执行操作-->
                <div class="btn layout-close" onclick="">确定</div>
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
}

// 常用开关
function toogle(th){
    var ele = $(th).find(".btn_fath");
    if(ele.attr("data-state") == "on"){
        ele.animate({left: "-57px"}, 300, function(){
            ele.attr("data-state", "off");
            //关闭执行
        });
        $(th).removeClass("on").addClass("off");
    }else if(ele.attr("data-state") == "off"){
        ele.animate({left: '-3px'}, 300, function(){
            $(this).attr("data-state", "on");
            //开启执行
        });
        $(th).removeClass("off").addClass("on");
    }
}

// 基线检查
// 展开箭头的方向
$(document).on('click','.panel-title>a',function(){
    let iconChevron = $(this).find('.slide_mark');
    if (iconChevron.hasClass('iconRotate')) {
        iconChevron.removeClass('iconRotate');
    } else {
        iconChevron.addClass('iconRotate');
    }
})
// 批量操作确认弹框
$(document).on('click','.check_box',function () {
    let html = `<div class="layout-title">操作确认：</div>
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
        <form action="post">
            <div style="font-size: 16px;text-align: center;line-height: 180px;"><span>您确定要`+$(this).text()+`吗？</span></div>
            <div class='layout-btn'>
                <div class="btn layout-close" onclick="`+$(this).attr('data-tip')+`()">确定</div>
                <div class="btn layout-close" onclick="javascript:void(0)">取消</div>
            </div>
        </form>`;
    $('.shade>.layout').html(html);
    actionIn(".layout", 'action_scale', .3, "");
    $(".shade").css({
        visibility: "visible"
    });
    event.stopPropagation(); //阻止事件向上冒泡
})
function check_ignore() {
// 执行操作
    let html = `
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
        <div style="font-size: 16px;text-align: center;line-height: 180px;"><span>操作成功</span></div>`;
    $('.shade>.layout').html(html);
    actionIn(".layout", 'action_scale', .3, "");
    $(".shade").css({
        visibility: "visible"
    });
    event.stopPropagation(); //阻止事件向上冒泡
}
function check_repair() {
// 执行操作
    let html = `
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
        <div style="font-size: 16px;text-align: center;line-height: 180px;"><span>操作成功</span></div>`;
    $('.shade>.layout').html(html);
    actionIn(".layout", 'action_scale', .3, "");
    $(".shade").css({
        visibility: "visible"
    });
    event.stopPropagation(); //阻止事件向上冒泡
}
function check_del() {
// 执行操作
    let html = `
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
        <div style="font-size: 16px;text-align: center;line-height: 180px;"><span>操作成功</span></div>`;
    $('.shade>.layout').html(html);
    actionIn(".layout", 'action_scale', .3, "");
    $(".shade").css({
        visibility: "visible"
    });
    event.stopPropagation(); //阻止事件向上冒泡
}
// 资源监控


//网站详情
function server_website_list(now_page){
    max_size = 3;
    if (now_page == null || now_page < 1) {
        now_page = 1;
    }
    if (now_page > max_size) {
        now_page = max_size;
    }
    let server_website_list_data = [['111','172.16.39.245',' ','未分组','2019-04-29 17:51:06'],
        ['222','172.16.39.245','','未分组','2019-04-29 17:51:06'],
        ['333','172.16.39.245','','未分组','2019-04-29 17:51:06'],
        ['444','172.16.39.245','','未分组','2019-04-29 17:51:06'],
        ['555','172.16.39.245','','未分组','2019-04-29 17:51:06'],
        ['666','172.16.39.245','','未分组','2019-04-29 17:51:06']
    ];
    let server_website_list = '';
    for(let j=0,len = server_website_list_data.length;j<len;j++){
        server_website_list='<tr>' +
                            ' <td style="width: 46px;padding: 14px;">' +
                            '    <div class="server_website_list_checkbox">' +
                            '    <input class="regular_checkbox" id="'+server_website_list_data[j][0]+'" type="checkbox" name="server_website_list_checkall">' +
                            '    <label for="'+server_website_list_data[j][0]+'"></label>' +
                            '    </div>' +
                            ' </td>' +
                            '<td><a class="detail-a-website" href="javascript:void(0)" data-name="' + server_website_list_data[j][0] + '"   >' + server_website_list_data[j][1] + '</a></td>'+
                            '<td>'+server_website_list_data[j][2]+'</td>'+
                            '<td>'+server_website_list_data[j][3]+'</td>'+
                            '<td>'+server_website_list_data[j][4]+'</td>';
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
    $('#server_website_list_table>tbody').html(server_website_list);
}
// 打开网站详情删除弹窗
$(document).on("click", "#server_website_list_del", function() {
    let id = $(this).attr("id");
    let html = `<div class="layout-title">操作确认：</div>
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
        <form action="post">
            <div style="font-size: 16px;text-align: center;line-height: 180px;"><span>您确定要删除该该网站信息吗？</span></div>
            <div class='layout-btn'>
                <div class="btn layout-close" onclick="server_website__del(`+id+`)"">确定</div>
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
// 黑白名单
function black_white_list(){
    let black_list_data = ['117.158.142.120','117.158.142.121','117.158.142.122','117.158.142.123'];
    let white_list_data = ['117.158.142.127','117.158.142.126','117.158.142.125','117.158.142.124'];

    let black_list_table = '';
    for(let j=0,len = black_list_data.length;j<len;j++){
        black_list_table +='<tr><td style="width: 46px;padding: 14px;">\n' +
            '                   <div class="black_white_checkbox"><input class="regular_checkbox" name="black_list" type="checkbox" id="'+black_list_data[j]+'"> <label for="'+black_list_data[j]+'"></label> </div>' +
            '               </td>' +
            '<td>'+black_list_data[j]+'</td>'+
            '<td><a class="black_list_release" id="'+black_list_data[j]+'">解除</a></td></tr>';
        }
    black_list_table +='</td>';
    $('#black_list_table>tbody').html(black_list_table);

    let white_list_table = '';
    for(let j=0,len = white_list_data.length;j<len;j++){
        white_list_table +='<tr><td style="width: 46px;padding: 14px;">\n' +
            '                  <div class="black_white_checkbox"><input class="regular_checkbox" type="checkbox" name="white_list" id="'+white_list_data[j]+'"> <label for="'+white_list_data[j]+'"></label> </div>'+
            '               </td>' +
            '<td>'+white_list_data[j]+'</td>'+
            '<td><a class="white_list_release" id="'+white_list_data[j]+'">解除</a></td></tr>';
    }
    white_list_table +='</td>';
    $('#white_list_table>tbody').html(white_list_table);
}

// 黑白名单展开收起
function black_white_slide(obj) {
    var cont=$(obj).find('span').html();
    if(cont == '收起'){
        $(obj).find('span').html('展开');
    }else{
        $(obj).find('span').html('收起');
    }
    let iconChevron = $(obj).find('.slide_mark');
    if (iconChevron.hasClass('iconRotate')) {
        iconChevron.removeClass('iconRotate');
    } else {
        iconChevron.addClass('iconRotate');
    }
    let target = '#'+$(obj).attr('data-tip') + ' tbody'
    $(target).slideToggle();
}

// 全选按钮
function checkall(obj) {
    var flag=$(obj).prop('checked');
    var list=document.getElementsByName($(obj).attr('id'));
    for(var i=0;i<list.length;i++){
        list[i].checked=flag;
    }
}

// 添加黑名单
$(document).on('click','#add_black',function () {
    let id = $(this).attr("id");
    let html = `<div class="layout-title">添加黑名单</div>
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
        <form action="post">
            <div style="font-size: 16px;text-align: center;line-height: 180px;">
                <span class="red">*</span>
                <label>ip地址</label>
                <input type="text" placeholder="请输入IP或IP段,IP段中间用 “-”分隔" id="ip" name="ip" >
            </div>
            
            <div class='layout-btn'>
                <div class="btn layout-close" onclick="black_list_add(`+id+`)"">提交</div>
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
// 解除黑名单
$(document).on('click','.black_list_release',function () {
    let id = $(this).attr("id");
    let html = `<div class="layout-title">操作确认：</div>
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
        <form action="post">
            <div style="font-size: 16px;text-align: center;line-height: 180px;"><span>确认要删除选中的数据吗？</span></div>
            <div class='layout-btn'>
                <div class="btn layout-close" onclick="black_list_release(`+id+`)"">确定</div>
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
// 批量解除黑名单
$(document).on('click','#releaseall_black',function () {
    let id = $(this).attr("id");
    let html = `<div class="layout-title">操作确认：</div>
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
        <form action="post">
            <div style="font-size: 16px;text-align: center;line-height: 180px;"><span>确认要删除选中的数据吗？</span></div>
            <div class='layout-btn'>
                <div class="btn layout-close" onclick="black_list_releaseall(`+id+`)"">确定</div>
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

// 添加白名单
$(document).on('click','#add_white',function () {
    let id = $(this).attr("id");
    let html = `<div class="layout-title">操作确认：</div>
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
        <form action="post">
            <div style="font-size: 16px;text-align: center;line-height: 180px;">
                <span class="red">*</span>
                <label>ip地址</label>
                <input type="text" placeholder="请输入IP或IP段,IP段中间用 “-”分隔" id="ip" name="ip" >
            </div>
            <div class='layout-btn'>
                <div class="btn layout-close" onclick="white_list_add(`+id+`)"">确定</div>
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
// 解除白名单
$(document).on('click','.white_list_release',function () {
    let id = $(this).attr("id");
    let html = `<div class="layout-title">操作确认：</div>
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
        <form action="post">
            <div style="font-size: 16px;text-align: center;line-height: 180px;"><span>确认要删除选中的数据吗？</span></div>
            <div class='layout-btn'>
                <div class="btn layout-close" onclick="white_list_release(`+id+`)"">确定</div>
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
// 批量解除白名单
$(document).on('click','#releaseall_white',function () {
    let id = $(this).attr("id");
    let html = `<div class="layout-title">操作确认：</div>
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
        <form action="post">
            <div style="font-size: 16px;text-align: center;line-height: 180px;"><span>确认要删除选中的数据吗？</span></div>
            <div class='layout-btn'>
                <div class="btn layout-close" onclick="white_list_releaseall(`+id+`)"">确定</div>
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

