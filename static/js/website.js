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
                url: "web_agent/query/",
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
                    html += '<div class = "btngroup"><div  class="btn" onclick="javascript:void(0)" >添加主机</div></div>';
                    html += '<div class="card-body">';
                    html += '<table class="table table-bordered">';
                    html += '<thead>';
                    html += '<tr>';
                    // html += '<th>AGENT_ID</th>';
                    html += '<th>IP</th>';
                    html += '<th>标签</th>';
                    html += '<th>所属服务器</th>';
                    html += '<th>实例</th>';
                    html += '<th>开发语言</th>';
                    html += '<th>版本号</th>';
                    html += '<th>在线状态</th>';
                    html += '<th>上次心跳时间</th>';
                    html += '</tr>';
                    html += '</thead>';
                    html += '<tbody>';
                    for (x in data) {
                        html += '<tr>';
                        data[x] = JSON.parse(data[x]);
                        let agent_id = data[x]['agent_id'];
                        let b = new Base64();
                        let data1 = b.encode(JSON.stringify(data[x]));

                        html += '<td><a class="detail-a-website" href="javascript:void(0)" data-name="' + data1 + '" >' + data[x]['register_ip'] + '</a> </td>';
                        // html += '<td>' + data[x]['register_ip'] + '</td>';
                        html += '<td style="position: relative">' +
                                    '<input class="web_tip_text" placeholder="点击编辑" value="' + data[x]['remark'] + '"/>'+
                                    '<div class="web_tip_edit">'+
                                        '<input type="text" class="web_tip_edit_box" value="' + data[x]['remark'] + '" />'+
                                        '<div  class="web_tip_edit_btn">'+
                                            '<i class="iconfont web_tip_edit_cancel">&#xe646;</i>'+
                                            '<i class="iconfont web_tip_edit_save">&#xe65c;</i>'+
                                        '</div>'+
                                    '</div>'+
                            '</td>';
                        html += '<td>' + data[x]['hostname'] + '</td>';
                        html += '<td>' + data[x]['server_type']+'-'+data[x]['server_version'] +'</td>';
                        html += '<td>' + data[x]['language'] + '</td>';
                        html += '<td>' + data[x]['version'] + '</td>';
                        html += '<td>' + data[x]['online'] + '</td>';
                        html += '<td>' + data[x]['last_heartbeat'] + '</td>';
                        // html += '<td>' + data[x]['server_type'] + '</td>';
                        html += '</tr>';
                    }
                    html += '</tbody>';
                    html += '</table>';
                    html += '</div>';


                    html += '<ul role="menubar" aria-disabled="false" aria-label="Pagination" class="pagination b-pagination pagination-md justify-content-center">';
                    html += '<a href="javascript:void(0);" onclick="website_click(' + (now_page - 1) + ')">上一页</a>';
                    html += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp';
                    html += '<a href="javascript:void(0);">' + now_page + "/" + max_size + '</a>';
                    html += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp';
                    html += '<a href="javascript:void(0);" onclick="website_click(' + (now_page + 1) + ')">下一页</a>';
                    //html += '<input id = "agent_jump" value="'+now_page+'" />';
                    //  html += '<a href="javascript:void(0);" onclick="agent_jump()">跳转</a>';
                    html += '</ul>';
                    div_container.append(html);
                    tip_edit();
                }
            });
            $(".container1").css('background-color', '#f0f2f5');

        }

    });
}
// 标签编辑

function tip_edit(){
    let value;
    $(document).on('click','.web_tip_text',function(){
        let content = $(this);
        $(this).next().css('display','flex');
        $(this).next().find('input').focus();
        $(this).css('display','none')
        value = $(this).val();
        $(document).one('click',function(){
            content.next().hide();
            content.css('display','block');
        })
        $('.web_tip_edit_box').unbind('click').bind('click',function(){
            event.stopPropagation();
        });
    });
    $(document).on('click','.web_tip_edit_cancel',function(){
        $(this).parent().parent().prev().val(value);
        $(this).parent().prev().val(value);
    });
    $(document).on('click','.web_tip_edit_save',function(){
        value = $(this).parent().prev().val();
        $(this).parent().parent().prev().val(value);

        console.log(value)
    });

}


//详情
$(document).on("click", ".detail-a-website", function () {
    let data1 = $(this).attr("data-name");
    let b=new Base64();
    let data=JSON.parse(b.decode(data1));
    console.log(data);
    $.ajax({
        url: 'website_manage_detail',
        type: 'get',
        dataType: 'html',
        success: function (res) {
            $('#div_container').html($(res));
            $('.page-title').html('主机：'+data['agent_id']);
            $('#machine_name_view span').html(data['agent_id']);
            $("#web_manager_ip").html("").append(data['register_ip']);
            $("#web_manager_remark").html("").append(data['remark']);
            $("#web_manager_hostname").html("").append(data['hostname']);
            $("#web_manager_server").html("").append(data['server_type']+"-"+data['server_version']);
            $("#web_manager_language").html("").append(data['language']);
            $("#web_manager_status").html("").append(data['online']);
            $("#web_manager_lastbeat").html("").append(data['last_heartbeat']);

            // 安全分析
            chart_attack_trend_web(data['app_id']);

            // 事件处理
            event_treat_web(1,data['app_id']);

        }
    });
});

// 安全分析
function chart_attack_trend_web(app_id){
    // chart_attack_trend 服务器攻击趋势
    let data;
    $.ajax({
        url: "attack/web_trend/",
        type: 'POST',
        data: {
            "id": app_id
        },
        // dataType: "json",
        async: false,
        success: function (data_list) {
            data=data_list;
            console.log(data);

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
    linechart(tday,'chart_attack_trend_web');

    let attack = data['level_num'];
    piechart(attack,'chart_attack_kind_web');

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
    $(document).on('click','.web_detail_tab',function () {

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
        let linechart = echarts.init(document.getElementById('chart_attack_trend_web'))
        let option = linechart.getOption();
        option.series[0].data = data;
        linechart.setOption(option);
    });
}
//安全分析服务器攻击趋势tab切换



// 事件处理
function event_treat_web(now_page,app_id){
    let data;
    $.ajax({
        url: "attack/web_event/",
        type: 'POST',
        data: {
            "app_id": app_id,
            "page":now_page
        },
        // dataType: "json",
        async: false,
        success: function (data_list) {
            data=data_list;
            console.log(data)

        }});
    max_size = data ['max_size'];
    if (now_page == null || now_page < 1) {
        now_page = 1;
    }
    if (now_page > max_size) {
        now_page = max_size;
    }
    let alarm_event_list_table_data = data['event_list'];
    let alarm_event_list_table = '';
    for(let j=0,len = alarm_event_list_table_data.length;j<len;j++){
        alarm_event_list_table +='<tr><td>'+alarm_event_list_table_data[j]['event_time']+'</td>'+
            '<td>'+alarm_event_list_table_data[j]['attack_type']+'</td>'+
            '<td style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">'+alarm_event_list_table_data[j]['plugin_message']+'</td>';
        switch (alarm_event_list_table_data[j]['threat_level']) {
            case 0:
                alarm_event_list_table +='<td><span class="label label_custom label-danger" >严重</span></td>';
                break;
            case 1:
                alarm_event_list_table +='<td><span class="label label_custom label_high" >高危</span></td>';
                break;
            case 2:
                alarm_event_list_table +='<td><span class="label label_custom label_norm" >一般</span></td>';
                break;
            case 3:
                alarm_event_list_table +='<td><span class="label label_custom label_info" >信息</span></td>';
                break;
        }
        let b = new Base64();
        // let str = b.encode(JSON.stringify(data[j]));
        let aaa=JSON.stringify(alarm_event_list_table_data[j]);

        let str = b.encode(aaa);
        alarm_event_list_table_data[j]['event_issue_id']=alarm_event_list_table_data[j]['event_issue_id'].replace(".","__");
        alarm_event_list_table +='<td><a class="custom_a event_detail detail-a" href="javascript:void(0)" data-name="'+str+'">查看报告</a></td>' ;
        if(alarm_event_list_table_data[j]['status']=== 0){
            alarm_event_list_table +='<td><div class="deal_cls btn btn_untreated"  id = "btn_'+alarm_event_list_table_data[j]['event_issue_id']+'">未处理</div></td></tr>';
        }else{
            alarm_event_list_table +='<td><div class="btn" disabled id = "btn_'+alarm_event_list_table_data[j]['event_issue_id']+'">已处理</div></td></tr>';
        }
        let page = '<ul role="menubar" aria-disabled="false" aria-label="Pagination" class="pagination b-pagination pagination-md justify-content-center">'+
            '<a href="javascript:void(0);" onclick="event_treat_web(' + (now_page - 1) +","+app_id+ ')">上一页</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp'+
            '<a href="javascript:void(0);">' + now_page + "/" + max_size + '</a>'+
            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp'+
            '<a href="javascript:void(0);" onclick="event_treat_web(' + (now_page + 1) +","+app_id+ ')">下一页</a>'+
            '<input id = "event_treat_web_jump" value="'+now_page+'" />'+
            '<a href="javascript:void(0);" onclick="event_treat_web_jump()">跳转</a>'+
            '</ul>';
        $('.page').html(page);
    }
    $('#alarm_event_list_table>tbody').html(alarm_event_list_table);
}

function event_treat_web_jump() {
   let page = $("#event_treat_web_jump").val();
    event_treat_web(parseInt(page));
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
                <div class="btn layout-close" onclick="treat('`+id+`')">确定</div>
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
    $('#'+obj).attr('disabled','true');
    $('#'+obj).removeClass('btn_untreated');

    let id = obj.split("btn_")[1];
    id=id.replace("__",".");


    $.ajax({
        url: "attack/change_status/",
        type: 'POST',
        data: {
            "id": id,
        },
        // dataType: "json",
        async: false,
        success: function (data_list) {
            data=data_list;
            console.log(data)

        }});

}
