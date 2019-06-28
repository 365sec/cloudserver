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
                url: "server_agent/query/",
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
                        let b = new Base64();
                        let data1 = b.encode(JSON.stringify(data[x]));

                        html += '<td><a class="detail-a-server" href="javascript:void(0)" data-name="' + data1 + '"   >' + data[x]['host_name'] + '</a> </td>';
                        html += '<td>' + data[x]['os'] + '</td>';
                        html += '<td>' + data[x]['internal_ip'] + '</td>';
                        html += '<td>' + data[x]['extranet_ip'] + '</td>';
                        if (data[x]['online'] === '在线') {
                            html += '<td><img src = "/static/images/online.png" style="width: 12px;">' + data[x]['online'] + '</td>';
                        } else {
                            html += '<td><img src = "/static/images/offline.png" style="width: 12px;">' + data[x]['online'] + '</td>';
                        }
                        html += '<td>' + data[x]['own_user'] + '</td>';
                        html += '<td>' + data[x]['remark'] + '</td>';
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


//详情
var agent_server_id;
$(document).on("click", ".detail-a-server", function () {
    let data1 = $(this).attr("data-name");
    let b=new Base64();
    let data=JSON.parse(b.decode(data1));
    console.log(data);
    $.ajax({
        url: 'server_manage_detail',
        type: 'get',
        dataType: 'html',

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
        }
    });
});
// 安全分析
function click_chart_attack_trend_server(data){
    $(document).on('click','#security_analysis_link',function () {
        chart_attack_trend_server(data);
    })
}
function chart_attack_trend_server(agent_id){
    let data;
    $.ajax({
        url: "attack/server_trend/",
        type: 'POST',
        data: {
            "id": agent_id
        },
        // dataType: "json",
        async: false,
        success: function (data_list) {
            data=data_list;
            console.log(data_list);

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


    let attack = data['level_num'];
    piechart(attack,'chart_attack_kind');

    // 攻击类型攻击次数
    let ana_attack = '';
    for(x in data['type_num']){
        ana_attack +='<tr><td>'+data['type_num'][x][0]+'</td>';
        ana_attack +='<td>'+data['type_num'][x][1]+'</td></tr>';
    }
    $('#ana_attack').html(ana_attack);

    // 被攻击网站列表
    let web_attack = '';
    for(x in data['web_num']){
        web_attack +='<tr><td style="width: 70%">'+data['web_num'][x][0]+'</td>';
        web_attack +='<td>'+data['web_num'][x][1]+'</td></tr>';
    }
    $('#web_attack').html(web_attack);
    // 安全分析服务器攻击趋势tab切换
    $(document).on('click','.server_detail_tab',function () {
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
    $(document).on('click','#event_statistics_link',function () {
        event_treat_server(1);
    })
}
function event_treat_server(now_page){
    console.log("事件处理");
    let query=$("#event_keyword").val();

    $.ajax({
        url: "attack/query/",
        type: 'POST',
        data: {
            "agent_id":agent_server_id,
            "page": now_page,
            "attack_msg": query,
        },
        //dataType: "json",
        success: function (data_list) {
            max_size = data_list['max_size'];
            if (now_page == null || now_page < 1) {
                now_page = 1;
            }
            if (now_page > max_size) {
                now_page = max_size;
            }
            let alarm_event_list_table_data = data_list['attack'];
            let alarm_event_list_table = '';
            for(let j=0,len = alarm_event_list_table_data.length;j<len;j++) {
                alarm_event_list_table += '<tr><td>' + alarm_event_list_table_data[j]['event_time'] + '</td>' +
                    '<td>' + alarm_event_list_table_data[j]['event_name'] + '</td>' +
                    '<td style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;title="' + alarm_event_list_table_data[j]['comment'] + '">' + alarm_event_list_table_data[j]['comment'] + '</td>';
                // '<td style="width:20%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;max-width: 200px;" title="' + data[x]['comment'] + '">' + data[x]['comment'] + '</td>'
                switch (alarm_event_list_table_data[j]['threat_level']) {
                    case 0:
                        alarm_event_list_table += '<td><span class="label label_custom label-danger" >严重</span></td>';
                        break;
                    case 1:
                        alarm_event_list_table += '<td><span class="label label_custom label_high" >高危</span></td>';
                        break;
                    case 2:
                        alarm_event_list_table += '<td><span class="label label_custom label_norm" >一般</span></td>';
                        break;
                    case 3:
                        alarm_event_list_table += '<td><span class="label label_custom label_info" >信息</span></td>';
                        break;
                }
                let b = new Base64();
                // let str = b.encode(JSON.stringify(data[j]));
                let aaa = JSON.stringify(alarm_event_list_table_data[j]);

                let str = b.encode(aaa);
                alarm_event_list_table_data[j]['event_issue_id']=alarm_event_list_table_data[j]['event_issue_id'].replace(".","__");
                alarm_event_list_table += '<td><a class="custom_a event_detail detail-a" href="javascript:void(0)" data-name="' + str + '">查看报告</a></td>';

                if (alarm_event_list_table_data[j]['status'] === 0) {
                    alarm_event_list_table += '<td><div class="deal_cls btn btn_untreated"  id = "btn_' + alarm_event_list_table_data[j]['event_issue_id'] + '">未处理</div></td></tr>';
                } else {
                    alarm_event_list_table += '<td><div class="btn" disabled id = "btn_' + alarm_event_list_table_data[j]['event_issue_id'] + '">已处理</div></td></tr>';
                }
                let page = '<ul role="menubar" aria-disabled="false" aria-label="Pagination" class="pagination b-pagination pagination-md justify-content-center">' +
                    '<a href="javascript:void(0);" onclick="event_treat_server(' + (now_page - 1) + "," + agent_server_id + ')">上一页</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp' +
                    '<a href="javascript:void(0);">' + now_page + "/" + max_size + '</a>' +
                    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp' +
                    '<a href="javascript:void(0);" onclick="event_treat_server(' + (now_page + 1) + "," + agent_server_id + ')">下一页</a>' +
                    '<input id = "event_treat_server_jump" value="' + now_page + '" />' +
                    '<a href="javascript:void(0);" onclick="event_treat_server_jump()">跳转</a>' +
                    '</ul>';
                $('.page').html(page);
            }
            $('#alarm_event_list_table>tbody').html(alarm_event_list_table);

        }});


}

function event_treat_server_jump() {

       let page= $("#event_treat_server_jump").val();
        event_treat_server(parseInt(page))

}

//事件处理弹窗
//打开事件处理弹窗
// $(document).on("click", ".btn_untreated", function() {
//     let id = $(this).attr("id");
//     console.log(id);
//     let html = `<div class="layout-title">操作确认：</div>
//         <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
//         <form action="post">
//             <div style="font-size: 16px;text-align: center;line-height: 180px;"><span>您确定要处理此事件吗？</span></div>
//             <div class='layout-btn'>
//                 <div class="btn layout-close" onclick="treat(`+id+`)"">确定</div>
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
//事件处理事件
// function treat(obj) {
//     $(obj).attr('disabled','true');
//     $(obj).removeClass('btn_untreated');
// }

// 安全设置
function click_application_security(data){
    $(document).on('click','#application_security_link',function () {
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

// // 常用开关
// function toogle(th){
//     var ele = $(th).find(".btn_fath");
//     if(ele.attr("data-state") == "on"){
//         ele.animate({left: "-57px"}, 300, function(){
//             ele.attr("data-state", "off");
//             //关闭执行
//         });
//         $(th).removeClass("on").addClass("off");
//     }else if(ele.attr("data-state") == "off"){
//         ele.animate({left: '-3px'}, 300, function(){
//             $(this).attr("data-state", "on");
//             //开启执行
//         });
//         $(th).removeClass("off").addClass("on");
//     }
// }

// 基线检查
function click_baseline(data){
    $(document).on('click','#server_checking_link',function () {


        server_checking(data);
    })
}

function server_checking(data){
    $.ajax({
        url: "baseline",
        type: 'POST',
        data: {
            "agent_id":agent_server_id,
        },
        //dataType: "json",
        success: function (data_list) {
            console.log(data_list);
            //WEB文件扫描
            let web_scan=data_list['result']['web_file_check']['result'];
            $("#base_line_last_day").text("").append(data_list['last_day']);
            $("#base_line_totalScore").text("").append(data_list['score']);
            $("#last_check_time").text("").append(data_list['last_check_time']);
            $("#base_line_web_num").text("0").append(web_scan['webshell'].length+web_scan['dark_chain'].length+web_scan['suspicious_links'].length);
            $("#web_muma_num").text("网页木马 （").append(web_scan['webshell'].length).append(")");
            $("#dark_chain_num").text("黑链暗链 （").append(web_scan['dark_chain'].length).append(")");
            $("#suspicious_links_num").text("可疑外链 （").append(web_scan['suspicious_links'].length).append(")");
            $("#webmuma_li").text("").append(get_baseline_li_html(web_scan['webshell']));
            $("#suspicious_links_li").text("").append(get_baseline_li_html(web_scan['suspicious_links']));
            $("#dark_chain_li").text("").append(get_baseline_li_html(web_scan['dark_chain']));
        }})
}

function get_baseline_li_html(data) {
    /*获得基线检查 网页木马的html
    * */
    let html =``;
    for (x in data) {

        html+=`
            <li>
                <div class="u-list-leftbox">
                    <i class="iconfont">&#xe60f;</i>
                </div>
                <div class="u-list-leftbox   u-list-rightTEXT">
                    <p class="u-css-examineP">
                       ${data[x]}
                    </p>
                </div>
                <button type="button" onclick="check_ignore(this);">忽略</button>
                <button type="button" onclick="check_repair(this);">修复</button>
            </li>
            
        `
    };

    return html;
}
// 基线检查
function base_check() {
    $('#accordion').css('display','none');
    $('.loading_content').css('display','flex');
    $.ajax({
        url: "baseline_check",
        type: 'POST',
        data: {
            "agent_id":agent_server_id,
        },
        //dataType: "json",
        success: function (data_list) {
             // console.log(data_list);
            let setInte = setInterval(function () {
                console.log("开始检查");
                $('#accordion').css('display','none');
                $('.loading_content').css('display','flex');
                let status=get_base_line_status();
                console.log("status ",status);
                if (status === 0) {
                    get_base_line_status();
                    console.log("正在检查");

                } else {
                    console.log("检查结束");
                    $('#accordion').css('display','block');
                    $('.loading_content').css('display','none');
                    server_checking(agent_server_id);
                    clearInterval(setInte);

                }
            },1500);


        }})
}

function get_base_line_status() {
    let data;
    $.ajax({
        url: "baseline_status",
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
});
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
function click_server_website_list(data){
    $(document).on('click','#server_website_list_link',function () {
        server_website_list(data);
    })
}
function server_website_list(now_page){

    console.log("网站详情 server");

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
            console.log(data);

        }});
    max_size = 3;
    if (now_page == null || now_page < 1) {
        now_page = 1;
    }
    if (now_page > max_size) {
        now_page = max_size;
    }

    let server_website_list = '';
    let server_website_list_data = [['111','172.16.39.24555',' ','未分组','2019-04-29 17:51:06'],
        ['222','172.16.39.245','','未分组','2019-04-29 17:51:06'],
        ['333','172.16.39.245','','未分组','2019-04-29 17:51:06'],
        ['444','172.16.39.245','','未分组','2019-04-29 17:51:06'],
        ['555','172.16.39.245','','未分组','2019-04-29 17:51:06'],
        ['666','172.16.39.245','','未分组','2019-04-29 17:51:06']
    ];
    server_website_list_data=data;

    for(let j=0,len = server_website_list_data.length;j<len;j++){
        server_website_list_data[j]=JSON.parse(server_website_list_data[j]);
        console.log(server_website_list_data[j]);
        let b = new Base64();
        let data1 = b.encode(JSON.stringify(server_website_list_data[j]));
        // html += '<td><a class="detail-a-website" href="javascript:void(0)" data-name="' + data1 + '" >' + data[x]['register_ip'] + '</a> </td>';
        server_website_list +='<tr>' +
                            ' <td style="width: 46px;padding: 14px;">' +
                            '    <div class="server_website_list_checkbox">' +
                            '    <input class="regular_checkbox" id="'+server_website_list_data[j]['app_id']+'" type="checkbox" name="server_website_list_checkall">' +
                            '    <label for="'+server_website_list_data[j]['app_id']+'"></label>' +
                            '    </div>' +
                            ' </td>' +
                            '<td><a class="detail-a-website" href="javascript:void(0)" data-name="' +data1 + '"   >' + server_website_list_data[j]['register_ip'] + '</a></td>'+
                            '<td>'+server_website_list_data[j]['remark']+'</td>'+
                            '<td>'+server_website_list_data[j]['owner']+'</td>'+
                            '<td>'+server_website_list_data[j]['last_heartbeat']+'</td>';
        let page = '<ul role="menubar" aria-disabled="false" aria-label="Pagination" class="pagination b-pagination pagination-md justify-content-center">'+
            '<a href="javascript:void(0);" onclick="server_website_list(' + (now_page - 1) + ')">上一页</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp'+
            '<a href="javascript:void(0);">' + now_page + "/" + max_size + '</a>'+
            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp'+
            '<a href="javascript:void(0);" onclick="server_website_list(' + (now_page + 1) + ')">下一页</a>'+
            '<input id = "agent_jump" value="'+now_page+'" />'+
            '<a href="javascript:void(0);" onclick="server_website_list_jump()">跳转</a>'+
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

function click_black_white_list(agent_id){
    $(document).on('click','#black_white_list_link',function () {
        black_white_list(agent_id);
    })
}

var b_w_list={"black_list":[],"white_list":[]};
function black_white_list(agent_id) {
    $.ajax({
        url: "black_white_list",
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

// 添加黑名单
$(document).on('click','#add_black',function () {

    let html = `<div class="layout-title">添加黑名单</div>
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
        <form action="post">
            <div style="font-size: 16px;text-align: center;line-height: 180px;">
                <span class="red">*</span>
                <label>ip地址</label>
                <input type="text" placeholder="请输入IP或IP段,IP段中间用 “-”分隔" id="black_ip" name="black_ip" />
            </div>
            
            <div class='layout-btn'>
                <div class="btn layout-close" onclick="white_black_list_add()"">提交</div>
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


    let black_list=b_w_list['black_list'].concat(add_black_ip);
    let white_list=b_w_list['white_list'].concat(add_white_ip);

    black_list=JSON.stringify(black_list);
    white_list=JSON.stringify(white_list);
    // console.log(black_list);
    $.ajax({
        url:'black_white_lis_update',
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

// 解除黑名单
$(document).on('click','.black_list_release',function () {
    let id = $(this).attr("id");
    id=id.toString();
    let html = `<div class="layout-title">操作确认：</div>
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
        <form action="post">
            <div style="font-size: 16px;text-align: center;line-height: 180px;"><span>确认要删除选中的数据吗？</span></div>
            <div class='layout-btn'>
                <div class="btn layout-close" onclick="white_black_list_release('`+id+`','black')">确定</div>
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
        url:'black_white_lis_update',
        type:'POST',
        data:{
            "agent_id":agent_server_id,
            "black_list":black_list,
            "white_list":white_list
        },
        success: function (data) {
            alert("删除成功");
            black_white_list(agent_server_id)
        }
    });
}

// 批量解除黑名单
$(document).on('click','#releaseall_black',function () {
    let id = $(this).attr("id");


    let html = `<div class="layout-title">操作确认：</div>
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
        
            <div style="font-size: 16px;text-align: center;line-height: 180px;"><span>确认要删除选中的数据吗？</span></div>
            <div class='layout-btn'>
                <div class="btn layout-close" onclick="white_black_list_releaseall('`+id+`','black')"">确定</div>
                <div class="btn layout-close" onclick="javascript:void(0)">取消</div>
            </div>
        `;
    $('.shade>.layout').html(html);
    actionIn(".layout", 'action_scale', .3, "");
    $(".shade").css({
        visibility: "visible"
    });
    event.stopPropagation(); //阻止事件向上冒泡
});


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
        url:'black_white_lis_update',
        type:'POST',
        data:{
            "agent_id":agent_server_id,
            "black_list":black_list,
            "white_list":white_list
        },
        success: function (data) {
            alert("删除成功");
            black_white_list(agent_server_id)
        }
    });

}

// 添加白名单
$(document).on('click','#add_white',function () {
    let html = `<div class="layout-title">操作确认：</div>
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
        <form action="post">
            <div style="font-size: 16px;text-align: center;line-height: 180px;">
                <span class="red">*</span>
                <label>ip地址</label>
                <input type="text" placeholder="请输入IP或IP段,IP段中间用 “-”分隔" id="white_ip" name="white_ip" >
            </div>
            <div class='layout-btn'>
                <div class="btn layout-close" onclick="white_black_list_add()"">确定</div>
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
                <div class="btn layout-close" onclick="white_black_list_release('`+id+`','white')"">确定</div>
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
                <div class="btn layout-close" onclick="white_black_list_releaseall('`+id+`','white')"">确定</div>
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


// 防御策略
function click_config_show(data){
    $(document).on('click','#config_show_link',function () {
        config_show(data);
    })
}
function config_show(id) {
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
            "id": id
        },
        async: false,
        dataType: "json",
        success: function (data_list) {
            httpProtectConfig = data_list['httpProtectConfig'];
            algorithm_config = data_list['algorithm_config'];
            globalConfig = data_list['globalConfig'];
            $("#input_httpProtec_config").val(httpProtectConfig);
            $("#input_algorithm_config").val(algorithm_config);
            $("#input_global_config").val(globalConfig);

            httpProtec_html = httpProtec_config_show(httpProtectConfig, id);
            algorithm_html = algorithm_config_show(algorithm_config, id);
            global_html = global_config_show(globalConfig, id);
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
    }
    if (global_config['onekey_shutdown']['action'] === true) {
        onekey_shutdown = 'checked'
    }

    let html = ``;
    html += `        <div class="form">
                        <p><b>快速设置</b></p>
                        <label class="custom-switch">
                            <input type="checkbox"  id="all_log" ${all_log} name="custom-switch-checkbox"  onchange="agent_manage_global_change('all_log','${id}')" class="custom-switch-input">
                            <span class="custom-switch-indicator"></span>
                            <span class="custom-switch-description">将所有算法设置为「记录日志」模式</span>
                        </label>
                        <label class="custom-switch">
                            <input type="checkbox" id="onekey_shutdown" ${onekey_shutdown} name="custom-switch-checkbox" onchange="agent_manage_global_change('onekey_shutdown','${id}')"  class="custom-switch-input">
                            <span class="custom-switch-indicator"></span>
                            <span class="custom-switch-description">是否关闭网站</span>
                        </label>
                    </div>`;

    return html;
}


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
        url: "plugins_update",
        data: {"id": id, "algo": algo, "http": http, "glob": glob},
        // timeout:1000,
        success: function (data) {
            alert('修改成功')

        }
    });

    $("#setting").modal("hide");

}

function formSubmit() {
    $.ajax({
        type: "post",
        //async : false, //同步请求
        url: "add_host",
        data: {"remarkmsg": $("#remarkmsg").html()},
        // timeout:1000,
        success: function (data) {
            if (!data['code']) {
                $("#agent-id").html(data['agent_id'])
            } else {
                alert('添加主机失败。');
            }
        }
    });
    //document.getElementById("myForm").submit();
}
//拦截记录忽略按钮切换
$(document).on("click", ".btn-group button", function () {
        $(this).addClass("active").siblings().removeClass("active");
    });
