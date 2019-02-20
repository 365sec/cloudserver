function agent_click(page) {
    /*
    * 探针管理被点击
    * */
    //let page=1;
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
            let div_container = $(".agentDiv");
            div_container.text("");
            let html = '<div><h1 class="page-title" >探针管理</h1>';
            html += '<div class="card">';
            html += '<div class="card-body">';
            html += '<table class="table table-bordered">';
            html += '<thead>';
            html += '<tr>';
            html += '<th>agent id</th>';
            html += '<th>探针类型</th>';
            html += '<th>注册IP</th>';
            html += '<th>操作系统</th>';
            html += '<th>主机名</th>';
            html += '<th>agent 版本</th>';
            html += '<th>开发语言</th>';
            html += '<th>服务器类型</th>';
            html += '<th>服务器版本</th>';
            html += '<th>是否在线</th>';
            html += '<th>是否禁用该探针</th>';
            html += '</tr>';
            html += '</thead>';
            html += '<tbody>';
            for (x in data) {
                html += '<tr>';
                data[x] = JSON.parse(data[x]);
                html += '<td>' + data[x]['agent_id'] + '</td>';
                html += '<td>' + data[x]['sensor_type_id'] + '</td>';
                html += '<td>' + data[x]['register_ip'] + '</td>';
                html += '<td>' + data[x]['os'] + '</td>';
                html += '<td>' + data[x]['host_name'] + '</td>';
                html += '<td>' + data[x]['version'] + '</td>';
                html += '<td>' + data[x]['language'] + '</td>';
                html += '<td>' + data[x]['server_type'] + '</td>';
                html += '<td>' + data[x]['server_version'] + '</td>';
                html += '<td>' + data[x]['online'] + '</td>';
                html += '<td>' + data[x]['disabled'] + '</td>';
                html += '</tr>';
            }
            html += '</tbody>';
            html += '</table>';
            html += '</div>';
            html += '</div>';
            html += '</div>';

            html += '<ul role="menubar" aria-disabled="false" aria-label="Pagination" class="pagination b-pagination pagination-md justify-content-center">';

            html += '<a href="javascript:void(0);" onclick="agent_click(' + (now_page - 1) + ')">上一页</a>';
            html += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp';
            html += '<a href="javascript:void(0);">' + now_page + "/" + max_size + '</a>';
            html += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp';
            html += '<a href="javascript:void(0);" onclick="agent_click(' + (now_page + 1) + ')">下一页</a>';
            //html += '<input id = "agent_jump" value="'+now_page+'" />';
            //  html += '<a href="javascript:void(0);" onclick="agent_jump()">跳转</a>';
            html += '</ul>';
            div_container.append(html);
        }
    });
    $(".agentDiv").show().siblings().hide();
}
function agent_jump() {
    /**
     * agent 跳转
     * @type {*|jQuery}
     */
    let jump_page = $("#agent_jump").val();
    agent_click(jump_page)
}
$(document).on("click", ".nav.nav-tabs li>a", function () {
    $(this).addClass("active router-link-active").parent().siblings().children().removeClass("active router-link-active");
    let value = $(this).attr("data-value");
    console.log(value);
    switch (value) {
        case "agent":
            agent_click(1);
            break;
        case "attack":
            attack_click(1);
            break;
        case "download":
            download_click(1);
            break;
        case "overview":
            overview_click();
            break;
        default:
    }
});

function overview_click() {
    /*
     * 安全总览事件被点击
     *
     */
    overviewFlash();
    $(".overviewDiv").show().siblings().hide();
}

function overviewFlash() {

    $.ajax({
        url: "overviewQuery",
        type: 'POST',
        data: {
            "page": "asdsad"
        },
        //dataType: "json",
        success: function (data_list) {
            //  console.log(data_list['attrack_source_dic']);
            // console.log(data_list['attrack_time_dic']);
            //  console.log(data_list['attrack_ua_dic']);
            //  console.log(data_list['attrack_type_times']);
            //  console.log(data_list['attrack_recent_warning']);

            attack_source_charts(data_list['attrack_source_dic']);
            attrack_ua_charts(data_list['attrack_ua_dic']);
            attrack_time_charts(data_list['attrack_time_dic']);
            attrack_type_times(data_list['attrack_type_times']);
            attrack_recent_warning(data_list['attrack_recent_warning']['data']);
        }
    });

}

function attrack_recent_warning(data) {
    /*
    * 近期攻击警告
    * */

    let recent_div = $("#attrack_recent_warning_dic_div");
    recent_div.text("");

    let html = '';

    let table = '';

    for (x in data) {

        table += '<tr>';
        table += '<td>';
        table += data[x]['event_time'];
        table += '</td>';
        table += '<td>';
        table += data[x]['attack_type'];
        table += '</td>';
        table += '<td>';
        table += data[x]['event_id'];
        table += '</td>';
        table += '<td>';
        table += data[x]['plugin_message'];
        table += '</td>';
        table += '</tr>';

    }

    html = `<div class="tableDiv">最近告警内容</div>
                    <table class="table">
                      <thead>
                        <tr>
                          <th>时间</th>
                          <th>关注点</th>
                          <th>关注内容</th>
                          <th>描述</th>
                        </tr>
                      </thead>
                      <tbody>
                      ` + table + `
                      </tbody>
                    </table>
                `;
    recent_div.append(html);
}

function attrack_type_times(data) {

    /*
    * 攻击类型 次数*/
    let data_list_type = [];
    let data_list_type_dic = [];


    let mycharts_source = echarts.init(document.getElementById('attack_type_dic_div'));
    data = data.reverse();
    for (x in data) {

        data_list_type.push(data[x][0]);
        data_list_type_dic.push(data[x][1]);
        //data_list_ua_dic.push({'name':data[x][0],'value':data[x][1]})
    }

    option = {
        title: {
            text: '攻击类型排行',
            textStyle: {
                color: "rgba(0,0,0,.7)"
            }
        },
        color: "#458df9",
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            left: '5%',
            top: '12%',
            right: '8%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            splitLine: {
                show: false
            },
            axisLine: {
                show: false
            },
            axisLabel: {
                show: false
            },
            axisTick: {
                show: false
            },
        },
        yAxis: {
            type: 'category',
            data: data_list_type,
            axisTick: {
                show: false
            }, splitLine: {
                show: false
            }, axisLine: {
                show: false
            },
        },
        series: [
            {
                name: '次数',
                type: 'bar',
                data: data_list_type_dic
            }
        ]
    };

    mycharts_source.setOption(option)


}

function attrack_time_charts(data) {
    /*
    * 近期攻击时间  每个时间被攻击的次数*/
    data.reverse();
    let mycharts_source = echarts.init(document.getElementById('attrack_time_dic_div'));

    var dateList = data.map(function (item) {
        return item[0];
    });
    var valueList = data.map(function (item) {
        return item[1];
    });

    option = {
        // Make gradient line here
        visualMap: [{
            show: false,
            type: 'continuous',
            seriesIndex: 0,
            min: 0,
            max: 400
        }, {
            show: false,
            type: 'continuous',
            seriesIndex: 1,
            dimension: 0,
            min: 0,
            max: dateList.length - 1
        }],
        title: [{
            text: '外部威胁趋势',
            textStyle: {
                color: "rgba(0,0,0,.7)"
            }
        }],
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['事件'],
            right: 10
        },
        color: ['#1890FF', "#2FC25B", "#FACC14", "#223273", "#8543E0", "#13C2C2", "#3436C7", "#F04864"],
        xAxis: [{
            data: dateList,
        }],
        yAxis: [{
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
        }],
        grid: {
            left: '5%',
            top: '15%',
            right: '3%',
            bottom: '3%',
            containLabel: true
        },
        series: [{
            type: 'line',
            showSymbol: false,
            name: "事件",
            data: valueList
        }]
    };

    mycharts_source.setOption(option)
}

function attrack_ua_charts(data) {

    data = data.reverse();
    let data_list_ua = [];
    let data_list_ua_dic = [];

    let mycharts_source = echarts.init(document.getElementById('attrack_ua_dic_div'));
    let name;
    let tooltip;
    for (x in data) {


        name = "";
        tooltip = {};
        if (data[x][0].length > 20) {
            name = data[x][0].substr(0, 10);
            name += "...";
            name += data[x][0].substr(-10, 10);
            data_list_ua.push(name);
            let value = data[x][0] + " : " + data[x][1];
            //let value=data[x][1];
            tooltip = {"formatter": value};
            data_list_ua_dic.push({"name": name, "value": data[x][1], "tooltip": tooltip});
            //data_list_ua_dic.push({'name':data[x][0],'value':data[x][1]})

        }

    }

    option = {
        title: {
            text: 'User-Agent排行',
            textStyle: {
                color: "rgba(0,0,0,.7)"
            }
        },
        color: "#458df9",
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }, formatter: function (params) {

                let val = params[0]['data']['tooltip']['formatter']
                return val;
            }
        },
        grid: {
            left: '5%',
            top: '12%',
            right: '8%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            splitLine: {
                show: false
            },
            axisLine: {
                show: false
            },
            axisLabel: {
                show: false
            },
            axisTick: {
                show: false
            },
        },
        yAxis: {
            type: 'category',
            data: data_list_ua,
            axisTick: {
                show: false
            }, splitLine: {
                show: false
            }, axisLine: {
                show: false
            },
        },
        series: [
            {
                name: '次数',
                type: 'bar',
                data: data_list_ua_dic
            }
        ]
    };

    mycharts_source.setOption(option)
}
function attack_source_charts(data) {
    /*
    * ip攻击源*/

    let mycharts_source = echarts.init(document.getElementById('attrack_source_dic_div'));
    let data_list_source = [];
    let data_list_source_dic = [];
    data = data.reverse();
    for (x in data) {
        data_list_source.push(data[x][0]);
        data_list_source_dic.push(data[x][1]);
        //data_list_source_dic.push({'name':data_list['attrack_source_dic'][x][0],'value':data_list['attrack_source_dic'][x][1]});
    }

    option = {
        title: {
            text: '攻击IP排行',
            textStyle: {
                color: "rgba(0,0,0,.7)"
            }
        },
        color: "#458df9",
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            left: '5%',
            top: '12%',
            right: '8%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            splitLine: {
                show: false
            },
            axisLine: {
                show: false
            },
            axisLabel: {
                show: false
            },
            axisTick: {
                show: false
            },
        },
        yAxis: {
            type: 'category',
            data: data_list_source,
            axisTick: {
                show: false
            }, splitLine: {
                show: false
            }, axisLine: {
                show: false
            },
        },
        series: [
            {
                name: '次数',
                type: 'bar',
                data: data_list_source_dic
            }
        ]
    };

    mycharts_source.setOption(option)
}
function download_click(attack_page) {
    /*
    * 下载事件*/



    // $(".tanzhen").show().siblings().hide();
    $(".tanzhen").show().siblings().hide();
    $(".javaDiv").hide();
    $(".IISDiv").hide();
    let html = ``;
}
function java_click() {
    $.ajax({
        url: "agentClick",
        type: 'POST',
        data: {
            "agent": "java"
        },
        //dataType: "json",
        success: function (data_list) {
            $(".tanzhen .javaDiv").show().siblings().hide();
            console.log(data_list);
            $("#agent_server_addr1").text(data_list['agent_server']);
            $("#java_guid").text(data_list['guid']);
            $("#java_a_download_url").attr("href", data_list['download_url']);
            $("#java_wget_download_url").text(data_list['wget']);
        }
    });

}

function iis_click() {

    $.ajax({
        url: "agentClick",
        type: 'POST',
        data: {
            "agent": "iis"
        },
        success: function (data_list) {
            $(".tanzhen .IISDiv").show().siblings().hide();
            console.log(data_list);
            $("#agent_server_addr2").text(data_list['agent_server']);
            $("#iis_guid").text(data_list['guid']);
            $("#iis_a_download_url").attr("href", data_list['download_url']);
            $("#iis_wget_download_url").text(data_list['wget']);
        }
    });

}
function attack_click(attack_page) {

    console.log(attack_page);
    //let page=1;
    let data = {};
    let attack_time = $("#attack_time").val();
    let attack_type = $("#attack_type").val();
    let attack_msg = $("#attack_msg").val();
    if (attack_time === undefined) {
        attack_time = ""
    }
    if (attack_type === undefined) {
        attack_type = ""
    }
    if (attack_msg === undefined) {
        attack_msg = ""
    }


    data['attack_time'] = attack_time;
    data['attack_type'] = attack_type;
    data['attack_msg'] = attack_msg;
    data['page'] = attack_page;
    if (attack_page == null || attack_page < 1) {
        attack_page = 1;
    }
    let div_container1 = $(".attackDiv");
    let div_container2 = $(".btnGroup");
    div_container2.append("<div id='table_select_div'></div>");
    div_container1.append("<div id='table_div'></div>");

    $.ajax({
        url: "attack/query/",
        type: 'POST',
        data: data,
        async: false,
        dataType: "json",
        success: function (data_list) {
            console.log(data_list);
            let data = data_list['stack'];
            let now_page = data_list['page'];
            let max_size = data_list['max_size'];
            let attack_type_list = data_list['attack_type']
            // data = data.replace(/}{/g, "}****{").split("****");

            //let select_div=$("#table_select_div");
            let select_div = $("#table_select_div");
            let html_select = "";

            html_select = '<div>';
            html_select += '<div id="attack_search">';
            html_select += '<div class="input-icon ml-2 w-50" >';
            //html+='攻击时间 <input type="text"  id="attack_time" value="'+attack_time+'" class="form-control" />';
            /* html_select+=`<div >
                             <div class="col-md-4 col-md-offset-2 demo">
                                 <input type="text" id="" placeholder="日期选择" value="${attack_time}" class="form-control">
                                 <i class="glyphicon glyphicon-calendar fa fa-calendar"></i>
                             </div>
                          </div>`;
                 */
            html_select += '</div>';
            //html_select+='攻击类型';

            html_select += `<input style="display:none" id="attack_type" value="${attack_type}"/>`;
            html_select += '<select id="attack_type_select">';
            html_select += '<option value="" >' + "攻击类型" + '</option>';
            for (x in attack_type_list) {
                html_select += '<option value="' + attack_type_list[x] + '" >' + attack_type_list[x] + '</option>'
            }
            html_select += '</select>';
            html_select += '<input id="attack_msg" placeholder="报警消息" value="' + attack_msg + '" />';
            //html_select+='<a href="javascript:void(0);" onclick="attack_click(1)" >查询<a/>';
            html_select += '<button  class="btn" onclick="attack_click(1)" >查询</button>';
            html_select += '<button  class="btn" onclick="reset()" >重置</button>';
            //html_select+='<a href="javascript:void(0);" onclick="reset()" >重置<a/>';
            html_select += '</div>';
            html_select += '</div>';
            select_div.html(html_select);
            $("#attack_time").val(attack_time);


            let div_container = $("#table_div");
            div_container.text("");

            let html = "<div>";
            html += '<div  class="card">';


            html += '<div class="card-body">';
            html += '<table class="table table-bordered">';
            html += '<thead>';
            html += '<tr>';
            html += '<th>agent_id</th>';
            html += '<th>攻击时间</th>';
            html += '<th>攻击类型</th>';
            html += '<th>URL</th>';
            html += '<th>报警消息</th>';
            html += '<th style="min-width: 100px;">攻击来源</th>';
            html += '<th>拦截状态</th>';
            html += '<th>服务器类型</th>';
            html += '<th>操作</th>';
            html += '</tr>';
            html += '</thead>';
            html += '<tbody>';
            for (x in data) {

                html += '<tr>';

                html += '<td >' + data[x]['agent_id'] + '</td>';
                html += '<td>' + data[x]['event_time'] + '</td>';
                html += '<td>' + data[x]['attack_type'] + '</td>';
                html += '<td style="width:20%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;max-width: 200px;" title="' + data[x]['url'] + '">' + data[x]['url'] + '</td>';
                html += '<td style="width:20%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;max-width: 200px;" title="' + data[x]['plugin_message'] + '">' + data[x]['plugin_message'] + '</td>';
                html += '<td>' + data[x]['attack_source'] + '</td>';
                html += '<td>' + data[x]['intercept_state'] + '</td>';
                html += '<td>' + data[x]['server_type'] + '</td>';
                //html+='<td><a class="modal-a" href="#myModal" data-toggle="modal" data-target="#myModal"  >详情</a> </td>';

                let b = new Base64();
                let str = b.encode(JSON.stringify(data[x]));
                html += '<td class="detail-td"><a class="detail-a" href="javascript:void(0)" data-name="' + str + '"   >详情</a> </td>';
                html += '</tr>';
            }
            html += '</tbody>';
            html += '</table>';
            html += '</div>';
            html += '</div>';
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
        }
    });

    let attach_search = $("#attack_search");


    $(".attackDiv").show().siblings().hide();
}

function reset() {

    $("#attack_time").val("");
    $("#attack_jump").val("");
    $("#attack_search").val("");
    $("#attack_type").val("");
    attack_click("1");
}

function attack_jump() {
    let jump_page = $("#attack_jump").val();
    attack_click(jump_page);
}
$(document).on("change", "select#attack_type_select", function () {

    $("#attack_type").val($(this).val())
});

$(document).on("click", ".detail-a", function () {

    let data1 = $(this).attr("data-name");
    // console.log(data)
    let b = new Base64();
    let data = JSON.parse(b.decode(data1));

    let html = '<div>';
    html += '<div class="card">';
    html += '<div class="card-body">';
    html += '<table class="table table-bordered">';
    html += '<thead>';
    html += '<tr>';
    html += '<th>名称</th>';
    html += '<th>值</th>';
    html += '</tr>';
    html += '</thead>';
    html += '<tbody>';
    html += '<tr><td>event_issue_id</td><td>' + data['event_issue_id'] + '</td></tr>';
    html += '<tr><td>agent_id</td><td>' + data['agent_id'] + '</td></tr>';
    html += '<tr><td>事件类型</td><td>' + data['event_type'] + '</td></tr>';
    html += '<tr><td>事件发生时间</td><td>' + data['event_time'] + '</td></tr>';
    html += '<tr><td>服务器名称</td><td>' + data['server_hostname'] + '</td></tr>';
    html += '<tr><td>event_id</td><td>' + data['event_id'] + '</td></tr>';
    html += '<tr><td>攻击类型</td><td>' + data['attack_type'] + '</td></tr>';
    html += '<tr><td>攻击参数</td><td>' + data['attack_params'] + '</td></tr>';
    html += '<tr><td>调用栈</td><td>' + data['stack_trace'] + '</td></tr>';
    html += '<tr><td>插件名称</td><td>' + data['plugin_name'] + '</td></tr>';
    html += '<tr><td>插件消息</td><td>' + data['plugin_message'] + '</td></tr>';
    html += '<tr><td>插件置信度</td><td>' + data['plugin_confidence'] + '</td></tr>';
    html += '<tr><td>是否拦截 block或log</td><td>' + data['intercept_state'] + '</td></tr>';
    html += '<tr><td>请求id</td><td>' + data['request_id'] + '</td></tr>';
    html += '<tr><td>攻击来源IP</td><td>' + data['attack_source'] + '</td></tr>';
    html += '<tr><td>被攻击目标域名</td><td>' + data['target'] + '</td></tr>';
    html += '<tr><td>被攻击目标IP</td><td>' + data['server_ip'] + '</td></tr>';
    html += '<tr><td>被攻击目标服务器类型</td><td>' + data['server_type'] + '</td></tr>';
    html += '<tr><td>被攻击目标服务器版本</td><td>' + data['server_version'] + '</td></tr>';
    html += '<tr><td>被攻击URL</td><td>' + data['url'] + '</td></tr>';
    html += '<tr><td>请求体</td><td>' + data['body'] + '</td></tr>';
    html += '<tr><td>被攻击PATH路径</td><td>' + data['path'] + '</td></tr>';
    html += '<tr><td>User-Agent</td><td>' + data['user_agent'] + '</td></tr>';
    html += '<tr><td>Referer</td><td>' + data['referer'] + '</td></tr>';
    html += '<tr><td>风险等级</td><td>' + data['threat_level'] + '</td></tr>';
    html += '<tr><td>请求方法</td><td>' + data['method'] + '</td></tr>';
    html += '<tr><td>系统用户名</td><td>' + data['system_user'] + '</td></tr>';
    html += '<tr><td>进程路径</td><td>' + data['process_path'] + '</td></tr>';

    html += '</tbody>';
    html += '</table>';
    html += '</div>';
    html += '</div>';
    html += '</div>';

    $("#model-body").text("").append(html);
    $("#myModal").modal("show");

});

