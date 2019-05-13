function server_click(page) {
    /*
    * 探针管理被点击
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
                    let div_container = $(".manageDiv");
                    let div_container2 = $(".table-manage");
                    div_container.text("");
                    let html = '<h1 class="page-title" ><i class="iconfont">&#xe73b;</i>服务器管理</h1>';
                    html += '<div class="card">';
                    html += '<div class = "btngroup"><button  class="btn" onclick="javascript:void(0)" >添加主机</button></div>'
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

                        html += '<td><a class="detail-a-server" href="javascript:void(0)" data-name="' + agent_id + '"   >' + data[x]['agent_id'] + '</a> </td>';
                        html += '<td>' + data[x]['os'] + '</td>';
                        html += '<td>' + data[x]['register_ip'] + '</td>';
                        html += '<td>' + data[x]['register_ip'] + '</td>';
                        if (data[x]['online'] == '在线') {
                            html += '<td><img src = "/static/images/online.png" style="width: 12px;">' + data[x]['online'] + '</td>';
                        } else {
                            html += '<td><img src = "/static/images/offline.png" style="width: 12px;">' + data[x]['online'] + '</td>';
                        }
                        html += '<td>' + data[x]['version'] + '</td>';
                        html += '<td>' + data[x]['server_type'] + '</td>';
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
            $(".container1").css('background-color', '#f0f2f5');

        }

    });
}

$(document).on("click", ".detail-a-server", function () {
    let id = $(this).attr("data-name");
    $.ajax({
        url: 'manage_detail',
        type: 'get',
        dataType: 'html',
        success: function (res) {
            $('#div_container').html($(res));
            $('.page-title').html('主机：'+id);
            $('#machine_name_view span').html(id);
            let tday = [["2:00", 21273],["4:00", 12273],["6:00", 15273],["8:00", 6273],["10:00", 8273],["12:00", 10273]];
            linechart(tday,'chart_wrapper');
            let html = '';
            for(i = 0;i<10;i++){
                html +='<tr><td>'+parseInt(Math.random()*500+1)+'</td>'
                html +='<td>'+parseInt(Math.random()*500+1)+'</td></tr>'
            };
            $('#ana_attack').html(html);
        }
    });
});
$(document).on('click','.map-tab',function () {
    let tday = [["2:00", 21273],["4:00", 12273],["6:00", 15273],["8:00", 6273],["10:00", 8273],["12:00", 10273]];
    let yday = [["2:00", 1273],["4:00", 2273],["6:00", 15273],["8:00", 6273],["10:00", 8273],["12:00", 10273]];
    let week = [["2:00", 21273],["4:00", 12273],["6:00", 15273],["8:00", 273],["10:00", 8273],["12:00", 1273]];
    let value = $(this).attr('data-type');
    console.log(value);
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
    let linechart = echarts.init(document.getElementById('chart_wrapper'))
    let option = linechart.getOption();
    option.series[0].data = data;
    linechart.setOption(option);
})


//添加主机弹窗
//关闭弹窗
$(document).on('click',".layout .close,.layout .layout-close",function (e) {
    actionIn(".layout", 'action_scale_out', .3, "");
    $(".shade").css({
        visibility: "hidden"
    });
    event.stopPropagation(); //阻止事件向上冒泡

});
//打开弹窗
$(document).on("click", ".manageDiv .card .btngroup .btn", function() {
    actionIn(".layout", 'action_scale', .3, "");
    $(".shade").css({
        visibility: "visible"
    });
    event.stopPropagation(); //阻止事件向上冒泡
});


$(document).on("click", ".btn-group button", function () {
    $(this).addClass("active").siblings().removeClass("active");
})


