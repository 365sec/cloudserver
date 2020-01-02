function barChartServer(data,div) {
    let data_list_type = [];
    let data_list_type_dic = [];
    var barchartv = echarts.init(document.getElementById(div));
    for (x in data) {
        data_list_type.push(data[x][0]);
        data_list_type_dic.push(data[x][1]);
    }
    option = {
        color: ['#2d7ba4'],
        tooltip:{
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        grid: {
            left: 20,
            right: 20,
            top: 20,
            bottom: 20,
            containLabel: true
        },
        xAxis :{
            type : 'category',
            data : data_list_type,
            axisLabel:{
                rotate: 30,
            },
            axisTick: {
                alignWithLabel: true,
                show: false
            },
        },
        yAxis:{
            type : 'value',
        },
        series:[
            {
                name:'直接访问',
                type:'bar',
                barWidth: 25,
                label:{
                    show: true,
                    position: 'top',
                    distance: 5,
                    color: "#333",
                    formatter:'{c}',
                },
                data:data_list_type_dic
            }
        ]
    }
    barchartv.setOption(option)
}
function pieChartServer(data,div) {
    var piechart = echarts.init(document.getElementById(div));
    option = {
        legend: {
            orient: 'horizontal',
            top: 20,
            show: true,
            backgroundColor: '#eee',

        },
        series: [{
            name: '威胁指数',
            type: 'pie',
            radius: '60%',
            center: ['50%', '55%'],
            data: function () {
                let res = [];
                for (let x in data) {
                    res.push({
                        name: data[x][0],
                        value: data[x][1],
                        itemStyle: {
                            normal: {
                                label: {
                                    show: true,
                                },
                                labelLine: {
                                    show: true
                                }
                            }
                        }

                    });
                }
                return res;
            }(),
            label: {
                normal: {
                    textStyle: {
                        fontSize: 14,
                    },
                    formatter: '{b}:  {c}',
                }
            },
            grid: {
                left: 20,
                top: 20,
                right: 20,
                bottom: 20,
                containLabel: true
            },

        }],
        color: [
            '#C23531',
            '#D48205',
            '#6AAEB8',
            '#399B39'
        ],
        backgroundColor: '#fff'
    };
    piechart.setOption(option)
}

function lineChartServer(data,div) {
    var linechart = echarts.init(document.getElementById(div));

    var dateList = data.map(function (item) {
        return item[0];
    });
    var valueList = data.map(function (item) {
        return item[1];
    });

    option = {
        // Make gradient line here
        grid:{
            top: 20,
            left: 10,
            bottom: 20,
            right: 20,
            containLabel: true
        },
        color: ['#ff3333'],
        calculable : false,
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
        xAxis: {
            type : 'category',
            boundaryGap : false,
            axisLine:{
                lineStyle:{
                    color: '#b3b3b3',
                    width: 1,
                    type: 'solid'
                }
            },
            data: dateList,
        },
        yAxis:{
            type : 'value',
            axisLine:{
                lineStyle:{
                    color: '#b3b3b3',
                    width: 1,
                    type: 'solid'
                }
            },
            splitNumber:10,
        },
        series: [{
            type:'line',
            smooth:true,
            itemStyle: {
                normal: {
                    lineStyle:{color:'#ff3333'},
                    areaStyle: {type: 'default', color:'rgba(255, 51, 51, 0.15)'}
                }
            },
            data: valueList,

        }]
    };

    linechart.setOption(option)
}
//进程端口资产顶部饼状图
function agent_process_num_echart_pie(div,data) {
    var content = document.getElementById(div);
    var height = content.clientHeight;
    var width = content.clientWidth;
    var shade_width = width*.75 - height*.41;
    $('.chart-con-shade').css('width',shade_width);
    var chart = echarts.init(content);
    // var color = ["#8d7fec", "#5085f2","#e75fc3","#f87be2","#f2719a","#fca4bb","#f59a8f","#fdb301","#57e7ec","#cf9ef1"]
    var datares = [];
    for (x in data) {
        datares.push({'name':data[x][0],'value':data[x][1]})
    }
    var option = {
        legend: {
            orient: 'vertical',
            right: 0,
            y: 'center'
        },
        series:[{
            type: 'pie',
            minAngle: 2,
            clockwise: false,//逆时针
            radius: ["60%", "85%"],
            center: ["25%", "50%"],
            label:{
                show: false,
                position: 'center',
                formatter: function (param) {
                    var title1 = param.data.name.split('(')[0];
                    var title2 = param.data.name.split('(')[1];
                    var content = param.data.value+'( '+param.percent+'% )';
                    return '{title|'+title1+'\n'+title2+'}\n{value|'+content+'}';
                },
                emphasis: {
                    show: true,
                    rich:{
                        title:{
                            color: "#666",
                            fontSize: 14,
                            align: 'center',
                            verticalAlign: 'middle',
                            lineHeight: 20,
                            padding: 8,
                        },
                        value:{
                            color: "#004881",
                            align: 'center',
                            fontSize: 24,
                            verticalAlign: 'middle',
                        }
                    }
                }
            },
            itemStyle: { //图形样式
                normal: {
                    borderColor: '#ffffff',
                    borderWidth: 6,
                },
            },
            data: datares
        }]
    };

    chart.setOption(option);
    let index = 0; // 高亮索引
    chart.dispatchAction({
        type: "highlight",
        seriesIndex: index,
        dataIndex: index
    });
    chart.on("mouseover", function(param) {
        if (param.dataIndex != index) {
            chart.dispatchAction({
                type: "downplay",
                seriesIndex: 0,
                dataIndex: index
            });
        }
    });
    chart.on("mouseout", function(param) {
        index = param.dataIndex;
        chart.dispatchAction({
            type: "highlight",
            seriesIndex: 0,
            dataIndex: param.dataIndex
        });
    });
}
//进程端口资产顶部柱状图
function agent_process_num_echart_bar(div,data) {
    var chart = echarts.init(document.getElementById(div));
    var datares = [];
    let x_data=[];
    for (x in data) {
        datares.push({'name':data[x][0],'value':data[x][1]})
        x_data.push(data[x][0])
    }
    var barcolor = ['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3']
    var option = {
        tooltip: {
            show: "true",
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        grid: {
            left: '2%',
            right: '5%',
            bottom: '2%',
            top: '2%',
            containLabel: true
        },
        xAxis: [
            {show: false,},
            {show: false,}
        ],
        yAxis: {
            type: 'category',
            inverse: true,
            show: true,
            axisLine: {
                show: false
            },
            splitLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            data: x_data,
        },
        series: [
            {
                type: 'bar',
                barWidth: 15,
                itemStyle: {
                    normal: {
                        show: true,
                        barBorderRadius: 20,
                        label:{
                            show: true,
                            position: 'right',
                            textStyle:{
                                color: '#333',
                            },

                        },
                        color: function(param) {
                            return  barcolor[param.dataIndex];
                        },
                    },

                },
                data: datares
            },

        ]
    }
    chart.setOption(option);
}