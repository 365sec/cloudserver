function server_click(page) {
    /*
    * 服务器管理被点击
    * */
    //let page=1;
    $.ajax( {
        url: '/manage',
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
                url: "/server_agent/query/",
                type: 'POST',
                data: {
                    "page": page
                },
                //dataType: "json",
                success: function (data_list) {
                    if(data_list.hasOwnProperty('auth')){
                        window.location.href = '/login'
                    }
                    data = data_list['agents'];
                    let last_online=data_list['last_online'];
                    let now_page = data_list['page'];
                    let max_size = data_list['max_size'];
                    // data = data.replace(/}{/g, "}****{").split("****");
                    let div_container = $(".manageDiv");
                    let div_container2 = $(".table-manage");
                    div_container.text("");
                    let html = '<h1 class="page-title" ><i class="iconfont">&#xe73b;</i>服务器管理</h1>';

                    html += '<div class="card">';
                    /* html += '<div class = "btngroup"><div  class="btn" onclick="javascript:void(0)" data-toggle="modal" data-target="#add_host">添加主机</div></div>';*/
                    html += '<div class="card-body">';
                    html += '<div class="server_header">'
                    html += '<div>' +
                            '<div class="orbitron">'+last_online['last_1m']+'</div>' +
                            '<p>最近1分钟内在线主机</p>' +
                            '<div class="server_header_border red"></div>' +
                            '</div>' +
                            '<div>' +
                            '<div class="orbitron">'+last_online['last_10m']+'</div>' +
                            '<p>最近10分钟内在线主机</p>' +
                            '<div class="server_header_border yellow"></div>' +
                            '</div>' +
                            '<div>' +
                            '<div class="orbitron">'+last_online['last_30m']+'</div>' +
                            '<p>最近30分钟内在线主机</p>' +
                            '<div class="server_header_border green"></div>' +
                            '</div>' +
                            '</div >' +
                        '<div class="btnGroup">' +
                        '   <div class="table_select_div server_table_select_div">' +
                        '       <div class="btn btn_disabled" id="server_table_list_del">删除</div>' +
                        '   </div>' +
                        '</div>';
                    html += '<table class="table table-bordered table-striped table-hover">';
                    html += '<thead>';
                    html += '<tr>' +
                        '<th style="width: 46px;padding: 14px;">\n' +
                        '  <div class="server_list_checkbox"><input class="regular_checkbox check_all" id="server_table_list" type="checkbox"> <label for="server_table_list"></label> </div>' +
                        '</th>';
                    // html += '<th>AGENT_ID</th>';
                    html += '<th>服务器名称</th>';
                    html += '<th>操作系统</th>';
                    html += '<th>IP地址</th>';
                    html += '<th>外网IP</th>';
                    html += '<th>服务器状态</th>';
                    html += '<th>所属用户</th>';
                    html += '<th>标记</th>';
                    html += '<th>风险评分</th>';
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
                        let score=`${data[x]['score']} `;
                        if (data[x]['score'] > 80) {
                          //  score=`<td><span class="server_score green">${data[x]['score']}</span></td>`
                            score=`<td><span style="color: #2D952D"><strong>${data[x]['score']}</strong></span></td>`
                        }else if (data[x]['score'] > 60)
                        {

                           // score=`<td><span class="server_score blue">${data[x]['score']}</span></td>`
                            score=`<td><span style="color:#2B62C3"><strong>${data[x]['score']}</strong></span></td>`
                        }else if (data[x]['score'] > 40){
                           // score=`<td><span class="server_score orange">${data[x]['score']}</span></td>`
                            score=`<td><span style="color: #EB8400"><strong>${data[x]['score']}</strong></span></td>`
                        }else {
                            //score=`<td><span class="server_score red">${data[x]['score']}</span></td>`
                            score=`<td><span style="color: red"><strong>${data[x]['score']}</strong></span></td>`
                        }
                        html += '<td style="display: none">' + agent_id + '</td>';
                        html += '<td style="width: 46px;padding: 14px;">\n' +
                            '      <div class="server_list_checkbox"><input class="regular_checkbox check_single server_table_list" name="server_table_list" type="checkbox" online="'+data[x]['online']+'" id="'+agent_id+'"> <label for="'+agent_id+'"></label> </div>' +
                            '</td><td>' +
                            server_img +
                            '<a class="detail-a-server" href="javascript:void(0)" data-name="' + data1 + '"   >' + data[x]['host_name'] + '</a> </td>';
                        html += '<td>' + data[x]['os'] + '</td>';
                        html += '<td>' + data[x]['internal_ip'] + '</td>';
                        html += '<td>' + data[x]['extranet_ip'] + '</td>';
                        if (data[x]['online'] === '在线') {
                            html += '<td><img src = "/static/images/online.png" style="width: 12px;">' + data[x]['online'] + '</td>';
                        } else {
                            html += '<td><img src = "/static/images/offline.png" style="width: 12px;">' + data[x]['online'] + '</td>';
                        }
                        html += '<td>' + data[x]['own_user'] + '</td>';
                        html += '<td>' +
                            '<input class="web_tip_text" placeholder="点击编辑" data-type="server" data-id="'+data[x]['agent_id']+'" value="' + data[x]['remark'] + '"/>'+
                            '</td>';
                        html +=  score;
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
            // 添加主机模态框
            //add_host_modal();
        }

    });
}



//详情
var agent_server_id;
$(document).off("click", ".detail-a-server").on("click", ".detail-a-server", function () {
    let data1 = $(this).attr("data-name");
    let b=new Base64();
    let data=JSON.parse(b.decode(data1));
    // console.log(data);
    $.ajax({
        url: '/server_manage_detail',
        type: 'get',
        dataType: 'html',
        async: false,
        success: function (res) {
            // console.log(res);
            $('#div_container').html($(res));
            $('.page-title').html('主机：'+data['host_name']);
            $('#machine_name_view span').html(data['remark']);
            $("#server_manager_os").html("").append(data['os_full']);
            $("#server_manager_iip").html("").append(data['internal_ip']);
            $("#server_manager_eip").html("").append(data['extranet_ip']);
            $("#server_manager_cpu").html("").append(data['cpu']);
            $("#server_manager_memory").html("").append(data['memory']);
            if (data['os'].toLowerCase().indexOf("windows") !== -1) {
                $("#system_logo_img").attr("src", '/static/img/server-group-detail-pc-logo-windows.png');
            }else{
                $("#system_logo_img").attr("src", '/static/img/server-group-detail-pc-logo-linux.png');
            }
            agent_server_id=data['agent_id'];
            // 安全分析
            chart_attack_trend_server(data['agent_id']);

            click_chart_attack_trend_server(data['agent_id']);

            // 事件处理
            click_event_treat_server();

            //安全设置
            click_application_security();

            // 网站详情
            click_server_website_list(1);

            // 黑白名单
            click_black_white_list(data['agent_id']);

            // 基线检查
            click_baseline(data['agent_id']);

            // 防御策略
            click_config_show(data['agent_id']);

            //监控详情
            assets_detail(data['agent_id']);
        }
    });


    $.ajax({
        url: '/assets/query_monitor_info_last',
        type: 'POST',
        data:{"agent_id":agent_server_id},
        success: function (data) {
            console.log(data)
        }
    });


});
// 安全分析
function click_chart_attack_trend_server(data){
    $(document).off('click','#security_analysis_link').on('click','#security_analysis_link',function () {
        chart_attack_trend_server(data);
    })
}
function chart_attack_trend_server(agent_id){
    let data;
    $.ajax({
        url: "/attack/server_trend/",
        type: 'POST',
        data: {
            "id": agent_id
        },
        // dataType: "json",
        async: false,
        success: function (data_list) {
            data=data_list;
            // console.log(data_list);
            let server_id_nowcount=0;
            let server_id_allcount=0;
            for (x in data['num_list']['day'])
            {
                server_id_nowcount+=data['num_list']['day'][x];
            }
            server_id_allcount=data_list['all_count'];
            $("#server_id_nowcount").html("").append(server_id_nowcount);
            $("#server_id_allcount").html("").append(server_id_allcount);
        }});

    let temp_tday = [];
    let temp_yday = [];
    let temp_week = [];
    for( x in data['num_list']['tday'])
    {
        temp_tday.push([x,data['num_list']['tday'][x]])
    }
    for( x in data['num_list']['yday'])
    {
        temp_yday.push([x,data['num_list']['yday'][x]])
    }
    for( x in data['num_list']['week'])
    {
        temp_week.push([x,data['num_list']['week'][x]])
    }
    // chart_attack_trend 服务器攻击趋势
    // let tday = [["2:00", 21273],["4:00", 12273],["6:00", 15273],["8:00", 6273],["10:00", 8273],["12:00", 10273]];
    let tday = temp_tday;
    let yday =temp_yday;
    let week = temp_week;
    linechart(tday,'chart_attack_trend');

    // 服务器被攻击类型分析
    let attack = [];
    for (let x in data['level_num'])
    {
        if (data['level_num'][x][1] !== 0)
        {
            attack.push(data['level_num'][x])
        }
    }
    piechart(attack,'chart_attack_kind');

    // 攻击类型攻击次数
    // 事件类型	次数
    let ana_attack = '';
    for(x in data['type_num']){
        ana_attack +='<tr><td width="60%">'+data['type_num'][x][0]+'</td>';
        ana_attack +='<td>'+data['type_num'][x][1]+'</td></tr>';
    }
    $('#ana_attack').html(ana_attack);

    // 被攻击网站列表
    let web_attack = '';
    for(x in data['web_num']){

        web_attack +='<tr><td style="width: 60%">'+data['web_num'][x][0]+'</td>';
        web_attack +='<td>'+data['web_num'][x][1]+'</td></tr>';
    }
    $('#web_attack').html(web_attack);
    // 安全分析服务器攻击趋势tab切换
    $(document).off('click','.server_detail_tab').on('click','.server_detail_tab',function () {
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
        let linechart = echarts.init(document.getElementById('chart_attack_trend'));
        let option = linechart.getOption();
        option.series[0].data = data;
        linechart.setOption(option);
    })
}


// 事件处理
function click_event_treat_server(){
    $(document).off('click','#event_statistics_link').on('click','#event_statistics_link',function () {
        event_treat_server(1);
    })
}
function event_treat_server(now_page){

    // console.log("事件处理");

    //获得查询条件
    let data = {};
    let attack_time = $("#server_attack_time").val();
    let attack_type = $("#server_attack_type").val();
    let attack_msg = $("#server_attack_msg").val();
    let attack_level = $("#server_attack_level").val();

    if (attack_time === undefined) {
        attack_time = ""
    }
    if (attack_type === undefined) {
        attack_type = ""
    }
    if (attack_msg === undefined) {
        attack_msg = ""
    }
    if (attack_level === undefined) {
        attack_level = ""
    }
    data['attack_time'] = attack_time;
    data['attack_type'] = attack_type;
    data['attack_msg'] = attack_msg;
    data ['attack_level'] = attack_level;
    data ['agent_id'] = agent_server_id;
    data['page'] = now_page;
    if (now_page == null || now_page < 1) {
        now_page = 1;
    }
    $.ajax({
        url: "/attack/query/",
        type: 'POST',
        data: data,
        //dataType: "json",
        success: function (data_list) {
            let now_page = data_list['page'];
            let max_size = data_list['max_size'];
            let attack_type_list = data_list['attack_type'];
            let attack_level = data_list['attack_level'];
            if (now_page == null || now_page < 1) {
                now_page = 1;
            }
            if (now_page > max_size) {
                now_page = max_size;
            }
            //搜索框-----------------------------------------------------
            let select_div = $("#server_table_select_div");
            let html_select = "";
            html_select = '<div>';
            html_select += '<div id="" class="search_btngroup">';
            html_select += `<div class="search_button datesel">
                                <span class="btnvalue">日期选择: </span>
                                <input type="text" id="server_attack_time" >
                                <label for="attack_time" class="datesel_icon"><i class="fa fa-calendar"></i></label>
                            </div>
                            `;
            html_select += '<div class="search_button"><span class="btnvalue">攻击类型: </span>';
            html_select += '<select id="server_attack_type" class="form-btn">';
            html_select += '<option value="" >' + "--请选择攻击类型--" + '</option>';
            for (x in attack_type_list) {
                html_select += '<option value="' + attack_type_list[x] + '" >' + attack_type_list[x] + '</option>'
            }
            html_select += '</select></div>';
            html_select += '<div class="search_button"><span class="btnvalue">危险等级: </span>';
            html_select += '<select id="server_attack_level">';
            html_select += '<option value="" >' + "--请选择危险等级--" + '</option>';
            html_select += '<option value="0" >严重</option>';
            html_select += '<option value="1" >高危</option>';
            html_select += '<option value="2" >中危</option>';
            html_select += '<option value="3" >信息</option>';
            html_select += '</select></div>';
            html_select += '<div class="search_button" ><span class="btnvalue"  >关键词(事件摘要): </span>';
            html_select += '<input id="server_attack_msg" value="' + attack_msg + '" /></div>';
            html_select += '<div  class="btn" onclick="event_treat_server(1)" >查询</div>';
            html_select += '<div  class="btn" onclick="server_reset()" >重置</div>';
            html_select += '</div>';
            html_select += '</div>';
            select_div.html(html_select);
            // $("#server_attack_time").val(attack_time);
            $("#server_attack_time").val(attack_time);
            $("#server_attack_type").val(attack_type);
            $("#server_attack_msg").val(attack_msg);
            $("#server_attack_level").val(attack_level);
            //----------------------------------------------------------
            let alarm_event_list_table_data = data_list['attack'];
            let alarm_event_list_table = '';
            for(let j=0,len = alarm_event_list_table_data.length;j<len;j++) {
                alarm_event_list_table += '<tr><td>' + alarm_event_list_table_data[j]['event_time'] + '</td>' +
                    '<td>' + alarm_event_list_table_data[j]['event_name'] + '</td>' +
                    '<td style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis" title="' + alarm_event_list_table_data[j]['comment'] + '">' + alarm_event_list_table_data[j]['comment'] + '</td>';
                // '<td style="width:20%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;max-width: 200px;" title="' + data[x]['comment'] + '">' + data[x]['comment'] + '</td>'
                switch (alarm_event_list_table_data[j]['threat_level']) {
                    case 0:
                        alarm_event_list_table += '<td><span class="label label_custom label-danger" >严重</span></td>';
                        break;
                    case 1:
                        alarm_event_list_table += '<td><span class="label label_custom label_high" >高危</span></td>';
                        break;
                    case 2:
                        alarm_event_list_table += '<td><span class="label label_custom label_norm" >中危</span></td>';
                        break;
                    case 3:
                        alarm_event_list_table += '<td><span class="label label_custom label_info" >信息</span></td>';
                        break;
                }
                let b = new Base64();
                let aaa = JSON.stringify(alarm_event_list_table_data[j]);
                let str = b.encode(aaa);
                alarm_event_list_table_data[j]['event_issue_id'] = alarm_event_list_table_data[j]['event_issue_id'].replace(".", "__");
                alarm_event_list_table += '<td><a class="custom_a event_detail detail-a" href="javascript:void(0)" data-name="' + str + '">查看报告</a></td>';
                if (alarm_event_list_table_data[j]['status'] === 0) {
                    alarm_event_list_table += '<td><div class="deal_cls btn btn_untreated btn-xs"  id = "btn_' + alarm_event_list_table_data[j]['event_issue_id'] + '">未处理</div></td></tr>';
                } else {
                    alarm_event_list_table += '<td><div class="btn btn-xs" disabled id = "btn_' + alarm_event_list_table_data[j]['event_issue_id'] + '">已处理</div></td></tr>';
                }
            }

            let page = '<ul role="menubar" aria-disabled="false" aria-label="Pagination" class="pagination b-pagination pagination-md justify-content-center">' +
                '<a href="javascript:void(0);" onclick="event_treat_server(' + (now_page - 1) + ",'" + agent_server_id + '\')">上一页</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp' +
                '<a href="javascript:void(0);">' + now_page + "/" + max_size + '</a>' +
                '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp' +
                '<a href="javascript:void(0);" onclick="event_treat_server(' + (now_page + 1) + ",'" + agent_server_id + '\')">下一页</a>' +
                '<input id = "event_treat_server_jump" value="' + now_page + '" />' +
                '<a href="javascript:void(0);" onclick="event_treat_server_jump()">跳转</a>' +
                '</ul>';
            $('.page').html(page);
            $('#alarm_event_list_table>tbody').html(alarm_event_list_table);

        }});


}

function server_reset() {
    $("#server_attack_time").val("");
    $("#server_attack_type").val("");
    $("#server_attack_msg").val("");
    $("#server_attack_level").val("");
    event_treat_server(1);
}


function event_treat_server_jump() {

       let page= $("#event_treat_server_jump").val();
        event_treat_server(parseInt(page))

}

// 安全设置
function click_application_security(data){
    $(document).off('click','#application_security_link').on('click','#application_security_link',function () {
        application_security(data);
    })
}
function application_security(){
    console.log("安全设置");
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


// 基线检查
function click_baseline(data){
    $(document).off('click','#server_checking_link').on('click','#server_checking_link',function () {
        server_checking(data);
    })
}

function server_checking(data){
    let status=get_base_line_status();
    if (status === 2 || status === 1) {
        $('#accordion').css('display','none');
        $('.loading_content').css('display','flex');
        let setInte = setInterval(function () {
            console.log("开始检查");
            let status=get_base_line_status();
            console.log("status ",status);
            if (status === 2|| status===1) {
                console.log("正在检查");

            } else if(status===3 || status===0) {
                console.log("检查结束");
                $('#accordion').css('display','block');
                $('.loading_content').css('display','none');
                //server_checking(agent_server_id);
                clearInterval(setInte);
            }
        },1500);
    }
    $.ajax({
        url: "/baseline",
        type: 'POST',
        data: {
            "agent_id":agent_server_id,
        },
        //dataType: "json",
        success: function (data_list) {
            // console.log(data_list);
            if (data_list['online']!==1) {
                $("#start_server_check").hide();
            }
            if (data_list['result'])
            {
                $("#base_line_last_day").text("").append(data_list['last_day']);
                $("#base_line_totalScore").text("").append(data_list['score']);
                $("#last_check_time").text("").append(data_list['last_check_time']);
                $("#baseline_check_status1").hide();
                $("#baseline_check_status").show();
                $("#baseline_check_time").show();
                $("#accordion").show();
            }
            else {
                $("#baseline_check_status1").show();
                $("#baseline_check_status").hide();
                $("#baseline_check_time").hide();
                $("#accordion").hide();

            }
            let all_lenth=0;
            for(result in data_list['result']){
                // 一级
                let datas = data_list['result'][result]['result'];
                let all_num =0;
                // console.log(result);
                // console.log(data_list['result'][result]['result']);
                for(data in datas){
                    // 二级
                    all_lenth += datas[data].length;
                    if(datas[data].length){
                        all_num += datas[data].length;
                        $("#"+data).children().text('（'+datas[data].length+'）');
                        $("#"+data).parent().siblings().first().addClass('red');
                        $("#"+data).parent().siblings().first().html('&#xe60b;');
                        $('#'+data).parent().siblings().last().css('display','block');
                        $('#'+data+"_li").text("").append(get_baseline_li_html(datas[data]));
                    }else{
                        // console.log("长度为0 的组");
                        // console.log(data);
                        $("#"+data).children().text('（0）');
                        $("#"+data).parent().siblings().first().html('&#xe60c;');
                        $("#"+data).parent().siblings().first().addClass('grey');
                    }
                }
                // console.log(all_num);
                if(all_num){
                    $("#"+result+'_num').text("").append(all_num);
                }
            }
            $("#base_line_countNum").text("").append(all_lenth);
            // console.log(data_list['last_check_time']);
            if (data_list['last_check_time']===null)
            {
                $("#server_checking").hide()
            }
        }});
}
// 一级点击关闭所有二级
$(document).on('click','.panel-fst>.panel-heading',function () {
   $(this).siblings().find('.panel-sec').find('.collapse').removeClass('in');
});

function get_baseline_li_html(data) {
    /*获得基线检查 网页木马的html
    * */
    let html =``;
    for (x in data) {
        //检查名称
        let name=data[x];
        //一条信息详情
        let detail='';
        if (typeof(data[x])==='object')
        {
            var status = data[x]['status']
            if(status === '没有定义' || status === '-1'){
               status = '未设置'
            }
            // console.log(data[x]);
            name=data[x]['name'];
            let b = new Base64();
            let data1 = b.encode(JSON.stringify(data[x]));
            detail=JSON.stringify(data1)

                // +"&nbsp&nbsp&nbsp&nbsp当前状态: "+status+"&nbsp&nbsp&nbsp&nbsp建议改为: "+data[x]['suggest']
        }
        html+=`
            <li>
                <div class="u-list-leftbox">
                    <i class="iconfont red">&#xe60f;</i>
                </div>
                <div class="u-list-leftbox   u-list-rightTEXT">
                    <p class="u-css-examineP">
                       ${name}
                    </p>
                </div>
                <button type="button" data-detail='${detail}' class="xtpzaqjc_infor">详情</button>
               <!--<button type="button" onclick="check_ignore(this);">忽略</button>
                <button type="button" onclick="check_repair(this);">修复</button-->
            </li>
            
        `
    };

    return html;
}
$(document).on("click", ".xtpzaqjc_infor", function() {
    let detail = $(this).attr("data-detail");
    let b=new Base64();
    detail=JSON.parse(b.decode(detail));
    let html = `<div class="modal fade modal_rightsilde" id="xtpzaqjc_infor" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <h4 class="modal-title" id="myModalLabel">详情</h4>
            </div>
            <div style="width: 100%;height: calc(100% - 118px);padding: 24px">
                <table style="width: 100%;">
                    <tbody>
                        <tr><td>
                            <div class="xtpzaqjc_infor_title">检查项名称</div>
                            <div class="xtpzaqjc_infor_content">${detail['name']}</div>
                        </td></tr>
                        <tr><td>
                            <div class="xtpzaqjc_infor_title">检查结果</div>
                            <div class="xtpzaqjc_infor_content">${detail['status']}<div/>
                        </td></tr>
                        <tr><td>
                            <div class="xtpzaqjc_infor_title">指导方案</div>
                            <div class="xtpzaqjc_infor_content">${detail['suggest']}</div>
                        </td></tr>
                    </tbody>
                </table>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" data-dismiss="modal">确定</button>
                <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
            </div>
        </div><!-- /.modal-content -->
    </div><!-- /.modal -->
            `;
    $('#model_div').text('').append(html);
    $('#xtpzaqjc_infor').modal("show");
});
// 基线检查
function base_check() {
    $('#accordion').css('display','none');
    $('.loading_content').css('display','flex');
    $.ajax({
        url: "/baseline_check",
        type: 'POST',
        data: {
            "agent_id":agent_server_id,
        },
        //dataType: "json",
        success: function (data_list) {
             console.log(data_list);
            if (data_list['success'] === 'ok') {
                let setInte = setInterval(function () {
                    console.log("开始检查");
                    $('#accordion').css('display','none');
                    $('.loading_content').css('display','flex');
                    let status=get_base_line_status();
                    console.log("status ",status);
                    if (status === 2|| status===1) {
                        //get_base_line_status();
                        console.log("正在检查");

                    } else if(status===3 || status===0) {
                        console.log("检查结束");
                        $('#accordion').css('display','block');
                        $('.loading_content').css('display','none');
                        server_checking(agent_server_id);
                        clearInterval(setInte);
                    }
                },1500);
            }
            else if (data_list['success'] === 'error') {
                // alert("当前主机不在线");
                console.log("alert当前主机不在线;")
                base_check();
                $('#accordion').css('display','block');
                $('.loading_content').css('display','none');
            }



        }})
}

//得到后台的状态
function get_base_line_status() {
    let data;
    $.ajax({
        url: "/baseline_status",
        type: 'POST',
        async:false,
        data: {
            "agent_id":agent_server_id,
        },
        success: function (data_list) {
            // console.log(data_list);
            data=data_list['success'];

        }});

    return data;
}
// 展开箭头的方向
$(document).on('click','.panel-title>a',function(){
    let iconChevron = $(this).find('.slide_mark');
    if (iconChevron.hasClass('iconRotate')) {
        iconChevron.removeClass('iconRotate');
    } else {
        iconChevron.addClass('iconRotate');
    }
});
// 批量操作确认弹框
// $(document).on('click','.check_box',function () {
//     let html = `<div class="layout-title">操作确认：</div>
//         <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
//         <form action="post">
//             <div style="font-size: 16px;text-align: center;line-height: 180px;"><span>您确定要`+$(this).text()+`吗？</span></div>
//             <div class='layout-btn'>
//                 <div class="btn layout-close" onclick="`+$(this).attr('data-tip')+`()">确定</div>
//                 <div class="btn layout-close" onclick="javascript:void(0)">取消</div>
//             </div>
//         </form>`;
//     $('.shade>.layout').html(html);
//     actionIn(".layout", 'action_scale', .3, "");
//     $(".shade").css({
//         visibility: "visible"
//     });
//     event.stopPropagation(); //阻止事件向上冒泡
// });
// function check_ignore() {
// // 执行操作
//     let html = `
//         <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
//         <div style="font-size: 16px;text-align: center;line-height: 180px;"><span>操作成功</span></div>`;
//     $('.shade>.layout').html(html);
//     actionIn(".layout", 'action_scale', .3, "");
//     $(".shade").css({
//         visibility: "visible"
//     });
//     event.stopPropagation(); //阻止事件向上冒泡
// }
// function check_repair() {
// // 执行操作
//     let html = `
//         <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
//         <div style="font-size: 16px;text-align: center;line-height: 180px;"><span>操作成功</span></div>`;
//     $('.shade>.layout').html(html);
//     actionIn(".layout", 'action_scale', .3, "");
//     $(".shade").css({
//         visibility: "visible"
//     });
//     event.stopPropagation(); //阻止事件向上冒泡
// }
// function check_del() {
// // 执行操作
//     let html = `
//         <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
//         <div style="font-size: 16px;text-align: center;line-height: 180px;"><span>操作成功</span></div>`;
//     $('.shade>.layout').html(html);
//     actionIn(".layout", 'action_scale', .3, "");
//     $(".shade").css({
//         visibility: "visible"
//     });
//     event.stopPropagation(); //阻止事件向上冒泡
// }
// 资源监控


//网站详情
function click_server_website_list(data){
    $(document).off('click','#server_website_list_link').on('click','#server_website_list_link',function () {
        server_website_list(data);
    })
}
function server_website_list(now_page){

    console.log("网站详情 server");
    let max_size = 1;
    $.ajax({
        url: "attack/web_event_agent/",
        type: 'POST',
        data: {
            "agent_id": agent_server_id,
            "page": now_page
        },
        // dataType: "json",
        async: false,
        success: function (data_list) {
            data = data_list['agents'];
            max_size=data_list['max_size'];
            console.log(data_list);
        }});
    if (now_page == null || now_page < 1) {
        now_page = 1;
    }
    if (now_page > max_size) {
        now_page = max_size;
    }

    let server_website_list = '';
    let server_website_list_data;
    server_website_list_data=data;

    for(let j=0,len = server_website_list_data.length;j<len;j++) {
        server_website_list_data[j] = JSON.parse(server_website_list_data[j]);
        // console.log(server_website_list_data[j]);
        let b = new Base64();
        let data1 = b.encode(JSON.stringify(server_website_list_data[j]));
        // html += '<td><a class="detail-a-website" href="javascript:void(0)" data-name="' + data1 + '" >' + data[x]['register_ip'] + '</a> </td>';
        server_website_list += '<tr>' +
            ' <td style="width: 46px;padding: 14px;">' +
            '    <div class="server_website_list_checkbox">' +
            '    <input class="regular_checkbox" id="' + server_website_list_data[j]['app_id'] + '" type="checkbox" name="server_website_list_checkall">' +
            '    <label for="' + server_website_list_data[j]['app_id'] + '"></label>' +
            '    </div>' +
            ' </td>' +
            '<td><a class="detail-a-website" href="javascript:void(0)" data-name="' + data1 + '"   >' + server_website_list_data[j]['register_ip'] + '</a></td>' +
            '<td>' + server_website_list_data[j]['remark'] + '</td>' +
            '<td>' + server_website_list_data[j]['owner'] + '</td>' +
            '<td>' + server_website_list_data[j]['last_heartbeat'] + '</td>';
    }
        let page = '<ul role="menubar" aria-disabled="false" aria-label="Pagination" class="pagination b-pagination pagination-md justify-content-center">'+
            '<a href="javascript:void(0);" onclick="server_website_list(' + (now_page - 1) + ')">上一页</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp'+
            '<a href="javascript:void(0);">' + now_page + "/" + max_size + '</a>'+
            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp'+
            '<a href="javascript:void(0);" onclick="server_website_list(' + (now_page + 1) + ')">下一页</a>'+
            '<input id = "agent_jump" value="'+now_page+'" />'+
            '<a href="javascript:void(0);" onclick="server_website_list_jump()">跳转</a>'+
            '</ul>';
        $('.page').html(page);

    $('#server_website_list_table>tbody').html(server_website_list);
}
// 打开网站详情删除弹窗
$(document).on("click", "#server_website_list_del", function() {
    let id = $(this).attr("id");
    let html = `<div class="modal fade" id="del_web_infor" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <h4 class="modal-title" id="myModalLabel">操作确认</h4>
            </div>
            <div style="width: 100%;height: calc(100% - 109px);display: flex;align-items: center;justify-content: center;line-height: 50px">
                <table>
                    <tbody>
                    <tr>
                        <td style="text-align: right;padding-right: 20px; width: 38%">
                            <span>您确定要删除该该网站信息吗？</span>
                        </td>
                    </tbody>
                </table>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" onclick="server_website__del(`+id+`)">提交</button>
                <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
            </div>
        </div><!-- /.modal-content -->
    </div><!-- /.modal -->
            `;
    $('#model_div').text('').append(html);
    $('#del_web_infor').modal("show");
});

// 黑白名单
function click_black_white_list(agent_id){
    $(document).off('click','#black_white_list_link').on('click','#black_white_list_link',function () {
        black_white_list(agent_id);
    })
}

var b_w_list={"black_list":[],"white_list":[]};
function black_white_list(agent_id) {
    $.ajax({
        url: "/black_white_list",
        type: 'POST',
        data: {
            "agent_id": agent_id,
        },
        // dataType: "json",
        async: false,
        success: function (data_list) {

            let black_list_data = data_list['black_list'];
            let white_list_data = data_list['white_list'];
            b_w_list['black_list'] = data_list['black_list'];
            b_w_list['white_list'] = data_list['white_list'];

            let black_list_table = '';
            for (let j = 0, len = black_list_data.length; j < len; j++) {
                black_list_table += '<tr><td style="width: 46px;padding: 14px;">\n' +
                    '                   <div class="black_white_checkbox"><input class="regular_checkbox" name="black_list" type="checkbox" id="' + black_list_data[j] + '"> <label for="' + black_list_data[j] + '"></label> </div>' +
                    '               </td>' +
                    '<td>' + black_list_data[j] + '</td>' +
                    '<td><a class="black_list_release" id="' + black_list_data[j] + '">解除</a></td></tr>';
            }
            black_list_table += '</td>';
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
        }});


}

// 黑白名单展开收起
function black_white_slide(obj) {
    var cont=$(obj).find('span').html();
    if(cont === '收起'){
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
    let target = '#'+$(obj).attr('data-tip') + ' tbody';
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

// 添加黑名单触发
$(document).off('click','#add_black').on('click','#add_black',function () {
    let html = `<div class="modal fade" id="add_black_list" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <h4 class="modal-title" id="myModalLabel">添加黑名单</h4>
            </div>
            <div style="width: 100%;height: calc(100% - 109px);display: flex;align-items: center;justify-content: center;line-height: 50px">
                <table>
                    <tbody>
                    <tr>
                        <td style="text-align: right;padding-right: 20px; width: 38%">
                            <span class="red">*</span>
                            <label>ip地址</label>
                        </td>
                        <td>
                            <input type="text" placeholder="请输入IP或IP段,IP段中间用 “-”分隔" id="black_ip" name="black_ip" />
                            </td>
                    </tbody>
                </table>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" onclick="white_black_list_add()">提交</button>
                <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
            </div>
        </div><!-- /.modal-content -->
    </div><!-- /.modal -->
            `;
    $('#model_div').text('').append(html);
    $('#add_black_list').modal("show");
});

// 解除黑名单触发
$(document).off('click','.black_list_release',).on('click','.black_list_release',function () {
    let id = $(this).attr("id");
    id=id.toString();
    let html = `<div class="modal fade" id="black_release_list" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <h4 class="modal-title" id="myModalLabel">操作确认:</h4>
            </div>
            <div style="width: 100%;height: calc(100% - 109px);display: flex;align-items: center;justify-content: center;line-height: 50px">
                <table>
                    <tbody>
                    <tr>
                        <td style="text-align: right;padding-right: 20px; width: 38%">
                            <span >确认要删除选中的数据吗</span>
                        </td>
                    </tbody>
                </table>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" onclick="white_black_list_release('`+id+`','black')">提交</button>
                <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
            </div>
        </div><!-- /.modal-content -->
    </div><!-- /.modal -->`;
    $('#model_div').text('').append(html);
    $("#black_release_list").modal("show");
});

// 批量解除黑名单
$(document).off('click','#releaseall_black').on('click','#releaseall_black',function () {
    let id = $(this).attr("id");
    let num=0;
    for( let i=1;i<=$('#black_list_table>tbody>tr').length;i++){
        if($('#black_list_table>tbody>tr:nth-child('+i+')').find('input').prop('checked')){
            let ip=$('#black_list_table>tbody>tr:nth-child('+i+')').find('input').attr('id');
            num++;
        }
    }
    if (num === 0) {
        alert("未选择任何黑名单ip")
        return;
    }
    let html = `<div class="modal fade" id="releaseall_black_list" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title" id="myModalLabel">操作确认:</h4>
                </div>
            <div style="width: 100%;height: calc(100% - 109px);display: flex;align-items: center;justify-content: center;line-height: 50px">
                <table>
                    <tbody>
                        <tr>
                        <td style="text-align: right;padding-right: 20px; width: 38%">
                        <span >确认要删除选中的${num}条数据吗</span>
                        </td></tr>
                    </tbody>
                </table>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" onclick="white_black_list_releaseall('`+id+`','black')">提交</button>
                    <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
                </div>
                </div><!-- /.modal-content -->
        </div><!-- /.modal -->`;
    $('#model_div').text('').append(html);
    $("#releaseall_black_list").modal("show");

});

// 添加白名单触发
$(document).off('click','#add_white').on('click','#add_white',function () {
    let html = `<div class="modal fade" id="add_white_list" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <h4 class="modal-title" id="myModalLabel">添加白名单</h4>
            </div>
            <div style="width: 100%;height: calc(100% - 109px);display: flex;align-items: center;justify-content: center;line-height: 50px">
                <table>
                    <tbody>
                    <tr>
                        <td style="text-align: right;padding-right: 20px; width: 38%">
                            <span class="red">*</span>
                            <label>ip地址</label>
                        </td>
                        <td>
                            <input type="text" placeholder="请输入IP或IP段,IP段中间用 “-”分隔" id="white_ip" name="black_ip" />
                            </td>
                    </tbody>
                </table>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" onclick="white_black_list_add()">提交</button>
                <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
            </div>
        </div><!-- /.modal-content -->
    </div><!-- /.modal -->
            `;
    $('#model_div').text('').append(html);
    $('#add_white_list').modal("show");
});

// 解除白名单触发
$(document).off('click','.white_list_release').on('click','.white_list_release',function () {
    let id = $(this).attr("id");
    let html = `<div class="modal fade" id="white_release_list" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <h4 class="modal-title" id="myModalLabel">操作确认:</h4>
            </div>
            <div style="width: 100%;height: calc(100% - 109px);display: flex;align-items: center;justify-content: center;line-height: 50px">
                <table>
                    <tbody>
                    <tr>
                        <td style="text-align: right;padding-right: 20px; width: 38%">
                            <span >确认要删除选中的数据吗</span>
                        </td>
                    </tbody>
                </table>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" onclick="white_black_list_release('`+id+`','white')">提交</button>
                <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
            </div>
        </div><!-- /.modal-content -->
    </div><!-- /.modal -->`;
    $('#model_div').text('').append(html);
    $("#white_release_list").modal("show");
});


// 批量解除白名单触发
$(document).off('click','#releaseall_white').on('click','#releaseall_white',function () {
    let id = $(this).attr("id");
    let num=0;
    for( let i=1;i<=$('#white_list_table>tbody>tr').length;i++){
        if($('#white_list_table>tbody>tr:nth-child('+i+')').find('input').prop('checked')){
            let ip=$('#white_list_table>tbody>tr:nth-child('+i+')').find('input').attr('id');
            num++;
        }
    }
    if  (num===0)
    {
        alert("未选择任何白名单ip")
        return;
    }
    let html = `<div class="modal fade" id="releaseall_white_list" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title" id="myModalLabel">操作确认:</h4>
                </div>
            <div style="width: 100%;height: calc(100% - 109px);display: flex;align-items: center;justify-content: center;line-height: 50px">
                <table>
                    <tbody>
                        <tr>
                        <td style="text-align: right;padding-right: 20px; width: 38%">
                        <span >确认要删除选中的${num}条数据吗</span>
                        </td></tr>
                    </tbody>
                </table>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" onclick="white_black_list_releaseall('`+id+`','white')">提交</button>
                    <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
                </div>
                </div><!-- /.modal-content -->
        </div><!-- /.modal -->`;
    $('#model_div').text('').append(html);
    $("#releaseall_white_list").modal("show");
});

// 添加黑白名单执行
function white_black_list_add() {

    let add_black_ip= [];
    let add_white_ip= [];
    var reg=/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;//正则表达式
    if ($("#black_ip").val()) {
        add_black_ip= $("#black_ip").val().split("-");
        for (x in add_black_ip) {
            ip=add_black_ip[x];
            if(reg.test(ip)){
                if( RegExp.$1<256 && RegExp.$2<256 && RegExp.$3<256 && RegExp.$4<256){
                    console.log("IP正确！");
                    $("#add_black_list").modal("hide");
                }else{
                    console.log("存在错误ip");
                    alert("存在错误ip");
                    return
                }
            }
            else {
                alert("存在错误ip");
                return;
            }
        }
    }
    if ($("#white_ip").val()) {
        add_white_ip= $("#white_ip").val().split("-");
        for (x in add_white_ip) {
            ip=add_white_ip[x];
            if(reg.test(ip)){
                if( RegExp.$1<256 && RegExp.$2<256 && RegExp.$3<256 && RegExp.$4<256){
                    console.log("IP正确！");
                    $("#add_white_list").modal("hide");
                }else{
                    console.log("存在错误ip");
                    alert("存在错误ip");
                    return
                }
            }
            else {
                alert("存在错误ip");
                return;
            }
        }
    }
    if (!$("#white_ip").val()&&!$("#black_ip").val())
    {
        alert("请输入ip");
        return;
    }


    let black_list=b_w_list['black_list'].concat(add_black_ip);
    let white_list=b_w_list['white_list'].concat(add_white_ip);

    black_list=JSON.stringify(black_list);
    white_list=JSON.stringify(white_list);
    // console.log(black_list);
    $.ajax({
        url:'/black_white_lis_update',
        type:'POST',
        data:{
            "agent_id":agent_server_id,
            "black_list":black_list,
            "white_list":white_list
        },
        success: function (data) {
            alert("添加成功");
            black_white_list(agent_server_id)
        }
    });
}

// 解除红白名单执行
function white_black_list_release(id,type) {

    let black_list=b_w_list['black_list'];
    let white_list=b_w_list['white_list'];
    if (type === 'white') {
        white_list.splice(white_list.indexOf(id),1)
    }
    else if (type==='black') {
        black_list.splice(black_list.indexOf(id),1)
    }
    black_list=JSON.stringify(black_list);
    white_list=JSON.stringify(white_list);

    $.ajax({
        url:'/black_white_lis_update',
        type:'POST',
        data:{
            "agent_id":agent_server_id,
            "black_list":black_list,
            "white_list":white_list
        },
        success: function (data) {
            alert("删除成功");
            black_white_list(agent_server_id)
            $('#black_release_list').modal('hide');
            $('#white_release_list').modal('hide');
        }
    });
}

// 批量解除红白名单执行
function white_black_list_releaseall(id,type) {
    let black_list=b_w_list['black_list'];
    let white_list=b_w_list['white_list'];
    if (type === 'black') {
        for( let i=1;i<=$('#black_list_table>tbody>tr').length;i++){
            if($('#black_list_table>tbody>tr:nth-child('+i+')').find('input').prop('checked')){
                let ip=$('#black_list_table>tbody>tr:nth-child('+i+')').find('input').attr('id');
                black_list.splice(black_list.indexOf(ip),1);
            }
        }

    }
    else if (type==='white') {
        for( let i=1;i<=$('#white_list_table>tbody>tr').length;i++){
            if($('#white_list_table>tbody>tr:nth-child('+i+')').find('input').prop('checked')){
                let ip=$('#white_list_table>tbody>tr:nth-child('+i+')').find('input').attr('id');
                white_list.splice(white_list.indexOf(ip),1)
            }
        }

    }

    black_list=JSON.stringify(black_list);
    white_list=JSON.stringify(white_list);


    $.ajax({
        url:'/black_white_lis_update',
        type:'POST',
        data:{
            "agent_id":agent_server_id,
            "black_list":black_list,
            "white_list":white_list
        },
        success: function (data) {
            alert("删除成功");
            black_white_list(agent_server_id)
            $("#releaseall_black_list").modal("hide");
            $("#releaseall_white_list").modal("hide");
        }
    });

}


// 防御策略
function click_config_show(data){
    $(document).off('click','#config_show_link').on('click','#config_show_link',function () {
        config_show(data);
    })
}
function config_show(agent_id) {
    let algorithm_html = ``;
    let httpProtec_html = ``;
    let global_html = ``;
    let httpProtectConfig;
    let algorithm_config;
    let globalConfig;
    $.ajax({
        url: "plugins",
        type: 'POST',
        data: {
            "id": agent_id
        },
        async: false,
        dataType: "json",
        success: function (data_list) {
            // console.log(data_list);
            httpProtectConfig = data_list['httpProtectConfig'];
            algorithm_config = data_list['algorithm_config'];
            globalConfig = data_list['globalConfig'];
            $("#input_httpProtec_config").val(httpProtectConfig);
            $("#input_algorithm_config").val(algorithm_config);
            $("#input_global_config").val(globalConfig);

            httpProtec_html = httpProtec_config_show(httpProtectConfig, agent_id);
            algorithm_html = algorithm_config_show(algorithm_config, agent_id);
            global_html = global_config_show(globalConfig, agent_id);
        }
    });
    $("#agent_manage_submit").html("");
    $("#algorithm_config_show div").html(algorithm_html);
    $("#httpProtec_config_show div").html(httpProtec_html);
    $("#global_config_show div").html(global_html);
}

function httpProtec_config_show(httpProtec_config, id) {
    let html = ``;
    httpProtec_config = httpProtec_config.replace(/'/g, '"');
    httpProtec_config = eval('(' + httpProtec_config + ')');
    let dic = {};
    dic.sqli_rx = "SQL注入";
    dic.sqli_token = "SQL注入";
    dic.xss_rx = "XSS跨站脚本攻击";
    dic.xss_token = "XSS跨站脚本攻击";
    dic.local_file_include = "文件包含";
    dic.remote_file_include = "文件包含";
    dic.protocal_attack = "协议攻击";
    dic.crlf_input = "响应拆分攻击";
    dic.php_code_execute = "代码执行";
    dic.java_code_execute = "代码执行";
    dic.command_execute = "命令执行";

    html += ``;
    let p;
    let last_p;
    for (x in httpProtec_config) {

        if (dic[x] === last_p) {
            p = "";
        } else {
            p = "<p><b>" + dic[x] + "</b></p>";
            last_p = dic[x];
        }

        let x_id = x;
        //
        let btn_html = "";
        let b_ = null;
        let l_ = null;
        let i_ = null;
        if (httpProtec_config[x].action === 'block') {
            b_ = 'active'
        }
        if (httpProtec_config[x].action === 'log') {
            l_ = 'active'
        }
        if (httpProtec_config[x].action === 'ignore') {
            i_ = 'active'
        }
        html += `<div class="form">
                                ${p}
                                <div>
                                    <input style="display: none" id="${x_id}" value="${httpProtec_config[x].action}" type="text">
                                    <div class="btn-group" role="group" aria-label="...">
                                    <button class="btn btn-default ${b_} " onclick="agent_manage_httpProtec_change('${x_id}','block','${id}')">拦截</button>
                                    <button class="btn btn-default ${l_}" onclick="agent_manage_httpProtec_change('${x_id}','log','${id}')">记录</button>
                                    <button class="btn btn-default ${i_}" onclick="agent_manage_httpProtec_change('${x_id}','ignore','${id}')">忽略</button>
                                     <p>${httpProtec_config[x].name}</p>
                                    </div>
                                   <br>
                                </div>
                            </div>
                            `;
    }
    return html;
}

function algorithm_config_show(algorithm_config, id) {
    let html = ``;
    algorithm_config = algorithm_config.replace(/'/g, '"');
    algorithm_config = eval('(' + algorithm_config + ')');

    html += ``;

    let dic = {};
    dic.sqli_userinput = "SQL注入";
    dic.sqli_policy = "SQL注入";
    dic.sql_exception =  "SQL注入";
    dic.ssrf_userinput = "SSRF服务端请求伪造";
    dic.ssrf_aws = "SSRF服务端请求伪造";
    dic.ssrf_common = "SSRF服务端请求伪造";
    dic.ssrf_obfuscate = "SSRF服务端请求伪造";
    dic.ssrf_protocol = "SSRF服务端请求伪造";
    dic.readFile_userinput = "任意文件下载";
    dic.readFile_userinput_http = "任意文件下载";
    dic.readFile_userinput_unwanted = "任意文件下载";
    dic.readFile_outsideWebroot = "任意文件下载";
    dic.readFile_unwanted = "任意文件下载";
    dic.writeFile_NTFS = "任意文件写入";
    dic.writeFile_PUT_script = "任意文件写入";
    dic.writeFile_script = "任意文件写入";
    dic.directory_userinput = "目录遍历";
    dic.directory_reflect = "目录遍历";
    dic.directory_unwanted = "目录遍历";
    dic.directory_outsideWebroot = "目录遍历";
    dic.include_userinput = "文件包含";
    dic.include_protocol = "文件包含";
    dic.xxe_protocol = "XXE外部实体攻击";
    dic.xxe_file = "XXE外部实体攻击";
    dic.fileUpload_webdav = "文件上传";
    dic.fileUpload_multipart_script = "文件上传";
    dic.fileUpload_multipart_html = "文件上传";
    dic.ognl_exec = "OGNL 代码执行漏洞";
    dic.command_reflect = "命令执行";
    dic.command_userinput = "命令执行";
    dic.command_other = "命令执行";
    dic.transformer_deser = "Transformer 反序列化攻击";
    dic.webshell_eval = "网页后门";
    dic.webshell_command = "网页后门";
    dic.webshell_file_put_contents = "网页后门";
    dic.webshell_callable = "网页后门";
    let p;
    let last_p;
    for (x in algorithm_config) {
        if (dic[x] === last_p) {
            p = "";
        } else {
            p = "<p><b>" + dic[x] + "</b></p>";
            last_p = dic[x];
        }

        let x_id = x;
        let b_ = null;
        let l_ = null;
        let i_ = null;
        if (algorithm_config[x].action === 'block') {
            b_ = 'active'
        }
        if (algorithm_config[x].action === 'log') {
            l_ = 'active'
        }
        if (algorithm_config[x].action === 'ignore') {
            i_ = 'active'
        }
        html += `   <div class="form">
                                ${p}
                                <div>
                                    <input style="display: none" id="${x_id}" value="${algorithm_config[x].action}" type="text">
                                    <div class="btn-group" role="group" aria-label="...">
                                    <button class="btn btn-default ${b_} " onclick="agent_manage_algorithm_change('${x_id}','block','${id}')">拦截</button>
                                    <button class="btn btn-default ${l_}" onclick="agent_manage_algorithm_change('${x_id}','log','${id}')">记录</button>
                                    <button class="btn btn-default ${i_}" onclick="agent_manage_algorithm_change('${x_id}','ignore','${id}')">忽略</button>
                                     <p>${algorithm_config[x].name}</p>
                                    </div>
                                   <br>
                                </div>
                            </div>
                            `;
    }
    return html;
}

function global_config_show(global_config, id) {

    global_config = global_config.replace(/'/g, '"');
    global_config = eval('(' + global_config + ')');


    let all_log;
    let onekey_shutdown;
    if (global_config['all_log'] === true) {
        all_log = 'checked'
    }else {
        all_log = 'unchecked';
    }
    if (global_config['onekey_shutdown']['action'] === true) {
        onekey_shutdown = 'checked'
    }else {
        onekey_shutdown = 'unchecked';
    }
    let html = ``;

    html += `        <div class="form">
                        <p><b>快速设置</b></p>
                        <input type="checkbox"  id="all_log" ${all_log} name="custom-switch-checkbox"  onchange="agent_manage_global_change('all_log','${id}')" class="custom-switch-input" style="display: none">
                        <label for="all_log">
                            <div class="btn_on_off"  >
                                <div class="btn_fath"  >
                                    <div class="move"></div>
                                    <div class="btnSwitch btn_left">ON</div>
                                    <div class="btnSwitch btn_right ">OFF</div>
                                </div>
                            </div>
                            <span >将所有算法设置为「记录日志」模式</span>
                        </label>
                        <br/>
                        <input type="checkbox" id="onekey_shutdown" ${onekey_shutdown} name="custom-switch-checkbox" onchange="agent_manage_global_change('onekey_shutdown','${id}')"  class="custom-switch-input" style="display: none">
                        <label for="onekey_shutdown">
                            <div class="btn_on_off ">
                                <div class="btn_fath"  ">
                                    <div class="move"></div>
                                    <div class="btnSwitch btn_left">ON</div>
                                    <div class="btnSwitch btn_right ">OFF</div>
                                </div>
                            </div>
                            <span>是否关闭网站</span>
                        </label>             
                    </div>`;

    return html;


}
// function btnCheckboxToogle(th){
//     var ele = $(th).find(".btn_fath");
//     if(ele.attr("data-state") == "checked"){
//         ele.animate({left: "-58px"}, 300, function(){
//             ele.attr("data-state", "unchecked");
//             //关闭执行
//         });
//         $(th).removeClass("checked").addClass("unchecked");
//     }else if(ele.attr("data-state") == "unchecked"){
//         ele.animate({left: '-4px'}, 300, function(){
//             $(this).attr("data-state", "checked");
//             //开启执行
//         });
//         $(th).removeClass("unchecked").addClass("checked");
//     }
//     console.log($('#all_log').prop("checked"))
// }

function agent_manage_algorithm_change(x_id, state, id) {

    let aa = $("#input_algorithm_config");
    let b = new Base64();
    //let data1 = JSON.parse(b.decode(data));
    let data1 = eval('(' + aa.val() + ')');
    let input_id = '#' + x_id;
    data1[x_id].action = state;
    $(input_id).val(state);
    // aa.val(JSON.stringify(data1,undefined,4));
    aa.val(JSON.stringify(data1));


    let btn = `<button type="button" onclick="agent_manage_submit('${id}')" class="btn btn-primary">
                提交更改
            </button>`;
    $("#agent_manage_submit").html(btn)
}

function agent_manage_httpProtec_change(x_id, state, id) {

    let aa = $("#input_httpProtec_config");
    let data1 = eval('(' + aa.val() + ')');
    let input_id = '#' + x_id;
    data1[x_id].action = state;
    $(input_id).val(state);
    aa.val(JSON.stringify(data1,undefined,4));
    aa.val(JSON.stringify(data1));
    let btn = `<button type="button" onclick="agent_manage_submit('${id}')" class="btn btn-primary">
                提交更改
            </button>`;
    $("#agent_manage_submit").html(btn)
}

function agent_manage_global_change(name, id) {

    let aa = $("#input_global_config");
    let data1 = eval('(' + aa.val() + ')');

    if (name === 'all_log') {
        data1['all_log'] = data1['all_log'] !== true;

    } else {
        data1['onekey_shutdown']['action'] = data1['onekey_shutdown']['action'] !== true;
    }
    // // let input_id='#'+x_id;
    // // data1[x_id].action =state;
    // // $(input_id).val(state);
    // aa.val(JSON.stringify(data1,undefined,4));
    aa.val(JSON.stringify(data1));
    let btn = `<button type="button" onclick="agent_manage_submit('${id}')" class="btn btn-primary">
                提交更改
            </button>`;
    $("#agent_manage_submit").html(btn)

}

function agent_manage_submit(id) {
    // console.log(id);
    let algo = $("#input_algorithm_config").val();
    let http = $("#input_httpProtec_config").val();
    let glob = $("#input_global_config").val();

    $.ajax({
        type: "post",
        // async : false, //同步请求
        url: "/plugins_update",
        data: {"id": id, "algo": algo, "http": http, "glob": glob},
        // timeout:1000,
        success: function (data) {
            alert('修改成功')

        }
    });
    $("#setting").modal("hide");
}



//拦截记录忽略按钮切换
$(document).on("click", ".btn-group button", function () {
        $(this).addClass("active").siblings().removeClass("active");
    });


// 全选按钮
$(document).off('click','.check_all').on('click','.check_all',function () {
    var flag=$(this).prop('checked');
    var checkname=$(this).attr('id');
    if (flag){
        $('#'+checkname+'_del').removeClass("btn_disabled");

    }else {
        $('#'+checkname+'_del').addClass("btn_disabled");

    }
    var list=document.getElementsByName($(this).attr('id'));
    for(var i=0;i<list.length;i++){
        list[i].checked=flag;
    }
})
$(document).off('click','.check_single').on('click','.check_single',function () {
    var checkname=$(this).attr('name');
    if($('.'+checkname).length == $('.'+checkname+':checked').length){
        $('#'+checkname).prop('checked',true);
    }else{
        $('#'+checkname).prop('checked',false);
    }
    if($('.'+checkname+':checked').length){
        $('#'+checkname+'_del').removeClass("btn_disabled");

    }else {
        $('#'+checkname+'_del').addClass("btn_disabled");
    }
});
$(document).off('click','#server_table_list_del').on('click','#server_table_list_del',function () {

    if($(this).hasClass('btn_disabled')){
        return ;
    }

    let num=$('.server_table_list:checked').length;
    // console.log($('.server_table_list:checked'))
    var idlist = [];
    for(var i = 0;i<num;i++){
        idlist[i] = $('.server_table_list:checked').eq(i).attr('id');
    }
    var onlinelist = [];
    for(var i = 0;i<num;i++){
        onlinelist[i] = $('.server_table_list:checked').eq(i).attr('online');

    }
    console.log(onlinelist);
    let html = `<div class="modal fade" id="server_table_list_del_modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title" id="myModalLabel">操作确认:</h4>
                </div>
            <div style="width: 100%;height: calc(100% - 109px);display: flex;align-items: center;justify-content: center;line-height: 50px">
                <table>
                    <tbody>
                        <tr>
                        <td style="text-align: right;padding-right: 20px; width: 38%">
                        <span >确认要删除选中的${num}条数据吗</span>
                        </td></tr>
                    </tbody>
                </table>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" onclick="server_table_list_del_submit('${idlist}','${onlinelist}')">提交</button>
                    <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
                </div>
                </div><!-- /.modal-content -->
        </div><!-- /.modal -->`;
    $('#model_div').text('').append(html);
    $("#server_table_list_del_modal").modal("show");
});


//监控详情
function assets_detail(agent_id){
    $(document).off('click','#asset_detail_link').on('click','#asset_detail_link',function () {
        assets_detail_query(agent_id);
    })
}

function assets_detail_query(agent_id) {

    $.ajax({
        url: '/assets/query_monitor_info_query',
        type: 'POST',
        data:{"agent_id":agent_id},
        success: function (data) {
            console.log(data)
        }
    });
}

















/*
*
* 删除主机功能
* */
function server_table_list_del_submit(idlist,onlinelist) {

    onlinelist=onlinelist.split(",");
    for (x in onlinelist)
    {
        if (onlinelist[x]==="在线"){
            alert("存在在线主机禁止删除");
            $("#server_table_list_del_modal").modal("hide");
            return
        }
    }

    $.ajax({
        type: "post",
        //async : false, //同步请求
        url: "/server_agent/del/",
        data: {
            "agent_id":idlist
            },
      success: function (data) {
          server_click(1)

        }
    }
    );
    //关闭弹窗
    $("#server_table_list_del_modal").modal("hide");

}