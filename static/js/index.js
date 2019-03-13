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
            html += '<th>是否禁用该探针</th>';
            html += '<th>设置</th>';
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
                html += '<td>' + data[x]['online'] + '</td>';
                html += '<td>' + data[x]['disabled'] + '</td>';
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

function overviewFlash() {

    $.ajax({
        url: "overviewQuery",
        type: 'POST',
        data: {
            "page": "asdsad"
        },
        //dataType: "json",
        success: function (data_list) {
            //  // console.log(data_list['attrack_source_dic']);
            // // console.log(data_list['attrack_time_dic']);
            //  // console.log(data_list['attrack_ua_dic']);
            //  // console.log(data_list['attrack_type_times']);
            //  // console.log(data_list['attrack_recent_warning']);

            attack_source_charts(data_list['attrack_source_dic']);
            attrack_ua_charts(data_list['attrack_ua_dic']);
            attrack_time_charts(data_list['attrack_time_dic']);
            attrack_type_times(data_list['attrack_type_times']);
            attrack_recent_warning(data_list['attrack_recent_warning']['data']);
            chart_map();
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
    series: [{
        name: '威胁指数',
        type: 'pie',
        radius: '68%',
        center: ['50%', '50%'],
        clockwise: false,
        data: [{
            value: 45,
            name: '高风险'
        }, {
            value: 25,
            name: '种风险'
        }, {
            value: 15,
            name: '低风险'
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
    mycharts_source.setOption(option)
}

function chart_map() {
    var myChart = echarts.init(document.getElementById('chart_map'));
	var geoCoordMap = {
    "海门":[121.15,31.89],
    "鄂尔多斯":[109.781327,39.608266],
    "招远":[120.38,37.35],
    "舟山":[122.207216,29.985295],
    "齐齐哈尔":[123.97,47.33],
    "盐城":[120.13,33.38],
    "赤峰":[118.87,42.28],
    "青岛":[120.33,36.07],
    "乳山":[121.52,36.89],
    "金昌":[102.188043,38.520089],
    "泉州":[118.58,24.93],
    "莱西":[120.53,36.86],
    "日照":[119.46,35.42],
    "胶南":[119.97,35.88],
    "南通":[121.05,32.08],
    "拉萨":[91.11,29.97],
    "云浮":[112.02,22.93],
    "梅州":[116.1,24.55],
    "文登":[122.05,37.2],
    "上海":[121.48,31.22],
    "攀枝花":[101.718637,26.582347],
    "威海":[122.1,37.5],
    "承德":[117.93,40.97],
    "厦门":[118.1,24.46],
    "汕尾":[115.375279,22.786211],
    "潮州":[116.63,23.68],
    "丹东":[124.37,40.13],
    "太仓":[121.1,31.45],
    "曲靖":[103.79,25.51],
    "烟台":[121.39,37.52],
    "福州":[119.3,26.08],
    "瓦房店":[121.979603,39.627114],
    "即墨":[120.45,36.38],
    "抚顺":[123.97,41.97],
    "玉溪":[102.52,24.35],
    "张家口":[114.87,40.82],
    "阳泉":[113.57,37.85],
    "莱州":[119.942327,37.177017],
    "湖州":[120.1,30.86],
    "汕头":[116.69,23.39],
    "昆山":[120.95,31.39],
    "宁波":[121.56,29.86],
    "湛江":[110.359377,21.270708],
    "揭阳":[116.35,23.55],
    "荣成":[122.41,37.16],
    "连云港":[119.16,34.59],
    "葫芦岛":[120.836932,40.711052],
    "常熟":[120.74,31.64],
    "东莞":[113.75,23.04],
    "河源":[114.68,23.73],
    "淮安":[119.15,33.5],
    "泰州":[119.9,32.49],
    "南宁":[108.33,22.84],
    "营口":[122.18,40.65],
    "惠州":[114.4,23.09],
    "江阴":[120.26,31.91],
    "蓬莱":[120.75,37.8],
    "韶关":[113.62,24.84],
    "嘉峪关":[98.289152,39.77313],
    "广州":[113.23,23.16],
    "延安":[109.47,36.6],
    "太原":[112.53,37.87],
    "清远":[113.01,23.7],
    "中山":[113.38,22.52],
    "昆明":[102.73,25.04],
    "寿光":[118.73,36.86],
    "盘锦":[122.070714,41.119997],
    "长治":[113.08,36.18],
    "深圳":[114.07,22.62],
    "珠海":[113.52,22.3],
    "宿迁":[118.3,33.96],
    "咸阳":[108.72,34.36],
    "铜川":[109.11,35.09],
    "平度":[119.97,36.77],
    "佛山":[113.11,23.05],
    "海口":[110.35,20.02],
    "江门":[113.06,22.61],
    "章丘":[117.53,36.72],
    "肇庆":[112.44,23.05],
    "大连":[121.62,38.92],
    "临汾":[111.5,36.08],
    "吴江":[120.63,31.16],
    "石嘴山":[106.39,39.04],
    "沈阳":[123.38,41.8],
    "苏州":[120.62,31.32],
    "茂名":[110.88,21.68],
    "嘉兴":[120.76,30.77],
    "长春":[125.35,43.88],
    "胶州":[120.03336,36.264622],
    "银川":[106.27,38.47],
    "张家港":[120.555821,31.875428],
    "三门峡":[111.19,34.76],
    "锦州":[121.15,41.13],
    "南昌":[115.89,28.68],
    "柳州":[109.4,24.33],
    "三亚":[109.511909,18.252847],
    "自贡":[104.778442,29.33903],
    "吉林":[126.57,43.87],
    "阳江":[111.95,21.85],
    "泸州":[105.39,28.91],
    "西宁":[101.74,36.56],
    "宜宾":[104.56,29.77],
    "呼和浩特":[111.65,40.82],
    "成都":[104.06,30.67],
    "大同":[113.3,40.12],
    "镇江":[119.44,32.2],
    "桂林":[110.28,25.29],
    "张家界":[110.479191,29.117096],
    "宜兴":[119.82,31.36],
    "北海":[109.12,21.49],
    "西安":[108.95,34.27],
    "金坛":[119.56,31.74],
    "东营":[118.49,37.46],
    "牡丹江":[129.58,44.6],
    "遵义":[106.9,27.7],
    "绍兴":[120.58,30.01],
    "扬州":[119.42,32.39],
    "常州":[119.95,31.79],
    "潍坊":[119.1,36.62],
    "重庆":[106.54,29.59],
    "台州":[121.420757,28.656386],
    "南京":[118.78,32.04],
    "滨州":[118.03,37.36],
    "贵阳":[106.71,26.57],
    "无锡":[120.29,31.59],
    "本溪":[123.73,41.3],
    "克拉玛依":[84.77,45.59],
    "渭南":[109.5,34.52],
    "马鞍山":[118.48,31.56],
    "宝鸡":[107.15,34.38],
    "焦作":[113.21,35.24],
    "句容":[119.16,31.95],
    "北京":[116.46,39.92],
    "徐州":[117.2,34.26],
    "衡水":[115.72,37.72],
    "包头":[110,40.58],
    "绵阳":[104.73,31.48],
    "乌鲁木齐":[87.68,43.77],
    "枣庄":[117.57,34.86],
    "杭州":[120.19,30.26],
    "淄博":[118.05,36.78],
    "鞍山":[122.85,41.12],
    "溧阳":[119.48,31.43],
    "库尔勒":[86.06,41.68],
    "安阳":[114.35,36.1],
    "开封":[114.35,34.79],
    "济南":[117,36.65],
    "德阳":[104.37,31.13],
    "温州":[120.65,28.01],
    "九江":[115.97,29.71],
    "邯郸":[114.47,36.6],
    "临安":[119.72,30.23],
    "兰州":[103.73,36.03],
    "沧州":[116.83,38.33],
    "临沂":[118.35,35.05],
    "南充":[106.110698,30.837793],
    "天津":[117.2,39.13],
    "富阳":[119.95,30.07],
    "泰安":[117.13,36.18],
    "诸暨":[120.23,29.71],
    "郑州":[113.65,34.76],
    "哈尔滨":[126.63,45.75],
    "聊城":[115.97,36.45],
    "芜湖":[118.38,31.33],
    "唐山":[118.02,39.63],
    "平顶山":[113.29,33.75],
    "邢台":[114.48,37.05],
    "德州":[116.29,37.45],
    "济宁":[116.59,35.38],
    "荆州":[112.239741,30.335165],
    "宜昌":[111.3,30.7],
    "义乌":[120.06,29.32],
    "丽水":[119.92,28.45],
    "洛阳":[112.44,34.7],
    "秦皇岛":[119.57,39.95],
    "株洲":[113.16,27.83],
    "石家庄":[114.48,38.03],
    "莱芜":[117.67,36.19],
    "常德":[111.69,29.05],
    "保定":[115.48,38.85],
    "湘潭":[112.91,27.87],
    "金华":[119.64,29.12],
    "岳阳":[113.09,29.37],
    "长沙":[113,28.21],
    "衢州":[118.88,28.97],
    "廊坊":[116.7,39.53],
    "菏泽":[115.480656,35.23375],
    "合肥":[117.27,31.86],
    "武汉":[114.31,30.52],
    "大庆":[125.03,46.58]
};

    var convertData = function (data) {
        var res = [];
        for (var i = 0; i < data.length; i++) {
            var geoCoord = geoCoordMap[data[i].name];
            if (geoCoord) {
                res.push({
                    name: data[i].name,
                    value: geoCoord.concat(data[i].value)
                });
            }
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
        grid:{
            left: '0',
            top: '0',
            right: '0',
            bottom: '0',
            containLabel: false
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
            map: 'world',
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
                name: '全国分布',
                type: 'scatter',
                coordinateSystem: 'geo',
                data: convertData([
                    {name: "海门", value: 9},
                    {name: "鄂尔多斯", value: 12},
                    {name: "招远", value: 12},
                    {name: "舟山", value: 12},
                    {name: "齐齐哈尔", value: 14},
                    {name: "盐城", value: 15},
                    {name: "赤峰", value: 16},
                    {name: "青岛", value: 18},
                    {name: "乳山", value: 18},
                    {name: "金昌", value: 19},
                    {name: "泉州", value: 21},
                    {name: "莱西", value: 21},
                    {name: "日照", value: 21},
                    {name: "胶南", value: 22},
                    {name: "南通", value: 23},
                    {name: "拉萨", value: 24},
                    {name: "云浮", value: 24},
                    {name: "梅州", value: 25},
                    {name: "文登", value: 25},
                    {name: "上海", value: 25},
                    {name: "攀枝花", value: 25},
                    {name: "威海", value: 25},
                    {name: "承德", value: 25},
                    {name: "厦门", value: 26},
                    {name: "汕尾", value: 26},
                    {name: "潮州", value: 26},
                    {name: "丹东", value: 27},
                    {name: "太仓", value: 27},
                    {name: "曲靖", value: 27},
                    {name: "烟台", value: 28},
                    {name: "福州", value: 29},
                    {name: "瓦房店", value: 30},
                    {name: "即墨", value: 30},
                    {name: "抚顺", value: 31},
                    {name: "玉溪", value: 31},
                    {name: "张家口", value: 31},
                    {name: "阳泉", value: 31},
                    {name: "莱州", value: 32},
                    {name: "湖州", value: 32},
                    {name: "汕头", value: 32},
                    {name: "昆山", value: 33},
                    {name: "宁波", value: 33},
                    {name: "湛江", value: 33},
                    {name: "揭阳", value: 34},
                    {name: "荣成", value: 34},
                    {name: "连云港", value: 35},
                    {name: "葫芦岛", value: 35},
                    {name: "常熟", value: 36},
                    {name: "东莞", value: 36},
                    {name: "河源", value: 36},
                    {name: "淮安", value: 36},
                    {name: "泰州", value: 36},
                    {name: "南宁", value: 37},
                    {name: "营口", value: 37},
                    {name: "惠州", value: 37},
                    {name: "江阴", value: 37},
                    {name: "蓬莱", value: 37},
                    {name: "韶关", value: 38},
                    {name: "嘉峪关", value: 38},
                    {name: "广州", value: 38},
                    {name: "延安", value: 38},
                    {name: "太原", value: 39},
                    {name: "清远", value: 39},
                    {name: "中山", value: 39},
                    {name: "昆明", value: 39},
                    {name: "寿光", value: 40},
                    {name: "盘锦", value: 40},
                    {name: "长治", value: 41},
                    {name: "深圳", value: 41},
                    {name: "珠海", value: 42},
                    {name: "宿迁", value: 43},
                    {name: "咸阳", value: 43},
                    {name: "铜川", value: 44},
                    {name: "平度", value: 44},
                    {name: "佛山", value: 44},
                    {name: "海口", value: 44},
                    {name: "江门", value: 45},
                    {name: "章丘", value: 45},
                    {name: "肇庆", value: 46},
                    {name: "大连", value: 47},
                    {name: "临汾", value: 47},
                    {name: "吴江", value: 47},
                    {name: "石嘴山", value: 49},
                    {name: "沈阳", value: 50},
                    {name: "苏州", value: 50},
                    {name: "茂名", value: 50},
                    {name: "嘉兴", value: 51},
                    {name: "长春", value: 51},
                    {name: "胶州", value: 52},
                    {name: "银川", value: 52},
                    {name: "张家港", value: 52},
                    {name: "三门峡", value: 53},
                    {name: "锦州", value: 54},
                    {name: "南昌", value: 54},
                    {name: "柳州", value: 54},
                    {name: "三亚", value: 54},
                    {name: "自贡", value: 56},
                    {name: "吉林", value: 56},
                    {name: "阳江", value: 57},
                    {name: "泸州", value: 57},
                    {name: "西宁", value: 57},
                    {name: "宜宾", value: 58},
                    {name: "呼和浩特", value: 58},
                    {name: "成都", value: 58},
                    {name: "大同", value: 58},
                    {name: "镇江", value: 59},
                    {name: "桂林", value: 59},
                    {name: "张家界", value: 59},
                    {name: "宜兴", value: 59},
                    {name: "北海", value: 60},
                    {name: "西安", value: 61},
                    {name: "金坛", value: 62},
                    {name: "东营", value: 62},
                    {name: "牡丹江", value: 63},
                    {name: "遵义", value: 63},
                    {name: "绍兴", value: 63},
                    {name: "扬州", value: 64},
                    {name: "常州", value: 64},
                    {name: "潍坊", value: 65},
                    {name: "重庆", value: 66},
                    {name: "台州", value: 67},
                    {name: "南京", value: 67},
                    {name: "滨州", value: 70},
                    {name: "贵阳", value: 71},
                    {name: "无锡", value: 71},
                    {name: "本溪", value: 71},
                    {name: "克拉玛依", value: 72},
                    {name: "渭南", value: 72},
                    {name: "马鞍山", value: 72},
                    {name: "宝鸡", value: 72},
                    {name: "焦作", value: 75},
                    {name: "句容", value: 75},
                    {name: "北京", value: 79},
                    {name: "徐州", value: 79},
                    {name: "衡水", value: 80},
                    {name: "包头", value: 80},
                    {name: "绵阳", value: 80},
                    {name: "乌鲁木齐", value: 84},
                    {name: "枣庄", value: 84},
                    {name: "杭州", value: 84},
                    {name: "淄博", value: 85},
                    {name: "鞍山", value: 86},
                    {name: "溧阳", value: 86},
                    {name: "库尔勒", value: 86},
                    {name: "安阳", value: 90},
                    {name: "开封", value: 90},
                    {name: "济南", value: 92},
                    {name: "德阳", value: 93},
                    {name: "温州", value: 95},
                    {name: "九江", value: 96},
                    {name: "邯郸", value: 98},
                    {name: "临安", value: 99},
                    {name: "兰州", value: 99},
                    {name: "沧州", value: 100},
                    {name: "临沂", value: 103},
                    {name: "南充", value: 104},
                    {name: "天津", value: 105},
                    {name: "富阳", value: 106},
                    {name: "泰安", value: 112},
                    {name: "诸暨", value: 112},
                    {name: "郑州", value: 113},
                    {name: "哈尔滨", value: 114},
                    {name: "聊城", value: 116},
                    {name: "芜湖", value: 117},
                    {name: "唐山", value: 119},
                    {name: "平顶山", value: 119},
                    {name: "邢台", value: 119},
                    {name: "德州", value: 120},
                    {name: "济宁", value: 120},
                    {name: "荆州", value: 127},
                    {name: "宜昌", value: 130},
                    {name: "义乌", value: 132},
                    {name: "丽水", value: 133},
                    {name: "洛阳", value: 134},
                    {name: "秦皇岛", value: 136},
                    {name: "株洲", value: 143},
                    {name: "石家庄", value: 147},
                    {name: "莱芜", value: 148},
                    {name: "常德", value: 152},
                    {name: "保定", value: 153},
                    {name: "湘潭", value: 154},
                    {name: "金华", value: 157},
                    {name: "岳阳", value: 169},
                    {name: "长沙", value: 175},
                    {name: "衢州", value: 177},
                    {name: "廊坊", value: 193},
                    {name: "菏泽", value: 194},
                    {name: "合肥", value: 229},
                    {name: "武汉", value: 273},
                    {name: "大庆", value: 279}
                ]),
                symbolSize: 12,
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
    myChart.setOption(option);
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
        async: false,
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
            html_select += '<span class="btnvalue">报警消息: </span>';
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
    $("#myModalLabel").text("攻击事件");
    $("#myModal").modal("show");

});
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
