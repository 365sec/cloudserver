function attack_click(attack_page) {
    //let page=1;
    $.ajax({
        url: 'attack',
        dataType: "html",
        type: "get",

        success: function (res) {

            $("#div_container").html($(res));

            // attack_click_search(attack_page);

            let data = {};
            let attack_time = $("#attack_time").val();
            let attack_type = $("#attack_type").val();
            let attack_msg = $("#attack_msg").val();
            let attack_level = $("#attack_level").val();
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
            data['page'] = attack_page;
            if (attack_page == null || attack_page < 1) {
                attack_page = 1;
            }
            // let div_container1 = $(".attackDiv");
            let div_container2 = $(".btnGroup");
            div_container2.append("<div id='table_select_div'></div>");
            //    div_container1.append("<div id='table_div'></div>");

            $.ajax({
                url: "attack/query/",
                type: 'POST',
                data: data,
                // async: false,
                dataType: "json",
                success: function (data_list) {
                    let data = data_list['attack'];
                    let now_page = data_list['page'];
                    let max_size = data_list['max_size'];
                    let attack_type_list = data_list['attack_type'];
                    let attack_level = data_list['attack_level'];
                    // data = data.replace(/}{/g, "}****{").split("****");

                    //let select_div=$("#table_select_div");
                    let select_div = $("#table_select_div");
                    let html_select = "";

                    html_select = '<div>';
                    html_select += '<div id="" class="search_btngroup">';
                    html_select += `<div class="search_button datesel">
                                <span class="btnvalue">日期选择: </span>
                                <input type="text" id="attack_time" class="daterange-text form-control">
                                <i class="glyphicon glyphicon-calendar datesel_icon fa fa-calendar"></i>
                            </div>
                            `;
                    html_select += '<div class="search_button"><span class="btnvalue">攻击类型: </span>';
                    html_select += '<select id="attack_type" class="form-btn">';
                    html_select += '<option value="" >' + "--请选择攻击类型--" + '</option>';
                    for (x in attack_type_list) {
                        html_select += '<option value="' + attack_type_list[x] + '" >' + attack_type_list[x] + '</option>'
                    }
                    html_select += '</select></div>';
                    html_select += '<div class="search_button"><span class="btnvalue">危险等级: </span>';
                    html_select += '<select id="attack_level">';
                    html_select += '<option value="" >' + "--请选择危险等级--" + '</option>';
                    html_select += '<option value="0" >严重</option>';
                    html_select += '<option value="1" >高危</option>';
                    html_select += '<option value="2" >中危</option>';
                    html_select += '<option value="3" >低息</option>';
                    html_select += '</select></div>';
                    html_select += '<div class="search_button"><span class="btnvalue">关键词: </span>';
                    html_select += '<input id="attack_msg" value="' + attack_msg + '" /></div>';


                    //html_select+='<a href="javascript:void(0);" onclick="attack_click(1)" >查询<a/>';
                    html_select += '<div  class="btn" onclick="attack_click_search(1)" >查询</div>';
                    html_select += '<div  class="btn" onclick="reset()" >重置</div>';
                    //html_select+='<a href="javascript:void(0);" onclick="reset()" >重置<a/>';
                    html_select += '</div>';
                    html_select += '</div>';
                    select_div.html(html_select);
                    $("#attack_time").val(attack_time);


                    let div_container = $("#table_div");
                    div_container.text("");

                    let html = "<div>";


                    html += '<div class="card-body">';
                    html += '<table class="table table-bordered">';
                    html += '<thead>';
                    html += '<tr>';
                    html += '<th>agent_id</th>';
                    html += '<th>时间</th>';
                    html += '<th>事件名称</th>';
                    html += '<th style="min-width: 100px;">事件内容</th>';
                    html += '<th>源ip</th>';
                    html += '<th>目的ip</th>';
                    html += '<th>服务器名称</th>';
                    html += '<th>操作</th>';
                    html += '</tr>';
                    html += '</thead>';
                    html += '<tbody>';
                    for (x in data) {

                        html += '<tr>';

                        html += '<td >' + data[x]['agent_id'] + '</td>';
                        html += '<td>' + data[x]['event_time'] + '</td>';
                        html += '<td>' + data[x]['event_name'] + '</td>';
                        html += '<td style="width:20%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;max-width: 200px;" title="' + data[x]['comment'] + '">' + data[x]['comment'] + '</td>';
                        html += '<td>' + data[x]['attack_source'] + '</td>';
                        html += '<td>' + data[x]['server_ip'] + '</td>';
                        html += '<td>' + data[x]['hostname'] + '</td>';
                        // html += '<td style="width:20%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;max-width: 200px;" title="' + data[x]['url'] + '">' + data[x]['url'] + '</td>';
                        // html += '<td style="width:20%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;max-width: 200px;" title="' + data[x]['plugin_message'] + '">' + data[x]['plugin_message'] + '</td>';
                        // html += '<td>' + data[x]['intercept_state'] + '</td>';
                        // html += '<td>' + data[x]['server_type'] + '</td>';
                        //html+='<td><a class="modal-a" href="#myModal" data-toggle="modal" data-target="#myModal"  >详情</a> </td>';

                        let b = new Base64();
                        let str = b.encode(JSON.stringify(data[x]));
                        html += '<td class="detail-td"><a class="detail-a" href="javascript:void(0)" data-name="' + str + '"   >详情</a> </td>';
                        html += '</tr>';
                    }
                    html += '</tbody>';
                    html += '</table>';
                    html += '</div>';

                    html += '<ul role="menubar" aria-disabled="false" aria-label="Pagination" class="pagination b-pagination pagination-md justify-content-center">';

                    html += '<a href="javascript:void(0);" onclick="attack_click(' + (now_page - 1) + ')">上一页</a>';
                    html += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp';
                    html += '<a href="javascript:void(0);">' + now_page + "/" + max_size + '</a>';
                    html += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp';
                    html += '<a href="javascript:void(0);" onclick="attack_click(' + (now_page + 1) + ')">下一页</a>';
                    html += '<input id="attack_jump" value="' + now_page + '" />';

                    html += '<a href="javascript:void(0);" onclick="attack_jump()">跳转</a>';

                    html += '</ul>';
                    div_container.append(html);
                    $("#attack_type_select").val(attack_type);
                    $("#attack_level_select").val(attack_level);
                    $(".container1").css('background-color', '#f0f2f5');
                    if ($(".daterangepicker").length > 0) {
                        $('.daterangepicker').remove();
                    }
                    let beginTimeStore = '';
                    let endTimeStore = '';
                    $('#attack_time').daterangepicker({
                        "timePicker": true,
                        "timePicker24Hour": true,
                        "linkedCalendars": false,
                        "autoUpdateInput": false,
                        "locale": {
                            format: 'YYYY-MM-DD',
                            separator: ' ~ ',
                            applyLabel: "应用",
                            cancelLabel: "取消",
                            resetLabel: "重置",
                        }
                    }, function (start, end, label) {
                        beginTimeStore = start;
                        endTimeStore = end;
                        // console.log(this.startDate.format(this.locale.format));
                        // console.log(this.endDate.format(this.locale.format));
                        if (!this.startDate) {
                            this.element.val('');
                        } else {
                            this.element.val(this.startDate.format(this.locale.format) + this.locale.separator + this.endDate.format(this.locale.format));
                        }
                    });
                }
            });

            let attach_search = $("#attack_search");
        }

    });


}

function attack_click_search(attack_page) {
    let data = {};
    let attack_time = $("#attack_time").val();
    let attack_type = $("#attack_type").val();
    let attack_msg = $("#attack_msg").val();
    let attack_level = $("#attack_level").val();
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
    data['page'] = attack_page;
    if (attack_page == null || attack_page < 1) {
        attack_page = 1;
    }
    // let div_container1 = $(".attackDiv");
    let div_container2 = $(".btnGroup");
    div_container2.append("<div id='table_select_div'></div>");
//    div_container1.append("<div id='table_div'></div>");

    $.ajax({
        url: "attack/query/",
        type: 'POST',
        data: data,
        // async: false,
        dataType: "json",
        success: function (data_list) {
            let data = data_list['attack'];
            let now_page = data_list['page'];
            let max_size = data_list['max_size'];
            let attack_type_list = data_list['attack_type'];
            let attack_level = data_list['attack_level'];
            // data = data.replace(/}{/g, "}****{").split("****");

            //let select_div=$("#table_select_div");


            let div_container = $("#table_div");
            div_container.text("");

            let html = "<div>";


            html += '<div class="card-body">';
            html += '<table class="table table-bordered">';
            html += '<thead>';
            html += '<tr>';
            html += '<th>agent_id</th>';
            html += '<th>时间</th>';
            html += '<th>事件名称</th>';
            html += '<th style="min-width: 100px;">事件内容</th>';
            html += '<th>源ip</th>';
            html += '<th>目的ip</th>';
            html += '<th>服务器名称</th>';
            html += '<th>操作</th>';
            html += '</tr>';
            html += '</thead>';
            html += '<tbody>';
            for (x in data) {

                html += '<tr>';


                html += '<td >' + data[x]['agent_id'] + '</td>';
                html += '<td>' + data[x]['event_time'] + '</td>';
                html += '<td>' + data[x]['event_name'] + '</td>';
                html += '<td style="width:20%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;max-width: 200px;" title="' + data[x]['comment'] + '">' + data[x]['comment'] + '</td>';
                html += '<td>' + data[x]['attack_source'] + '</td>';
                html += '<td>' + data[x]['server_ip'] + '</td>';
                html += '<td>' + data[x]['hostname'] + '</td>';
                // html += '<td style="width:20%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;max-width: 200px;" title="' + data[x]['url'] + '">' + data[x]['url'] + '</td>';
                // html += '<td style="width:20%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;max-width: 200px;" title="' + data[x]['plugin_message'] + '">' + data[x]['plugin_message'] + '</td>';
                // html += '<td>' + data[x]['intercept_state'] + '</td>';
                // html += '<td>' + data[x]['server_type'] + '</td>';
                //html+='<td><a class="modal-a" href="#myModal" data-toggle="modal" data-target="#myModal"  >详情</a> </td>';

                let b = new Base64();
                let str = b.encode(JSON.stringify(data[x]));
                html += '<td class="detail-td"><a class="detail-a" href="javascript:void(0)" data-name="' + str + '"   >详情</a> </td>';
                html += '</tr>';
            }
            html += '</tbody>';
            html += '</table>';
            html += '</div>';

            html += '<ul role="menubar" aria-disabled="false" aria-label="Pagination" class="pagination b-pagination pagination-md justify-content-center">';

            html += '<a href="javascript:void(0);" onclick="attack_click_search(' + (now_page - 1) + ')">上一页</a>';
            html += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp';
            html += '<a href="javascript:void(0);">' + now_page + "/" + max_size + '</a>';
            html += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp';
            html += '<a href="javascript:void(0);" onclick="attack_click_search(' + (now_page + 1) + ')">下一页</a>';
            html += '<input id="attack_jump" value="' + now_page + '" />';

            html += '<a href="javascript:void(0);" onclick="attack_jump()">跳转</a>';

            html += '</ul>';
            div_container.append(html);
            $("#attack_type_select").val(attack_type);
            $("#attack_level_select").val(attack_level);
            $(".container1").css('background-color', '#f0f2f5');

        }
    });

    let attach_search = $("#attack_search");

}

function reset() {

    $("#attack_time").val("");
    $("#attack_jump").val("");
    $("#attack_search").val("");
    $("#attack_type").val("");
    $("#attack_level").val("");
    attack_click("1");
}

function attack_jump() {
    let jump_page = $("#attack_jump").val();
    attack_click(jump_page);
}

$(document).on("change", "select#attack_type_select", function () {

    $("#attack_type").val($(this).val())
});
$(document).on("change", "select#attack_level_select", function () {

    $("#attack_level").val($(this).val())
});


$(document).on("click", ".detail-a", function () {
    let model_html = `
    <div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
             aria-hidden="true">
            <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">
                </button>
                <h4 class="modal-title myModalLabel">
                    攻击事件
                </h4>
            </div>
            <div class="modal-body">
                <ul class="nav nav-tabs myTab">
                    <li class="active"><a href="#detailed_report" data-toggle="tab">详情报告</a></li>
                    <li id="attack_back"><a href="#attack_traceability" data-toggle="tab">攻击追溯</a></li>
                    
                </ul>
                <div class="tab-content myTabContent">
                    <div class="tab-pane fade in active" id="detailed_report">
                        <div id="ioc_body_stage2" class="ioc_body">

                            </div>
                        <div id="ioc_body_stage1" class="ioc_body">

                            </div>
                        <div id="detailed_report_body">
                        </div>
                    </div>
                    <div class="tab-pane fade" id="attack_traceability" >
                        <div id="attack_traceability_body">
                            <table id="event_detail_attack_detail_table" class="table">
                                <tbody class="fillin" id="attack_body">

                                </tbody>
                                </table>
                        </div>
                    </div>
                </div>
            </div><!-- /.modal-content -->
            <div class="modal-footer">
                <div id="remain_num"></div>
                <button type="button" class="btn btn-default" data-dismiss="modal">关闭
                </button>
                <div class="agent_manage_submit">
                </div>

            </div>
        </div><!-- /.modal -->
    </div>
  </div>

    `;


    $("#model_div").text("").append(model_html);

    let data1 = $(this).attr("data-name");
    let b = new Base64();
    let data = JSON.parse(b.decode(data1));
    //根据ID获得单条详细数据
    detail_date = get_detail_data_from_issue_id(data['event_issue_id']);
    //生成详情页部分
    get_iochtml(detail_date);

    $(".myModalLabel").text("攻击事件");
    $("#myModal").modal("show");

});

function get_iochtml(data) {
    /*
    详情页面显示部分
    * */
    console.log(data);
    if (data['event_category'] === "web_event") {
        web_event_html(data);
        //追踪溯源部分
        get_attack_body(data['server_ip'], data['attack_source']);
    } else if (data['event_category'] === "log_analysisd") {
        log_event_html(data);
        //追踪溯源部分
        get_attack_body(data['dstip'], data['srcip']);
    } else if (data['event_category'] === "file_integrity") {
        $("#attack_back").remove();
        file_event_html(data)
    }


}


function get_attack_body(ip, attack_source) {
    /*
    * 追踪溯源部分 生成
    * */
    let parm = {};
    parm['ip'] = ip;
    parm['last'] = 0;
    parm['attack_source'] = attack_source;
    let temp_html = ``;

    $.ajax({
        url: "attack/query_source/",
        type: 'POST',
        data: parm,
        async: false,
        //dataType: "json",
        success: function (data_list) {
            console.log($(document).scrollTop());
            console.log(data_list);
            temp_html += ` <tr>
                <td style="width: 10%; text-align: right;">
                <br>
                </td>
                <td style="width: 4%; position: relative; padding: 0px;"><div class="event_detail_attack_detail_table_split"></div><div class="event_detail_attack_detail_table_circle red"></div></td>
                <td style="width: 50%;">
                <div style="font-weight: bold;">
                攻击次数：${data_list['all_num']}
                </div>
                <span class="attack_start">
                攻击开始
                </span>
                </td>
                </tr>
                    `;

            for (x in data_list['list']) {
                let temp_data = data_list['list'][x];
                temp_html += `
                    <tr>
                        <td style="width: 10%; text-align: right;">${temp_data[0].split(" ")[0]}<br>${temp_data[0].split(" ")[1]}</td>
                        <td style="width: 4%; position: relative; padding: 0px;">
                            <div class="event_detail_attack_detail_table_split"></div>
                            <div class="event_detail_attack_detail_table_circle"></div>
                        </td>
                        <td style="width: 50%;">
                            <span class="ip event_detail_attack_detail_table_span label label-info">${temp_data[2]}</span>
                            <span class="ipAddr">（${temp_data[1]}）</span>
                            ${temp_data[3]}
                            &nbsp;<span class="span_gray">${temp_data[4]}  </span>
                            <!--<span class="event_log_detail" id="1664393756_2018-05-23">&gt;&gt;详情</span>-->
                        </td>
                    </tr>`;
            }
            // $("#remain_num").text("").append(data_list['all_num']- data_list["remain"]+"/"+ data_list['all_num']);

            console.log("第一次查询结果 remain剩余", data_list["remain"]);
            $("#attack_body").text("").append(temp_html);


            if (data_list["remain"] !== 0) {
                append_attack_body(ip, data_list['last_next'], attack_source);
            } else {
                append_attack_body_end()
            }

        }
    });


    //return temp_html;
}

function append_attack_body(ip, last, attack_source) {
    //let  temp_list=  append_attack_body_more(ip,last,attack_source);
    let last_next = 10;
    let html;
    let remian_next = 10;

    let loadflag = true;
    $("#attack_traceability_body").unbind("scroll").bind("scroll", function () {
        let windowHeight = $("#attack_traceability_body").height();//当前窗口的高度
        let scrollTop = $("#attack_traceability_body").scrollTop();//当前滚动条从上往下滚动的距离
        let docHeight = $("#event_detail_attack_detail_table").height(); //当前文档的高度
        //console.log(windowHeight,scrollTop,windowHeight+scrollTop,docHeight);
        if (windowHeight > docHeight && loadflag) {
            append_attack_body_end();
            loadflag = false;
        }
        if (scrollTop + windowHeight >= docHeight && loadflag) {
            if (remian_next >= 0) {

                temp_list = append_attack_body_more(ip, last_next, attack_source);
                remian_next = temp_list[2];
                last_next = temp_list[0];
                html = temp_list[1];
                $("#attack_body").append(html);
                //$("#remain_num").text("").append(remian_next);
            }
            if (remian_next === 0) {
                append_attack_body_end();
                //$("#remain_num").text("").append(remian_next);
                remian_next = -1;
                loadflag = false;
            }
        }

    });

}

function append_attack_body_more(ip, last, attack_source) {

    let parm = {};
    parm['ip'] = ip;
    parm['last'] = last;
    parm['attack_source'] = attack_source;
    console.log(parm);
    let temp_html = ``;
    let more_html = ``;
    //剩未查询的数量
    let remain_num = 0;
    let last_nenxt;
    let ramain;

    $.ajax({
        url: "attack/query_source/",
        type: 'POST',
        data: parm,
        async: false,
        success: function (data_list) {

            for (x in data_list['list']) {
                let temp_data = data_list['list'][x];
                temp_html += `
                    <tr>
                        <td style="width: 10%; text-align: right;">${temp_data[0].split(" ")[0]}<br>${temp_data[0].split(" ")[1]}</td>
                        <td style="width: 4%; position: relative; padding: 0px;">
                            <div class="event_detail_attack_detail_table_split"></div>
                            <div class="event_detail_attack_detail_table_circle"></div>
                        </td>
                        <td style="width: 50%;">
                            <span class="ip event_detail_attack_detail_table_span label label-info">${temp_data[2]}</span>
                            <span class="ipAddr">（${temp_data[1]}）</span>
                            ${temp_data[3]}
                            &nbsp;<span class="span_gray">${temp_data[4]}  </span>
                            <!--<span class="event_log_detail" id="1664393756_2018-05-23">&gt;&gt;详情</span>-->
                        </td>
                    </tr>`;
            }
            last_nenxt = data_list['last_next'];
            ramain = data_list['remain'];

        }
    });

    return [last_nenxt, temp_html, ramain]
}

function append_attack_body_end() {
    let html = ` <tr>
                <td style="width: 10%; text-align: right;">
                <br>
                </td>
                <td style="width: 4%; position: relative; padding: 0px;"><div class="event_detail_attack_detail_table_split"></div><div class="event_detail_attack_detail_table_circle red"></div></td>
                <td style="width: 50%;">
                <span class="attack_end">
                攻击结束
                </span>
                </td>
                 </tr>`;
    $("#attack_body").append(html)

}

function get_detail_data_from_issue_id(event_issue_id) {
    /* 根据issue_id 获得表中的单条信息*/
    let parm = {};
    let data = null;
    parm['id'] = event_issue_id;
    $.ajax({
        url: "attack/query_detail_data/",
        type: 'POST',
        data: parm,
        async: false,
        success: function (data_list) {
            data = data_list
        }
    });
    return data
}

function web_event_html(data) {
    /*
    * 渲染 web_event_html 上面部分*/

    let attack_type = data['attack_type1'];
    let obj_title = '';
    let obj_code = '';
    let code = JSON.parse(data['attack_params']);
    let db_server = '';
    switch (attack_type) {
        case 'command':
            obj_title = "执行命令";
            obj_code = code['command'];
            break;
        case 'deserialization':
            obj_title = "反序列化类";
            obj_code = code['clazz'];
            break;
        case 'directory':
            obj_title = "访问目录";
            obj_code = code['realpath'];
            break;
        case 'fileUpload':
            obj_title = "脚本文件上传";
            obj_code = code['filename'];
            break;
        case 'ognl':
            obj_title = "OGNL表达式";
            obj_code = code['expression'];
            break;
        case 'readFile':
            obj_title = "读取文件";
            obj_code = code['realpath'];
            break;
        case 'request':
            obj_title = "";
            obj_code = "";
            break;
        case 'request_body':
            // obj_title="";
            // obj_code="";
            break;
        case 'sql':
            obj_title = "SQL语句";
            obj_code = code['query'];
            break;
        case 'sqlSlowQuery':
            obj_title = "查询条数";
            obj_code = code['query_count'];
            break;

        case 'ssrf':
            obj_title = "访问URL";
            obj_code = code['url'];
            break;
        case 'webshell_command':
            obj_title = "执行命令";
            obj_code = code['command'];
            break;
        case 'webshell_eval':
            obj_title = "执行php代码";

            if (code.hasOwnProperty('eval')) {
                obj_code = 'eval(' + code['eval'] + ')';
            }
            if (code.hasOwnProperty('assert')) {
                obj_code = 'assert(' + code['assert'] + ')';
            }
            break;
        case 'writeFile':
            obj_title = "上传文件";
            obj_code = code['realpath'];
            break;
        case 'xxe':
            obj_title = "注入实体";
            obj_code = code['entity'];
            break;
        default:
            break;
    }
    let iochtml = "";
    if (attack_type === 'request' || attack_type === 'request_body') {
        iochtml = `
        <table class="legend-table01" style="width: 70%;">
                                <tbody>
                                <tr>
                                    <td class="legend-table01-td1">
                                        <!--第一个模态框-->
                                        <div class="table-content-td-plain" >
                                            <table class="text-legend-text">
                                                <tbody>
                                                <tr>
                                                    <td class="td-01">请求URL</td>
                                                    <td class="td-02">:</td>
                                                    <td class="td-03">
                                                        <p>${data['url']}</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="td-01">请求方法</td>
                                                    <td class="td-02">:</td>
                                                    <td class="td-03">
                                                        <p>${data['method']}</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="td-01">请求体</td>
                                                    <td class="td-02">:</td>
                                                    <td class="td-03">
                                                        <pre id="httpQueryString" data-toggle="tooltip" data-html="true" data-delay="200" data-original-title="" data-trigger="manual">${data['body']}</pre>

                                                    </td>
                                                </tr>
                                            </tbody>
                                            </table>
                                        </div>
                                        <!--三角-->
                                        <div class="triangle-down" style="left: 7px;"></div>
                                        <!--第一个模态框结束-->
                                    </td>
                                    </tr>
                            </tbody>
                            </table>
                            <div class="u-legend pannel_background stagebg1">
                                    <span class="log-alarmer"></span>
                                    <span style="width: 47.8%;display: inline-block;text-align: right;color: #777;margin-top: 70px;"> 网络流量</span>
                                    <span style="width: 34.3%;display: inline-block;text-align: right;color: #777;margin-top: 70px;"> 应用</span>
                            </div>
                            <table class="legend-table02" style="width: 100%;margin: 40px auto;min-height: 50px;vertical-align: top;text-align:
                                   center;">
                                <tbody>
                                <tr>
                                    <td class="legend-low">
                                        <!--第3个模态框-->
                                        <!--三角-->
                                        <div class="triangle-top"></div>
                                        <div class="table-content-td-plain-b" style="min-width: 205px;">
                                            <table class="text-legend-text">
                                                <tbody><tr>
                                                    <td class="td-01" style="width: 40px;">IP</td>
                                                    <td class="td-02">:</td>
                                                    <td class="td-03">
                                                        <p>${data['attack_source']}</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="td-01" style="width: 40px;">地址</td>
                                                    <td class="td-02">:</td>
                                                    <td class="td-03">
                                                            <p>${data['city']}</p>
                                                    </td>
                                                </tr>
                                            </tbody></table>
                                        </div>
                                        <!--第3个模态框结束-->
                                    </td>
                                    <td class="legend-low">

                                        <!--第4个模态框-->
                                        <!--三角-->
                                        <div class="triangle-top"></div>
                                        <div class="table-content-td-plain-b" style="margin-right: 0;">
                                            <table class="text-legend-text">
                                                <tbody>
                                                <tr>
                                                    <td class="td-01">用户</td>
                                                    <td class="td-02">:</td>
                                                    <td class="td-03">
                                                        <p>${data['system_user']}</p>
                                                    </td>
                                                </tr>
                                                   <tr>
                                                    <td class="td-01">主机名称</td>
                                                    <td class="td-02">:</td>
                                                    <td class="td-03">
                                                        <p>${data['server_hostname']}</p>
                                                    </td>
                                                </tr>
                                                   <tr>
                                                    <td class="td-01">服务器名称</td>
                                                    <td class="td-02">:</td>
                                                    <td class="td-03">
                                                        <p>${data['server_type']}</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="td-01">类型</td>
                                                    <td class="td-02">:</td>
                                                    <td class="td-03">
                                                        <p>web</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="td-01">进程路径</td>
                                                    <td class="td-02">:</td>
                                                    <td class="td-03">
                                                        <p>${data['process_path']}</p>
                                                    </td>
                                                </tr>
                                            </tbody>
                                            </table>
                                        </div>
                                        <!--第4个模态框结束-->
                                    </td>

                                </tr>
                            </tbody>
                            </table>

        `;

        $("#ioc_body_stage1").text("").append(iochtml);
        $("#ioc_body_stage2").text("");
    } else {

        iochtml = `                            <table class="legend-table01" style="width: 70%;">
                                <tbody>
                                <tr>
                                    <td class="legend-table01-td1">
                                        <!--第一个模态框-->
                                        <div class="table-content-td-plain" >
                                            <table class="text-legend-text">
                                                <tbody>
                                                <tr>
                                                    <td class="td-01">请求URL</td>
                                                    <td class="td-02">:</td>
                                                    <td class="td-03">
                                                        <p>${data['url']}</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="td-01">请求方法</td>
                                                    <td class="td-02">:</td>
                                                    <td class="td-03">
                                                        <p>${data['method']}</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="td-01">请求体</td>
                                                    <td class="td-02">:</td>
                                                    <td class="td-03">
                                                        <pre id="httpQueryString" data-toggle="tooltip" data-html="true" data-delay="200" data-original-title="" data-trigger="manual">${data['body']}</pre>

                                                    </td>
                                                </tr>
                                            </tbody>
                                            </table>
                                        </div>
                                        <!--三角-->
                                        <div class="triangle-down" style="left: 7px;"></div>
                                        <!--第一个模态框结束-->
                                    </td>
                                    <td class="legend-table01-td1">
                                        <!--第2个模态框-->
                                            <div class="table-content-td-plain">
                                                    <table class="text-legend-text">
                                                    <tbody>
                                                    <tr>
                                                        <td class="td-01">操作类型</td>
                                                        <td class="td-02">:</td>
                                                        <td class="td-03">
                                                            <p>${data['attack_type']}</p>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td class="td-01">操作扩展</td>
                                                        <td class="td-02">:</td>
                                                        <td class="td-03">
                                                            <p>${data['stack_trace'].split("\r\n")[0].split("\n")[0]}</p>
                                                        </td>
                                                    </tr>
                                                    </tbody>
                                                    </table>
                                            </div>
                                            <!--三角-->
                                            <div class="triangle-down" ></div>
                                        <!--第2个模态框结束-->
                                    </td>
                                </tr>
                            </tbody>
                            </table>
                            <div class="u-legend pannel_background stagebg2">
                                    <span class="log-alarmer"></span>
                                    <span style="width: 23.5%;display: inline-block;text-align: right;color: #777;"> 网络流量</span>
                                    <span style="width: 23.1%;display: inline-block;text-align: right;color: #777;"> 应用</span>
                                    <span style="width: 24.5%;display: inline-block;text-align:right;margin-top: 70px;color: #777;">操作</span>
                                    <span style="width: 25.5%;display: inline-block;text-align: right;margin-top: 70px;color: #777;"> 操作对象</span>
                            </div>
                            <table class="legend-table02" style="width: 100%;margin: 40px auto;min-height: 50px;vertical-align: top;text-align:
                                   center;">
                                <tbody>
                                <tr>
                                    <td class="legend-low">
                                        <!--第3个模态框-->
                                        <!--三角-->
                                        <div class="triangle-top"></div>
                                        <div class="table-content-td-plain-b" style="min-width: 205px;">
                                            <table class="text-legend-text">
                                                <tbody><tr>
                                                    <td class="td-01" style="width: 40px;">IP</td>
                                                    <td class="td-02">:</td>
                                                    <td class="td-03">
                                                        <p>${data['attack_source']}</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="td-01" style="width: 40px;">地址</td>
                                                    <td class="td-02">:</td>
                                                    <td class="td-03">
                                                            <p>${data['city']}</p>
                                                    </td>
                                                </tr>
                                            </tbody></table>
                                        </div>
                                        <!--第3个模态框结束-->
                                    </td>
                                    <td class="legend-low">

                                        <!--第4个模态框-->
                                        <!--三角-->
                                        <div class="triangle-top"></div>
                                        <div class="table-content-td-plain-b" style="margin-right: 0;">
                                            <table class="text-legend-text">
                                                <tbody>
                                                <tr>
                                                    <td class="td-01">用户</td>
                                                    <td class="td-02">:</td>
                                                    <td class="td-03">
                                                        <p>${data['system_user']}</p>
                                                    </td>
                                                </tr>
                                                </tr>
                                                   <tr>
                                                    <td class="td-01">主机名称</td>
                                                    <td class="td-02">:</td>
                                                    <td class="td-03">
                                                        <p>${data['server_hostname']}</p>
                                                    </td>
                                                </tr>
                                                   <tr>
                                                    <td class="td-01">服务器名称</td>
                                                    <td class="td-02">:</td>
                                                    <td class="td-03">
                                                        <p>${data['server_type']}</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="td-01">类型</td>
                                                    <td class="td-02">:</td>
                                                    <td class="td-03">
                                                        <p>web</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="td-01">进程路径</td>
                                                    <td class="td-02">:</td>
                                                    <td class="td-03">
                                                        <p>${data['process_path']}</p>
                                                    </td>
                                                </tr>
                                            </tbody>
                                            </table>
                                        </div>
                                        <!--第4个模态框结束-->
                                    </td>
                                    <td class="legend-low">
                                        <!--第5个模态框-->
                                        <!--三角-->
                                            <div class="triangle-top"></div>
                                            <div class="table-content-td-plain-b" style="margin-right: 0px;">
                                                <table class="text-legend-text">
                                                    <tbody>
                                                    <tr>
                                                        <td class="td-01">${obj_title}</td>
                                                        <td class="td-02">:</td>
                                                        <td class="td-03">
                                                            <p>${obj_code}</p>
                                                        </td>
                                                    </tr>
                                                </tbody></table>

                                            </div>
                                        <!--第5个模态框结束-->
                                    </td>
                                </tr>
                            </tbody>
                            </table>`
        ;
        $("#ioc_body_stage1").text("");
        $("#ioc_body_stage2").text("").append(iochtml);

    }
    /*
    下面列表部分
    * */
    var html = '<div class="card">';
    html += '<div class="card-body">';
    //事件信息
    html += '<div class = "card-body-title">事件信息</div>';
    html += '<table class="table table-bordered">';
    html += '<tbody>';
    html += '<tr><td class="td_left">事件发生时间</td><td>' + data['event_time'] + '</td></tr>';
    html += '<tr><td>攻击事件编号</td><td>' + data['event_issue_id'] + '</td></tr>';
    html += '<tr><td>攻击类型</td><td>' + data['attack_type'] + '</td></tr>';
    html += '<tr><td>攻击参数</td><td><pre>' + data['attack_params'] + '</pre></td></tr>';
    html += '<tr><td>调用栈</td><td><pre>' + data['stack_trace'] + '</pre></td></tr>';
    html += '<tr><td>事件描述</td><td>' + data['plugin_message'] + '</td></tr>';
    html += '<tr><td>事件可信度</td><td>' + data['plugin_confidence'] + '</td></tr>';
    html += '<tr><td>拦截状态</td><td>' + data['intercept_state'] + '</td></tr>';
    html += '<tr><td>风险等级</td><td>' + data['threat_level'] + '</td></tr>';
    html += '</tbody>';
    html += '</table>';


    //请求信息
    html += '<div class = "card-body-title">请求信息</div>';
    html += '<table class="table table-bordered">';
    html += '<tbody>';
    html += '<tr><td  class="td_left">攻击源IP</td><td>' + data['attack_source'] + '</td></tr>';
    html += '<tr><td>被攻击域名</td><td>' + data['target'] + '</td></tr>';
    html += '<tr><td>被攻击IP</td><td>' + data['server_ip'] + '</td></tr>';
    html += '<tr><td>被攻击端口</td><td>' + data['target_port'] + '</td></tr>';
    html += '<tr><td>被攻击服务器类型</td><td>' + data['server_type'] + '</td></tr>';
    html += '<tr><td>被攻击服务器版本</td><td>' + data['server_version'] + '</td></tr>';
    html += '<tr><td>请求ID</td><td>' + data['request_id'] + '</td></tr>';
    html += '<tr><td>请求方法</td><td>' + data['method'] + '</td></tr>';
    html += '<tr><td>被攻击URL</td><td>' + data['url'] + '</td></tr>';
    html += '<tr><td>请求体</td><td><pre>' + data['body'] + '</pre></td></tr>';
    html += '<tr><td>被攻击PATH路径</td><td>' + data['path'] + '</td></tr>';
    html += '<tr><td>User-Agent</td><td>' + data['user_agent'] + '</td></tr>';
    html += '<tr><td>Referer</td><td>' + data['referer'] + '</td></tr>';
    html += '</tbody>';
    html += '</table>';
    //资产信息
    html += '<div class = "card-body-title">资产信息</div>';
    html += '<table class="table table-bordered">';
    html += '<tbody>';
    html += '<tr><td class="td_left">主机名称</td><td>' + data['server_hostname'] + '</td></tr>';
    html += '<tr><td>系统用户名</td><td>' + data['system_user'] + '</td></tr>';
    html += '<tr><td>进程路径</td><td>' + data['process_path'] + '</td></tr>';
    html += '</tbody>';
    html += '</table>';
    html += '</div>';
    html += '<div>';


    $("#detailed_report_body").text("").append(html);

}

function log_event_html(data) {
    /*
    * 渲染 log_event_html*/

    iochtml = `
        
        <h3>基本信息</h3>
        <table class="table table-bordered">
        <tbody>
        <tr>
            <td>服务器名称</td>
            <td>类型</td>
            <td>事件时间</td>
            <td>事件内容</td>
            </tr>
        <tr>
            <td>${data['host_name']}</td>
            <td>${data['event_name']}</td>
            <td>${data['event_time']}</td>
            <td>${data['comment']}</td>
        </tr>
        </tbody>
        </table>
        <h3>操作过程</h3>
        <table class="legend-table01" style="width: 70%;">
                                <tbody>
                                <tr>
                                    <td class="legend-table01-td1">
                                        <!--第一个模态框-->
                                        <div class="table-content-td-plain" >
                                            <table class="text-legend-text">
                                                <tbody>
                                                <tr>
                                                    <td class="td-01">计算机名</td>
                                                    <td class="td-02">:</td>
                                                    <td class="td-03">
                                                        <p>${data['host_name']}</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="td-01">用户名</td>
                                                    <td class="td-02">:</td>
                                                    <td class="td-03">
                                                        <p>${data['dstuser']}</p>
                                                    </td>
                                                </tr>
                                                
                                            </tbody>
                                            </table>
                                        </div>
                                        <!--三角-->
                                        <div class="triangle-down" style="left: 7px;"></div>
                                        <!--第一个模态框结束-->
                                    </td>
                                    </tr>
                            </tbody>
                            </table>
                            <div class="u-legend pannel_background stagebg1">
                                    <span class="log-alarmer"></span>
                                    <span style="width: 47.8%;display: inline-block;text-align: right;color: #777;margin-top: 70px;"> 网络流量</span>
                                    <span style="width: 34.3%;display: inline-block;text-align: right;color: #777;margin-top: 70px;"> 应用</span>
                            </div>
                            <table class="legend-table02" style="width: 100%;margin: 40px auto;min-height: 50px;vertical-align: top;text-align:
                                   center;">
                                <tbody>
                                <tr>
                                    <td class="legend-low">
                                        <!--第3个模态框-->
                                        <!--三角-->
                                        <div class="triangle-top"></div>
                                        <div class="table-content-td-plain-b" style="min-width: 205px;">
                                            <table class="text-legend-text">
                                                <tbody><tr>
                                                    <td class="td-01" style="width: 40px;">IP</td>
                                                    <td class="td-02">:</td>
                                                    <td class="td-03">
                                                        <p>${data['srcip']}</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="td-01" style="width: 40px;">地址</td>
                                                    <td class="td-02">:</td>
                                                    <td class="td-03">
                                                            <p>${data['city']}</p>
                                                    </td>
                                                </tr>
                                            </tbody></table>
                                        </div>
                                        <!--第3个模态框结束-->
                                    </td>
                                    <td class="legend-low">

                                        <!--第4个模态框-->
                                        <!--三角-->
                                        <div class="triangle-top"></div>
                                        <div class="table-content-td-plain-b" style="margin-right: 0;">
                                            <table class="text-legend-text">
                                                <tbody>
                                     
                                                <tr>
                                                    <td class="td-01">类型</td>
                                                    <td class="td-02">:</td>
                                                    <td class="td-03">
                                                        <p>rdp</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="td-01">进程路径</td>
                                                    <td class="td-02">:</td>
                                                    <td class="td-03">
                                                        <p>${data['process_name']}</p>
                                                    </td>
                                                </tr>
                                            </tbody>
                                            </table>
                                        </div>
                                        <!--第4个模态框结束-->
                                    </td>

                                </tr>
                            </tbody>
                            </table>

        `;

    $("#ioc_body_stage1").text("").append(iochtml);
    $("#ioc_body_stage2").text("");


}

function file_event_html(data) {
    /*
    * 渲染 file_event_html*/
    iochtml = `
        <div>
            <h3>基本信息</h3>
            <table class="table table-bordered">
            <tbody>
           
              <tr>  <td>事件名称</td><td>${data['event_name']}</td> </tr>
              <tr>  <td>事件时间</td><td>${data['event_time']}</td> </tr>
              <tr>  <td>主机名称</td><td>${data['host_name']}</td> </tr>
              <tr>  <td>主机名称</td><td>${data['host_name']}</td> </tr>
              <tr>  <td>系统用户</td><td>${data['system_user']}</td> </tr>
              <tr>  <td>文件路径</td><td>${data['file_path']}</td> </tr>
              <tr>  <td>原MD5</td><td>${data['md5_before']}</td> </tr>
              <tr>  <td>现MD5</td><td>${data['md5_after']}</td> </tr> 
              <tr>  <td>原sha1</td><td>${data['sha1_before']}</td> </tr>
              <tr>  <td>现sha1</td><td>${data['sha1_after']}</td> </tr>
              <tr>  <td>原owner_before</td><td>${data['owner_before']}</td> </tr>
              <tr>  <td>现owner_before</td><td>${data['owner_after']}</td> </tr>
              <tr>  <td>事件内容</td><td>${data['full_log']}</td> </tr>
              
           
            </tbody>
            </table>
    </div>
        
  

        `;

    $("#ioc_body_stage1").text("").append(iochtml);
    $("#ioc_body_stage2").text("");


}