function user_click(page) {
    /*
    * 用户管理被点击
    * */
    //let page=1;
    $.ajax( {
        url: 'user',
        dataType:"html",
        type: "get",
        success: function(res){
            let secvalue = $(this).children().attr("data-secvalue");
            $("#div_container").html($(res));

            // 个人信息
            personal_infor_click();

            // 修改密码
            pwd_change_click();


            user_admin_load(1);
            user_admin_click();



        }

    });
}

// 个人信息
function personal_infor_click() {
    $(document).on('click','#personal_infor_link',function () {
        personal_infor_load();
    })
}
function personal_infor_load() {
    // 个人信息执行

}
// 修改密码
function pwd_change_click() {
    $(document).on('click','#pwd_change_link',function () {
        pwd_change_load();
    })
}
function pwd_change_load() {
    // 修改密码

}
// 会员用户管理
function user_admin_click() {
    $(document).on('click','#user_admin_link',function () {
        user_admin_load(1);
    })
}
function user_admin_load(page) {

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
            if (is_superuser === 1) {
                $('#user_admin_link').remove();
                $('#super_user_admin').remove();
                $("#user_admin_panel_content_wrapper .tab-content").children().removeClass('active in')
                let html_tab = '<li class="tab-oblique active" id="user_admin_link"><a class="tab-col" data-toggle="tab" href="#super_user_admin" aria-expanded="true"><i class="iconfont">&#xe650;</i><span> 用户管理</span></a></li>';
                $('#user_admin_panel').prepend(html_tab);
                let html_content = `<div id="super_user_admin" class="tab-pane fade active in">
                    <div id="user_admin_main">
                    </div>
                    <div class="modal fade" id="add_user" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                                    <h4 class="modal-title" id="myModalLabel">添加用户</h4>
                                </div>
                                <div style="width: 100%;height: calc(100% - 109px);display: flex;align-items: center;justify-content: center;line-height: 50px">
                                <table>
                                    <tbody>
                                    <tr>
                                        <td style="text-align: right;padding-right: 20px; width: 38%"><span class="red">*</span>
                                            <span>用户名</span>
                                            </td>
                                        <td><input type="text" placeholder="" id='' name="" /></td></tr>
                                    <tr>
                                        <td style="text-align: right;padding-right: 20px"><span class="red">*</span>
                                            <span>密码</span>
                                        </td>
                                        <td><input type="text" placeholder="" id='' name="" /></td></tr>
                                    </tbody>
                                </table>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
                                    <button type="button" class="btn btn-primary">提交更改</button>
                                </div>
                            </div><!-- /.modal-content -->
                        </div><!-- /.modal -->
                    </div>
                </div>`;
                $('#user_admin_panel_content_wrapper .tab-content').prepend(html_content);
                let now_page = data_list['page'];
                let max_size = data_list['max_size'];
                let div_container = $("#user_admin_main");
                div_container.text("");
                let html = '';
                if (is_superuser === 1) {
                    html += '<div class = "search_btngroup"><div  class="btn"  data-toggle="modal" data-target="#add_user">添加用户</div></div>';
                }
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
        }
    });
    $(".container1").css('background-color', '#f0f2f5');
}

