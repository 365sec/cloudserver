function overview_click() {
    /*
     * 安全总览事件被点击
     *
     */
    $.ajax( {
        url: 'overview',
        dataType:"html",
        type: "get",

        success: function(res){

            $("#div_container").html($(res));
            // $(".overviewDiv").show().siblings().hide();
            $(".container1").css('background-color', '#fff');
            overviewFlash();
        }

    });

    //     $.get("../../templates/overview.html", function(data) {
    //     $("#div_container").html(data)
    // })

}

function overviewFlash() {
    query_threat_level();
    query_attack_source(1);
    query_attack_times();
    query_attack_type();
    query_attack_warn();
}

function query_threat_level() {
    $.ajax({
        url: "query_threat_level",
        type: 'POST',
        data: {
            "page": "asdsad"
        },
        //dataType: "json",
        success: function (data_list) {
            // console.log(data_list['threat_level_dict']);
            attack_threat_level_charts(data_list['threat_level_dict'],'attrack_threat_level_dic_div');
        }
    });

}
//首页地图
function query_attack_source(show_continuous) {
    $.ajax({
        url: "query_attack_source",
        type: 'POST',
        data: {
            "flag": map_flag

        },
        //dataType: "json",
        success: function (data_list) {
            if(show_continuous) {
                attack_source_charts(data_list['attrack_source_dic']);
            }
            chart_map(data_list['attack_source_map']);
        }
    });

}
<!--首页地图切换-->
$(document).on('click', '#map-tab-world', function () {
    var myChart = echarts.init(document.getElementById('chart_map'));
    map_flag = 0;
    myChart.setOption({
        geo: {
            map: 'world'
        }
    });
    query_attack_source(0);
});
$(document).on('click', '#map-tab-China', function () {
    var myChart = echarts.init(document.getElementById('chart_map'));
    map_flag = 1;
    myChart.setOption({
        geo: {
            map: 'china'
        }
    });
    query_attack_source(0);

});
var tabs = function(tab){
    tab.click(function(){
        var indx = tab.index(this);
        tab.removeClass('current');
        $(this).addClass('current');
    })
}
//定时刷新
if($('#div_container').find('div').className == 'overviewDiv'){
    setInterval(function () {
        if($(".overviewDiv").css('display') != 'none'){
            overviewFlash();
        }
    },15000);
}
<!--首页地图切换-->
//外部威胁趋势
function query_attack_times() {
    $.ajax({
        url: "query_attack_times",
        type: 'POST',
        data: {
            "page": "asdsad"
        },
        //dataType: "json",
        success: function (data_list) {
            attrack_time_charts(data_list['attrack_time_dic'],'attrack_time_dic_div');
        }
    });

}
//攻击类型排行
function query_attack_type() {
    $.ajax({
        url: "query_attack_type",
        type: 'POST',
        data: {
            "page": "asdsad"
        },
        //dataType: "json",
        success: function (data_list) {
            attrack_type_times(data_list['attrack_type_times'],'attack_type_dic_div');
        }
    });

}
//近期攻击警告
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

//攻击类型排行
function attrack_type_times(data,div) {

    /*
    * 攻击类型 次数*/
    let data_list_type = [];
    let data_list_type_dic = [];
    if (mycharts_attrack_type_times != null && mycharts_attrack_type_times != "" && mycharts_attrack_type_times != undefined) {
        mycharts_attrack_type_times.dispose();
    }

    if(!document.getElementById(div)){
        return false;
    }
    mycharts_attrack_type_times = echarts.init(document.getElementById(div));
    data = data.reverse();
    for (x in data) {

        data_list_type.push(data[x][0]);
        data_list_type_dic.push(data[x][1]);
        //data_list_ua_dic.push({'name':data[x][0],'value':data[x][1]})
    }

    option = {
        color: "#2D7BA4",
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
//外部威胁趋势
function attrack_time_charts(data,div) {
    /*
    * 近期攻击时间  每个时间被攻击的次数*/
    data.reverse();
    if(!document.getElementById(div)){
        return false;
    }
    if (mycharts_attrack_time != null
        && mycharts_attrack_time != ""
        && mycharts_attrack_time != undefined) {
        mycharts_attrack_time.dispose();
    }
    mycharts_attrack_time = echarts.init(document.getElementById(div));

    var dateList = data.map(function (item) {
        return item[0];
    });
    var valueList = data.map(function (item) {
        return item[1];
    });

    option = {
        // Make gradient line here
        color: "#C23531",
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
            itemStyle: {
                normal: {
                    color: '#2D7BA4',
                    lineStyle: {
                        color: '#2D7BA4'
                    }
                }
            }
        }]
    };

    mycharts_attrack_time.setOption(option)
}

function attack_threat_level_charts(data,div) {
    // console.log(data)
    if (mycharts_attack_threat_level != null
        && mycharts_attack_threat_level != ""
        && mycharts_attack_threat_level != undefined) {
        mycharts_attack_threat_level.dispose();
    }
    if(!document.getElementById(div)){
        return false;
    }
    mycharts_attack_threat_level = echarts.init(document.getElementById(div));

    option = {
        series: [{
            name: '威胁指数',
            type: 'pie',
            radius: '65%',
            center: ['50%', '60%'],
            clockwise: false,
            data: [{
                value: data[0],
                name: '高危'
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
            grid: {
                left: '0',
                top: '0',
                right: '0',
                bottom: '0',
                containLabel: true
            },
            labelLine: {
                normal: {
                    show: true,
                    length: 20,
                    length2: 10
                }
            },
            itemStyle: {
                normal: {
                    borderWidth: 1,
                    borderColor: '#ffffff',
                },
                emphasis: {
                    borderWidth: 0,
                }
            }
        }],
        color: [
            '#C23531',
            '#D48205',
            '#6AAEB8',
            '#399B39'
        ],
        backgroundColor: '#fff'
    };

    mycharts_attack_threat_level.setOption(option)
}

var map_flag = 1;

function chart_map(attack_source_data) {
    if (mycharts__map != null
        && mycharts__map != ""
        && mycharts__map != undefined) {
        mycharts__map.dispose();
    }
    if(!document.getElementById('chart_map')){
        return false;
    }
    mycharts__map = echarts.init(document.getElementById('chart_map'));
    if (map_flag == 1)
        geo_map = "china"
    else
        geo_map = "world"

    var convertData = function (data) {
        var res = [];
        for (var ip in data) {
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
            x: 'center',
            textStyle: {
                color: '#fff'
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: '{b}'
        },
        grid: {
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
                    areaColor: '#004881',
                    borderColor: '#fff',
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
                    normal: {
                        borderColor: '#fff',
                        color: '#577ceb',
                    },
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
    if (mycharts_attack_source != null
        && mycharts_attack_source != ""
        && mycharts_attack_source != undefined) {
        mycharts_attack_source.dispose();
    }
    if(!document.getElementById('attrack_source_dic_div')){
        return false;
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

        color: "#2D7BA4",
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

//初始化echarts盒子宽高
function chartDiv_init(obj) {
    $(obj).css('width', $(obj).width());
    $(obj).css('height', $(obj).height());
}

$(function () {
    tabs($(".map-tab"));
    //初始化echarts盒子宽高
    chartDiv_init('attack_type_dic_div');
    chartDiv_init('chart_map');
    chartDiv_init('attrack_source_dic_div');
    chartDiv_init('attrack_time_dic_div');
    chartDiv_init('attrack_recent_warning_dic_div');
    chartDiv_init('attrack_threat_level_dic_div');
});
function tabs(tab){
    tab.click(function(){
        var indx = tab.index(this);
        tab.removeClass('current');
        $(this).addClass('current');
    })
}