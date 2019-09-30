function report_btn() {
    $.ajax({
                url: "/data_count",
                type: 'POST',
                data: {
                    "attack_time": $("#daterange-btn").val()
                },
                async: false,
                // dataType: "json",
                success: function (data_list) {

                    // data_list=JSON.stringify(data_list,null,4);
                    // $("#count_week").html("").append(data_list)
                    // console.log(data_list["attack_type"]);
                    barchart(data_list['attack_type'].reverse(),'attack_type_part');
                    barchart(data_list['attack_target'].reverse(),'attack_target_part');
                    attack_server_ip(data_list['attack_server_ip'].reverse(),'attack_server_ip_part');
                    barchartv(data_list['attack_server'].reverse(),'attack_server_part');
                    piechart(data_list['attack_level'],'attack_level_part');
                    // console.log(data_list['attack_scan'],typeof data_list['attack_scan']);
                    piechart1(data_list['attack_scan'],'attack_scan_part');
                    linechart(data_list['attack_time_dic'],'attack_time_dic_part');
                    attack_source(data_list['attack_source'],'#attack_source_part')
                }})
}

function count_div_click() {
    /*
     * 统计信息
     */

    $.ajax( {
        url: '/countreport',
        dataType:"html",
        type: "get",

        success: function(res){

            $("#div_container").html($(res));
            $(".container1").css('background-color', '#fff');
            if($(".daterangepicker").length > 0){
                $('.daterangepicker').remove();
            };
            let beginTimeStore = '';
            let endTimeStore = '';
            $('input[name="daterange"]').daterangepicker({
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
                if (!this.startDate) {
                    this.element.val('');
                } else {
                    this.element.val(this.startDate.format(this.locale.format) + this.locale.separator + this.endDate.format(this.locale.format));
                }
            });
            let now = new Date();
            var year=now.getFullYear();
            var month=now.getMonth()+1;
            var day=now.getDate();
            var hour=now.getHours();
            if(hour<10){
                hour = '0' +hour;
            }
            var minute=now.getMinutes();
            if(minute<10){
                minute = '0' +minute;
            }
            var second = now.getSeconds()
            if(second<10){
                second = '0' +second;
            }
            $('#now_time').text('');
            $('#now_time').append("报告时间："+ year+"-"+month+"-"+day+" "+hour+":"+minute+":"+second);
            $.ajax({
                url: "/data_count",
                type: 'POST',
                data: {
                    "attack_time": $("#daterange-btn").val()
                },
                async: false,
                // dataType: "json",
                success: function (data_list) {

                    // data_list=JSON.stringify(data_list,null,4);
                    // $("#count_week").html("").append(data_list)
                    // console.log(data_list["attack_type"]);
                    barchart(data_list['attack_type'].reverse(),'attack_type_part');
                    barchart(data_list['attack_target'].reverse(),'attack_target_part');
                    attack_server_ip(data_list['attack_server_ip'].reverse(),'attack_server_ip_part');
                    barchartv(data_list['attack_server'].reverse(),'attack_server_part');
                    // console.log(data_list['attack_level'],typeof data_list['attack_level'])
                    piechart(data_list['attack_level'],'attack_level_part');
                    // console.log(data_list['attack_scan'],typeof data_list['attack_scan']);
                    piechart1(data_list['attack_scan'],'attack_scan_part');
                    linechart(data_list['attack_time_dic'],'attack_time_dic_part');
                    attack_source(data_list['attack_source'],'#attack_source_part')
                }})
        }

    });
}
//条形图echarts
function  barchart(data,div) {
    /*
    * 攻击类型 次数*/
    let data_list_type = [];
    let data_list_type_dic = [];
    var barchart = echarts.init(document.getElementById(div));
    for (x in data) {
        data_list_type.push(data[x][0]);
        data_list_type_dic.push(data[x][1]);
    }
    option = {
        color: "#2d7ba4",
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            left: '5%',
            top: '10%',
            right: '5%',
            bottom: '5%',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            // axisTick: {
            //     alignWithLabel: true
            // },

        },
        yAxis: {
            type: 'category',
            data: data_list_type,
            axisTick: {
                show: false
            },
            splitLine: {
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

    barchart.setOption(option)
}
//柱状图echarts
function barchartv(data,div) {
    let data_list_type = [];
    let data_list_type_dic = [];
    var barchartv = echarts.init(document.getElementById(div));
    for (x in data) {
        data_list_type.push(data[x][0]);
        data_list_type_dic.push(data[x][1]);
    }
    option = {
        color: ['#2d7ba4'],
        tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        grid: {
            left: '12%',
            right: '5%',
            top: '10%',
            bottom: '5%',
            containLabel: true
        },
        xAxis : [
            {
                type : 'category',
                data : data_list_type,
                axisTick: {
                    alignWithLabel: true
                }
            }
        ],
        yAxis : [
            {
                type : 'value'
            }
        ],
        series : [
            {
                name:'直接访问',
                type:'bar',
                barWidth: '60%',
                data:data_list_type_dic
            }
        ]
    }
    barchartv.setOption(option)
}
//条形图echarts
function  attack_server_ip(data,div) {
    /*
    * 攻击类型 次数*/
    let data_list_type = [];
    let data_list_type_source = [];
    let data_list_type_dic = [];
    var attack_server_ip = echarts.init(document.getElementById(div));
    for (x in data) {
        data_list_type.push(data[x][0]+'-'+data[x][2]);
        data_list_type_dic.push(data[x][1]);
    }

    option = {
        color: "#2d7ba4",
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            left: '5%',
            top: '10%',
            right: '5%',
            bottom: '5%',
            containLabel: true
        },
        xAxis: {
            type: 'value',
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

    attack_server_ip.setOption(option)
}

//饼状图
function piechart(data,div) {
    var piechart = echarts.init(document.getElementById(div));
    option = {
        legend: {
            show: true,
            width: '20%',
            right: '2%',
            top: 'middle',
            orient: 'vertical',
            backgroundColor: '#eee',

        },
        series: [{
            name: '威胁指数',
            type: 'pie',
            radius: ['55%', '70%'],
            center: ['40%', '50%'],
            clockwise: false,

            data: function () {
                let res=[];
                for (let x in data) {
                    res.push({
                        name: data[x][0],
                        value: data[x][1],
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
                left: '5%',
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
    piechart.setOption(option);
    // let data_list_type = [];
    //     let data_list_type_dic = [];
    //     for (x in data) {
    //         data_list_type.push(data[x][0]);
    //         data_list_type_dic.push(data[x][1]);
    //         piechart.setOption({
    //             series: {
    //                 data: [{
    //                     name: data[x][0],
    //                     value: data[x][1],
    //                 }]
    //             }
    //         });
    // }
}
//饼状图 非数组
function piechart1(data,div) {
    var piechart = echarts.init(document.getElementById(div));
    option = {
        legend: {
            show: true,
            width: '20%',
            right: '2%',
            top: 'middle',
            orient: 'vertical',
            backgroundColor: '#eee',

        },
        series: [{
            name: '威胁指数',
            type: 'pie',
            radius: ['60%', '75%'],
            center: ['40%', '50%'],
            clockwise: false,
            data: function () {
                let res=[];
                for (let x in data) {
                    res.push({
                        name: x,
                        value: data[x],
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
    piechart.setOption(option);
}
//折线图
function linechart(data,div) {
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
            x:50,
            y:20,
            x2:35
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
        xAxis: [{
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
        }],
        yAxis: [
            {
                type : 'value',
                axisLine:{
                lineStyle:{
                color: '#b3b3b3',
                width: 1,
                type: 'solid'
                }
                },
                splitNumber:10
            }
        ],
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
//attack_source 攻击源 表格
function attack_source(data,div) {
    /*
    * 攻击源
    * */
    let source = $(div);
    source.text("");

    let html = '';

    let table = '';

    for (let x in data) {

        table += '<tr>';
        table += '<td>';
        table += data[x][0];
        table += '</td>';
        table += '<td>';
        table += data[x][1];
        table += '</td>';
        table += '<td>';
        table += data[x][2];
        table += '</td>';
        table += '</tr>';

    }

    html = `
                    <table class="res_table">
                      <thead>
                        <tr>
                          <th>攻击IP</th>
                          <th>攻击次数</th>
                          <th>攻击源</th>
                        </tr>
                      </thead>
                      <tbody>
                      ` + table + `
                      </tbody>
                    </table>
                `;
    source.append(html);
}
function print_report() {
    $('.s-side').hide();
    $('.header-top').hide();
    $('.print').hide();
    $('.download').hide();
    $('.search_btngroup').hide();
    $('.footer').hide();

    // body滚动条
    $('body').css('overflow-y','scroll');
    $('#main').css('overflow','unset');
    $('.setup').css('overflow-y','unset');
    // $('#main_right').css('overflow-y','initial')
    window.print();
    $('.header-top').show();
    $('.footer').show();
    $('.print').show();
    $('.download').show();
    $('.search_btngroup').show();
    $('.s-side').show();
    $('body').css('overflow-y','hidden');
    $('#main').css('overflow','hidden');
    $('.setup').css('overflow-y','scroll');
    // $('#main_right').css('overflow-y','scroll')
}
function download_report() {
    $('.s-side').hide();
    $('.header-top').hide();
    $('.print').hide();
    $('.download').hide();
    $('.search_btngroup').hide();
    $('.footer').hide();
    // body滚动条
    $('body').css('overflow-y','scroll');
    $('#main').css('overflow','unset');
    $('.setup').css('overflow-y','unset');

    html2canvas($(document.body),{
        background: '#f7f7f7',

        onrendered:function(canvas) {
            var contentWidth = canvas.width;
            var contentHeight = canvas.height;
            //一页pdf显示html页面生成的canvas高度;
            var pageHeight = contentWidth / 592.28 * 841.89;
            //未生成pdf的html页面高度
            var leftHeight = contentHeight;
            //页面偏移
            var position = 0;
            //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
            var imgWidth = 595.28;
            var imgHeight = 592.28/contentWidth * contentHeight;

            var pageData = canvas.toDataURL('image/jpeg', 1.0);

            var pdf = new jsPDF('', 'pt', 'a4');

            //有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
            //当内容未超过pdf一页显示的范围，无需分页
            if (leftHeight < pageHeight) {
                pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight );
            } else {
                while(leftHeight > 0) {
                    pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
                    leftHeight -= pageHeight;
                    // position -= 841.89;
                    position -= 841.89;
                    //避免添加空白页
                    if(leftHeight > 0) {
                        pdf.addPage();
                    }
                }
            }

            pdf.save('资产分析报告.pdf');
        }
    });
    $('.header-top').show();
    $('.footer').show();
    $('.print').show();
    $('.download').show();
    $('.search_btngroup').show();
    $('.s-side').show();
    $('body').css('overflow-y','hidden');
    $('#main').css('overflow','hidden');
    $('.setup').css('overflow-y','scroll');
}