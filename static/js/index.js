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
            let div_container2 = $(".table-agent");
            div_container.text("");
            let html = '<h1 class="page-title" ><i class="iconfont">&#xe73b;</i>探针管理</h1>';
            html += '<div class="card">';
            html += '<div class = "btngroup"><button  class="btn" onclick="javascript:void(0)" >添加主机</button></div>'
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
            //html += '<th>是否禁用该探针</th>';
            html += '<th>备注信息</th>';
            html += '<th>远程配置</th>';
            html += '</tr>';
            html += '</thead>';
            html += '<tbody>';
            for (x in data) {
                html += '<tr>';
                data[x] = JSON.parse(data[x]);
                let agent_id = data[x]['agent_id'];
                html += '<td>' + data[x]['agent_id'] + '</td>';
                html += '<td>' + data[x]['sensor_type_id'] + '</td>';
                html += '<td>' + data[x]['register_ip'] + '</td>';
                html += '<td>' + data[x]['os'] + '</td>';
                html += '<td>' + data[x]['host_name'] + '</td>';
                html += '<td>' + data[x]['version'] + '</td>';
                html += '<td>' + data[x]['language'] + '</td>';
                html += '<td>' + data[x]['server_type'] + '</td>';
                html += '<td>' + data[x]['server_version'] + '</td>';
                if(data[x]['online'] == '在线'){
                    html += '<td><img src = "/static/images/online.png" style="width: 12px;">' + data[x]['online'] + '</td>';
                }else{
                    html += '<td><img src = "/static/images/offline.png" style="width: 12px;">' + data[x]['online'] + '</td>';
                }


                //html += '<td>' + data[x]['disabled'] + '</td>';
                html += '<td>' + data[x]['remark'] + '</td>';
                // html += '<td><a class="" data-toggle="modal" data-target="#setting">配置</a></td>';
                //html += '<td><a href="javascript:void(0);" onclick="agent_manage(\''+agent_id+'\')">配置</a></td>';
                html += '<td class="detail-td"><a class="detail-a-agent" href="javascript:void(0)" data-name="' + agent_id + '"   >配置</a> </td>';
                html += '</tr>';
            }
            html += '</tbody>';
            html += '</table>';
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
    $(".container1").css('background-color','#f0f2f5');
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
    // console.log(value);
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
    $(".container1").css('background-color','#fff');
}

function overviewFlash()
{
    query_threat_level();
    query_attack_source();
    query_attack_times();
    query_attack_type();
    query_attack_warn();
}
//overviewQuery
function query_threat_level() {
    $.ajax({
        url: "query_threat_level",
        type: 'POST',
        data: {
            "page": "asdsad"
        },
        //dataType: "json",
        success: function (data_list) {
            attack_threat_level_charts(data_list['threat_level_dict']);
        }
    });

}

function query_attack_source() {
    $.ajax({
        url: "query_attack_source",
        type: 'POST',
        data: {
            "page": "asdsad"
        },
        //dataType: "json",
        success: function (data_list) {
            attack_source_charts(data_list['attrack_source_dic']);
            chart_map(data_list['attack_source_map']);
        }
    });

}

function query_attack_times() {
    $.ajax({
        url: "query_attack_times",
        type: 'POST',
        data: {
            "page": "asdsad"
        },
        //dataType: "json",
        success: function (data_list) {
            attrack_time_charts(data_list['attrack_time_dic']);
        }
    });

}

function query_attack_type() {
    $.ajax({
        url: "query_attack_type",
        type: 'POST',
        data: {
            "page": "asdsad"
        },
        //dataType: "json",
        success: function (data_list) {
            attrack_type_times(data_list['attrack_type_times']);
        }
    });

}

function query_attack_warn() {
    $.ajax({
        url: "query_attack_warn",
        type: 'POST',
        data: {
            "page": "asdsad"
        },
        //dataType: "json",
        success: function (data_list) {
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
        table += data[x]['attack_source'];
        table += '</td>';
        table += '<td>';
        table += data[x]['event_id'];
        table += '</td>';
        table += '<td title="' + data[x]['plugin_message'] + '"><div>';
        table += data[x]['plugin_message'];
        table += '</div></td>';
        table += '</tr>';

    }

    html = `
                    <table class="table">
                      <thead>
                        <tr>
                          <th>时间</th>
                          <th>攻击IP</th>
                          <th>攻击事件</th>
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
var mycharts_attrack_type_times;
var mycharts_attrack_time;
var mycharts_attack_threat_level;
var mycharts__map;
var mycharts_attack_source;
function attrack_type_times(data) {

    /*
    * 攻击类型 次数*/
    let data_list_type = [];
    let data_list_type_dic = [];
    if(mycharts_attrack_type_times != null && mycharts_attrack_type_times != "" && mycharts_attrack_type_times != undefined){
        mycharts_attrack_type_times.dispose();
    }


    mycharts_attrack_type_times = echarts.init(document.getElementById('attack_type_dic_div'));
    data = data.reverse();
    for (x in data) {

        data_list_type.push(data[x][0]);
        data_list_type_dic.push(data[x][1]);
        //data_list_ua_dic.push({'name':data[x][0],'value':data[x][1]})
    }

    option = {
        color: "#3398db",
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            left: '5%',
            top: '5%',
            right: '0%',
            bottom: '0%',
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

    mycharts_attrack_type_times.setOption(option)


}
function attrack_time_charts(data) {
    /*
    * 近期攻击时间  每个时间被攻击的次数*/
    data.reverse();
    if(mycharts_attrack_time != null
    && mycharts_attrack_time != ""
    && mycharts_attrack_time != undefined){
        mycharts_attrack_time.dispose();
    }
    mycharts_attrack_time = echarts.init(document.getElementById('attrack_time_dic_div'));

    var dateList = data.map(function (item) {
        return item[0];
    });
    var valueList = data.map(function (item) {
        return item[1];
    });

    option = {
        // Make gradient line here
        color: "#3398db",
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

        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['事件'],
            right: 10
        },
        color: ['#3398db', "#2FC25B", "#FACC14", "#223273", "#8543E0", "#13C2C2", "#3436C7", "#F04864"],
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
            left: '0%',
            top: '13%',
            right: '0%',
            bottom: '0%',
            containLabel: true
        },
        series: [{
            type: 'line',
            showSymbol: false,
            name: "事件",
            data: valueList,
            itemStyle : {
                normal : {
                    color:'#fbcb14',
                    lineStyle:{
                        color:'#fbcb14'
                    }
                }
            }
        }]
    };

    mycharts_attrack_time.setOption(option)
}
function attack_threat_level_charts(data) {
    // console.log(data)
    if(mycharts_attack_threat_level != null
    && mycharts_attack_threat_level != ""
    && mycharts_attack_threat_level != undefined){
        mycharts_attack_threat_level.dispose();
    }
    mycharts_attack_threat_level = echarts.init(document.getElementById('attrack_threat_level_dic_div'));

    option = {
        series: [{
            name: '威胁指数',
            type: 'pie',
            radius: '65%',
            center: ['50%', '60%'],
            clockwise: false,
            data: [{
                value: data[0],
                name: '紧急'
            }, {
                value: data[1],
                name: '高危'
            }, {
                value: data[2],
                name: '中危'
            }, {
                value: data[3],
                name: '低危'
            }],
            label: {
                normal: {
                    textStyle: {
                        fontSize: 14,
                    }
                }
            },
            grid:{
                left: '0',
                top: '0',
                right: '0',
                bottom: '0',
                containLabel: true
            },
            labelLine: {
                normal:{
                    show: true,
                    length:20,
                    length2: 10
                }
            },
            itemStyle: {
                normal: {
                    borderWidth: 4,
                    borderColor: '#ffffff',
                },
                emphasis: {
                    borderWidth: 0,
                }
            }
        }],
        color: [

            '#ff9620',
            '#fbcb14',
            '#54cb71'
        ],
        backgroundColor: '#fff'
    };

    mycharts_attack_threat_level.setOption(option)
}
var map_flag = 1;
function chart_map(attack_source_data) {
    if(mycharts__map != null
    && mycharts__map != ""
    && mycharts__map != undefined){
        mycharts__map.dispose();
    }
    mycharts__map = echarts.init(document.getElementById('chart_map'));
    if  (map_flag == 1)
        geo_map = "china"
    else
        geo_map = "world"

    var convertData = function (data) {
        var res = [];
        for (var ip in data){
            res.push({
                name: ip,
                value: data[ip]
            });
        }
        return res;
    };

    option = {
        backgroundColor: '#fff',
        title: {
            text: '',
            x:'center',
            textStyle: {
                color: '#fff'
            }
        },
        tooltip : {
            trigger: 'item',
            formatter: '{b}'
        },
        grid:{
            left: '0',
            top: '0',
            right: '0',
            bottom: '0',
            containLabel: true
        },
        // legend: {
        //     orient: 'vertical',
        //     y: 'bottom',
        //     x:'right',
        //     data:['pm2.5'],
        //     textStyle: {
        //         color: '#fff'
        //     }
        // },
        visualMap: {
            min: 0,
            max: 200,
            show: false,
            inRange: {
                color: ['#2fbcff', '#ffd71b', '#ff1717']
            },
            textStyle: {
                color: '#fff'
            }
        },
        geo: {
            map: geo_map,
            zoom: 1.2,
            label: {
                emphasis: {
                    show: false
                }
            },
            itemStyle: {
                normal: {
                    areaColor: '#b5cbd8',
                    borderColor: '#fff'
                },
                emphasis: {
                    areaColor: '#2b91b7'
                }
            }
        },
        series: [
            {
                name: '全球分布',
                type: 'effectScatter',
                coordinateSystem: 'geo',
                data: convertData(attack_source_data),
                symbolSize: 16,
                label: {
                    normal: {
                        show: false
                    },
                    emphasis: {
                        show: false
                    }
                },
                itemStyle: {
                    emphasis: {
                        borderColor: '#fff',
                        borderWidth: 1
                    }
                }
            }
        ]
    }
    mycharts__map.setOption(option);
}


function attack_source_charts(data) {
    /*
    * ip攻击源*/
    if(mycharts_attack_source != null
    && mycharts_attack_source != ""
    && mycharts_attack_source != undefined){
        mycharts_attack_source.dispose();
    }
    mycharts_attack_source = echarts.init(document.getElementById('attrack_source_dic_div'));
    let data_list_source = [];
    let data_list_source_dic = [];
    data = data.reverse();
    for (x in data) {
        data_list_source.push(data[x][0]);
        data_list_source_dic.push(data[x][1]);
        //data_list_source_dic.push({'name':data_list['attrack_source_dic'][x][0],'value':data_list['attrack_source_dic'][x][1]});
    }

    option = {

        color: "#3398db",
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            left: '5%',
            top: '5%',
            right: '0%',
            bottom: '0%',
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

    mycharts_attack_source.setOption(option)
}

function download_click(attack_page) {
    /*
    * 下载事件*/


    // $(".tanzhen").show().siblings().hide();
    $(".tanzhen").show().siblings().hide();
    $(".javaDiv").hide();
    $(".IISDiv").hide();
    let html = ``;
    $(".container1").css('background-color','#fff');
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
            $("#agent_server_addr2").text(data_list['agent_server']);
            $("#iis_guid").text(data_list['guid']);
            $("#iis_a_download_url").attr("href", data_list['download_url']);
            $("#iis_wget_download_url").text(data_list['wget']);
        }
    });

}

function attack_click(attack_page) {
    //let page=1;
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
    let div_container1 = $(".attackDiv");
    let div_container2 = $(".btnGroup");
    div_container2.append("<div id='table_select_div'></div>");
//    div_container1.append("<div id='table_div'></div>");

    $.ajax({
        url: "attack/query/",
        type: 'POST',
        data: data,
        //async: false,
        dataType: "json",
        success: function (data_list) {
            let data = data_list['stack'];
            let now_page = data_list['page'];
            let max_size = data_list['max_size'];
            let attack_type_list = data_list['attack_type'];
            let attack_level = data_list['attack_level'];
            // data = data.replace(/}{/g, "}****{").split("****");

            //let select_div=$("#table_select_div");
            let select_div = $("#table_select_div");
            let html_select = "";

            html_select = '<div>';
            html_select += '<div id="attack_search">';
            html_select += '<div class="input-icon ml-2 w-50" >';
            html_select += '</div>';
            html_select += `<input style="display:none" id="attack_type" value="${attack_type}"/>`;
            html_select += `<input style="display:none" id="attack_level" value="${attack_level}"/>`;
            html_select += '<span class="btnvalue">攻击类型: </span>';
            html_select += '<select id="attack_type_select" class="form-btn">';
            html_select += '<option value="" >' + "--请选择攻击类型--" + '</option>';
            for (x in attack_type_list) {
                html_select += '<option value="' + attack_type_list[x] + '" >' + attack_type_list[x] + '</option>'
            }
            html_select += '</select>';
            html_select += '<span class="btnvalue">危险等级: </span>';
            html_select += '<select id="attack_level_select">';
            html_select += '<option value="" >' + "--请选择危险等级--" + '</option>';
            html_select += '<option value="0" >严重</option>';
            html_select += '<option value="1" >高危</option>';
            html_select += '<option value="2" >中危</option>';
            html_select += '<option value="3" >低息</option>';
            html_select += '</select>';
            html_select += '<span class="btnvalue">关键词: </span>';
            html_select += '<input id="attack_msg" value="' + attack_msg + '" />';



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


            html += '<div class="card-body">';
            html += '<table class="table table-bordered">';
            html += '<thead>';
            html += '<tr>';
            html += '<th>agent_id</th>';
            html += '<th>攻击时间</th>';
            html += '<th>攻击类型</th>';
            html += '<th style="min-width: 100px;">攻击来源</th>';
            html += '<th>URL</th>';
            html += '<th>报警消息</th>';
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
                html += '<td>' + data[x]['attack_source'] + '</td>';
                html += '<td style="width:20%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;max-width: 200px;" title="' + data[x]['url'] + '">' + data[x]['url'] + '</td>';
                html += '<td style="width:20%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;max-width: 200px;" title="' + data[x]['plugin_message'] + '">' + data[x]['plugin_message'] + '</td>';
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
            $(".container1").css('background-color','#f0f2f5');
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
    let data1 = $(this).attr("data-name");
    // // console.log(data)
    let b = new Base64();
    let data = JSON.parse(b.decode(data1));

    let ioc_html=get_iochtml(data);


    let attack_body_html=get_attack_body(data['server_ip'],data['attack_source']);

    var html = '<div class="card">';
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
    // html += '<tr><td>事件类型</td><td>' + data['event_type'] + '</td></tr>';
    html += '<tr><td>事件发生时间</td><td>' + data['event_time'] + '</td></tr>';
    html += '<tr><td>服务器名称</td><td>' + data['server_hostname'] + '</td></tr>';
    // html += '<tr><td>event_id</td><td>' + data['event_id'] + '</td></tr>';
    html += '<tr><td>攻击类型</td><td>' + data['attack_type'] + '</td></tr>';
    html += '<tr><td>攻击参数</td><td>' + data['attack_params'] + '</td></tr>';
    html += '<tr><td>调用栈</td><td>' + data['stack_trace'] + '</td></tr>';
    // html += '<tr><td>插件名称</td><td>' + data['plugin_name'] + '</td></tr>';
    html += '<tr><td>插件消息</td><td>' + data['plugin_message'] + '</td></tr>';
    html += '<tr><td>插件置信度</td><td>' + data['plugin_confidence'] + '</td></tr>';
    html += '<tr><td>是否拦截 block或log</td><td>' + data['intercept_state'] + '</td></tr>';
    html += '<tr><td>请求id</td><td>' + data['request_id'] + '</td></tr>';
    html += '<tr><td>攻击来源IP</td><td>' + data['attack_source'] + '</td></tr>';
    html += '<tr><td>被攻击目标域名</td><td>' + data['target'] + '</td></tr>';
    html += '<tr><td>被攻击目标IP</td><td>' + data['server_ip'] + '</td></tr>';
    html += '<tr><td>被攻击目标端口</td><td>' + data['target_port'] + '</td></tr>';
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
    html += '<div>';



    $("#detailed_report_body").text("").append(html);
    // $("#ioc_body").text("").append(ioc_html);
    //  $("#attack_body").text("").append(attack_body_html);

    //$("#attack_body").text("");
    $(".myModalLabel").text("攻击事件");
    $("#myModal").modal("show");

});
function get_iochtml(data)
{

    console.log(data);
    let attack_type=data['attack_type1'];
    let obj_title='';
    let obj_code='';
    let code=JSON.parse(data['attack_params']);
    let db_server='';
    console.log(attack_type);

    switch (attack_type) {
        case 'command':
            obj_title="执行命令";
            obj_code=code['command'];
            break;
        case 'deserialization':
            obj_title="反序列化类";
            obj_code=code['clazz'];
            break;
        case 'directory':
            obj_title="访问目录";
            obj_code=code['realpath'];
            break;
        case 'fileUpload':
            obj_title="脚本文件上传";
            obj_code=code['filename'];
            break;
        case 'ognl':
            obj_title="OGNL表达式";
            obj_code=code['expression'];
            break;
        case 'readFile':
            obj_title="读取文件";
            obj_code=code['realpath'];
            break;
        case 'request':
            obj_title="";
            obj_code="";
            break;
        case 'request_body':
            // obj_title="";
            // obj_code="";
            break;
        case 'sql':
            obj_title="SQL语句";
            obj_code=code['query']
            break;
        case 'sqlSlowQuery':
            obj_title="查询条数";
            obj_code=code['query_count'];
            break;

        case 'ssrf':
            obj_title="访问URL";
            obj_code=code['url'];
            break;
        case 'webshell_command':
            obj_title="执行命令";
            obj_code=code['command'];
            break;
        case 'webshell_eval':
            obj_title="执行php代码";

            if (code.hasOwnProperty('eval')) {
                obj_code='eval('+code['eval']+')';
            }
            if (code.hasOwnProperty('assert')) {
                obj_code='assert('+code['assert']+')';
            }
            break;
        case 'writeFile':
            obj_title="上传文件";
            obj_code=code['realpath'];
            break;
        case 'xxe':
            obj_title="注入实体";
            obj_code=code['entity'];
            break;
        default:
            break;
    }
    let iochtml="";


    if (attack_type==='request')
    {
        iochtml=`
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
                                                        <p id="httpQueryString" data-toggle="tooltip" data-html="true" data-delay="200" data-original-title="" data-trigger="manual">
                                                         ${data['body']}
                                                        </p>

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
    }

    else {

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
                                                        <p id="httpQueryString" data-toggle="tooltip" data-html="true" data-delay="200" data-original-title="" data-trigger="manual">
                                                        ${data['body']}
                                                        </p>

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
                                                            <p>${data['stack_trace'].split(" ")[0].split("\n")[0]}</p>
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
                                                        <td class="td-03-5">
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
    return iochtml;
}



function get_attack_body(ip,attack_source)
{
    console.log("第一次加载 get_attack_body");
    console.log(ip,"---",attack_source);
    let parm={};
    parm['ip']=ip;
    parm['last']=0;
    parm['attack_source']=attack_source;
    let temp_html=``;

    $.ajax({
        url: "attack/query_source/",
        type: 'POST',
        data: parm,
        async: false,
        //dataType: "json",
        success: function (data_list) {

            console.log(data_list);
            temp_html+=` <tr>
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

            for( x in data_list['list'])
            {
                let temp_data=data_list['list'][x];
                temp_html+=`
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

            console.log("第一次查询结果 remain剩余",data_list["remain"]);
            $("#attack_body").text("").append(temp_html);


            if (data_list["remain"] !== 0) {
                append_attack_body(ip, data_list['last_next'], attack_source);
            }
            else {
                append_attack_body_end()
            }

        }});


    //return temp_html;
}
var  times=0;

function append_attack_body(ip,last,attack_source)
{
    //let  temp_list=  append_attack_body_more(ip,last,attack_source);
    let last_next=10;
    let html;
    let remian_next=10;

    let loadflag=true;
    $("#attack_traceability_body").unbind("scroll").bind("scroll",function(){


        let windowHeight = $("#attack_traceability_body").height();//当前窗口的高度
        let scrollTop = $("#attack_traceability_body").scrollTop();//当前滚动条从上往下滚动的距离
        let docHeight = $("#event_detail_attack_detail_table").height(); //当前文档的高度
        //console.log(windowHeight,scrollTop,windowHeight+scrollTop,docHeight);
        if(windowHeight > docHeight && loadflag){
            append_attack_body_end();
            loadflag=false;
        }
        if (scrollTop + windowHeight >= docHeight && loadflag) {
            if (remian_next >=0) {

                temp_list = append_attack_body_more(ip, last_next, attack_source);
                remian_next = temp_list[2];
                last_next = temp_list[0];
                html = temp_list[1];
                $("#attack_body").append(html);
                //$("#remain_num").text("").append(remian_next);
            }
            if ( remian_next ===0) {
                append_attack_body_end();
                //$("#remain_num").text("").append(remian_next);
                remian_next=-1;
                loadflag=false;
            }
        }

    });

}
function append_attack_body_more(ip,last,attack_source) {

    let parm={};
    parm['ip']=ip;
    parm['last']=last;
    parm['attack_source']=attack_source;
    console.log(parm);
    let temp_html=``;
    let more_html = `` ;
    //剩未查询的数量
    let remain_num=0;
    let last_nenxt;
    let ramain;

    $.ajax({
        url: "attack/query_source/",
        type: 'POST',
        data: parm,
        async: false,
        success: function (data_list) {

            for( x in data_list['list'])
            {
                let temp_data=data_list['list'][x];
                temp_html+=`
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
            last_nenxt=data_list['last_next'];
            ramain = data_list['remain'];

        }});

    return [last_nenxt,temp_html,ramain]
}
function append_attack_body_end()
{
    let html=` <tr>
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
$(document).on("click", ".detail-a-agent", function () {

    let id = $(this).attr("data-name");
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
            //// console.log(data_list['algorithm_config']);
            // // console.log(data_list['globalConfig']);
            // // console.log(data_list['httpProtectConfig']);
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
    $("#algorithm_config_body").html(algorithm_html);
    $("#httpProtec_config_body").html(httpProtec_html);

    $("#globalConfig_body").html(global_html);
    $("#setting").modal("show");
});

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
    dic.transformer_deser = "transformer 反序列化攻击";
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
    // aa.val(JSON.stringify(data1,undefined,4));
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
            // console.log(data);

        }
    });

    $("#setting").modal("hide");

}

function formSubmit(){
    $.ajax({
        type: "post",
        //async : false, //同步请求
        url: "add_host",
        data: {"remarkmsg": $("#remarkmsg").html()},
        // timeout:1000,
        success: function (data) {
            if(!data['code']) {
                $("#agent-id").html(data['agent_id'])
            }else{
                alert('添加主机失败。');
            }
        }
    });
    //document.getElementById("myForm").submit();
}