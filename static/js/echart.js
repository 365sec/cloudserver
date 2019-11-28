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