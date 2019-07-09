function user_click(page) {
    /*
    * 用户管理被点击
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
                url: "user/query/",
                type: 'POST',
                data: {
                    "page": page
                },
                //dataType: "json",
                success: function (data_list) {
                    console.log(data_list);
                    data = data_list['user'];
                    let is_superuser=data_list['is_superuser'];
                    let now_page = data_list['page'];
                    let max_size = data_list['max_size'];
                    let div_container = $(".manageDiv");
                    let div_container2 = $(".table-manage");
                    div_container.text("");
                    let html = '<h1 class="page-title" ><i class="iconfont">&#xe73b;</i>用户管理</h1>';
                    html += '<div class="card">';
                    if (is_superuser === 1) {
                        html += '<div class = "btngroup"><div  class="btn" onclick="javascript:void(0)" >添加用户</div></div>';
                    }
                    html += '<div class="card-body">';
                    html += '<table class="table table-bordered table-striped table-hover">';
                    html += '<thead>';
                    html += '<tr>';
                    html += '<th>用户名</th>';
                    html += '<th>电话</th>';
                    html += '<th>邮件</th>';
                    html += '<th>用户类型</th>';
                    if (is_superuser === 1) {
                        html += '<th>操作</th>';
                    }
                    html += '</tr>';
                    html += '</thead>';
                    html += '<tbody>';
                    for (x in data) {
                        html += '<tr>';
                        html += '<td>' + data[x]['username'] + '</td>';
                        html += '<td>' + data[x]['phone'] + '</td>';
                        html += '<td>' + data[x]['email'] + '</td>';
                        html += '<td>' + data[x]['superuser'] + '</td>';
                        if (is_superuser === 1) {
                            html += '<td> <a href="#">更新</a></td>';
                        }
                        html += '</tr>';
                    }
                    html += '</tbody>';
                    html += '</table>';
                    html += '</div>';


                    html += '<ul role="menubar" aria-disabled="false" aria-label="Pagination" class="pagination b-pagination pagination-md justify-content-center">';
                    html += '<a href="javascript:void(0);" onclick="user_click(' + (now_page - 1) + ')">上一页</a>';
                    html += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp';
                    html += '<a href="javascript:void(0);">' + now_page + "/" + max_size + '</a>';
                    html += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp';
                    html += '<a href="javascript:void(0);" onclick="user_click(' + (now_page + 1) + ')">下一页</a>';
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


