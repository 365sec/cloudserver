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
    $.ajax({
        url: "user/query_one/",
        type: 'POST',
        data: {

        },
        //dataType: "json",
        success: function (data_list) {
            console.log(data_list);
            let data=data_list['user'];
            $("#user_name").html("").append(data['username']);
            $("#user_phone").val(data['phone']);
            $("#user_email").val(data['email']);
            $("#user_type").html("").append(data['superuser']);
        }
    });


}
//用户信息修改
function user_update() {
    let phone=$("#user_phone").val();
    let email=$("#user_email").val();
    var phonereg=/^[1][3,4,5,7,8][0-9]{9}$/;
    var emailreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    if (!phonereg.test(phone))
    {
        alert("手机号输入有误");
        return;
    }
    if (!emailreg.test(email))
    {
        alert(("邮箱输入有误"));
        return;
    }
    $.ajax({
        url: "user/user_update/",
        type: 'POST',
        data: {
            "phone":phone,
            "email":email
        },
        //dataType: "json",
        success: function (data_list) {
            console.log(data_list);
            if (data_list['success'] === 'ok')
            {
                alert("修改成功")
            }
            else {
                alert("修改失败")
            }
        }
    });
}
// 修改密码样式
function pwd_change_click() {
    $(document).on('click','#pwd_change_link',function () {
        pwd_change_load();
    })
}
function pwd_change_load() {
    $("#old_password").val("");
    $("#new_password").val("");
    $("#new_password_").val("");
}

function pwd_update() {
    // 修改密码
    let old_password=$("#old_password").val();
    let new_password=$("#new_password").val();
    let new_password_=$("#new_password_").val();
    var usernamereg=/^[a-zA-Z0-9!@#$%^&*?.]{5,12}$/;

    if (new_password !== new_password_) {
        alert("输入两次密码不一致");
        return ;
    }
    if (!usernamereg.test(new_password))
    {
        alert("密码格式6-22位字母数字或者特殊字符");
        return;
    }
    $.ajax({
        url: "user/user_update_pwd/",
        type: 'POST',
        data: {
            "old_password":old_password,
            "new_password":new_password,
        },
        //dataType: "json",
        success: function (data_list) {
            if (data_list['msg']=== "旧密码错误") {
                $("#oid_pwd_msg").append(data_list['msg']);
            } else {
                alert(data_list['msg']);
            }
        }
    });
}
// 管理员用户管理
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
                $("#user_admin_panel_content_wrapper .tab-content").children().removeClass('active in');
                let html_tab = '<li class="tab-oblique active" id="user_admin_link"><a class="tab-col" data-toggle="tab" href="#super_user_admin" aria-expanded="true"><i class="iconfont">&#xe650;</i><span> 用户管理</span></a></li>';
                $('#user_admin_panel').prepend(html_tab);
                let html_content = `<div id="super_user_admin" class="tab-pane fade active in">
                    <div id="user_admin_main">
                    </div></div>
                    `;
                $('#user_admin_panel_content_wrapper .tab-content').prepend(html_content);
                let now_page = data_list['page'];
                let max_size = data_list['max_size'];
                let div_container = $("#user_admin_main");
                div_container.text("");
                let html = '';
                html += '<div class = "search_btngroup"><div  class="btn add_user_btn">添加用户</div></div>';
                html += '<table class="table table-bordered table-striped table-hover">';
                html += '<thead>';
                html += '<tr>';
                html += '<th>用户名</th>';
                html += '<th>电话</th>';
                html += '<th>邮件</th>';
                html += '<th>用户类型</th>';
                html += '</tr>';
                html += '</thead>';
                html += '<tbody>';
                for (x in data) {
                    html += '<tr>';
                    html += '<td>' + data[x]['username'] + '</td>';
                    html += '<td>' + data[x]['phone'] + '</td>';
                    html += '<td>' + data[x]['email'] + '</td>';
                    html += '<td>' + data[x]['superuser'] + '</td>';
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
$(document).on('click','.add_user_btn',function () {
    let html1 = `<div class="modal fade" id="add_user" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                                    <h4 class="modal-title" id="myModalLabel" >添加用户</h4>
                                </div>
                                <div style="width: 100%;height: calc(100% - 109px);display: flex;align-items: center;justify-content: center;line-height: 50px">
                                <table>
                                    <tbody>
                                    <tr>
                                        <td style="text-align: right;padding-right: 20px; width: 38%"><span class="red">*</span>
                                            <span>用户名</span>
                                            </td>
                                        <td><input type="text" placeholder="" id='user_add_name' name="" /></td></tr>
                                    <tr>
                                        <td style="text-align: right;padding-right: 20px"><span class="red">*</span>
                                            <span>密码</span>
                                        </td>
                                        <td><input type="password" placeholder=""  id='user_add_password' name="" /></td></tr>
                                    </tbody>
                                </table>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-primary" data-dismiss="modal" onclick="user_add()">提交</button>
                                    <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
                                </div>
                            </div><!-- /.modal-content -->
                        </div><!-- /.modal -->`;
    $('#model_div').text('').append(html1);
    $('#add_user').modal('show');
})
//添加用户
function user_add() {
    let username=$("#user_add_name").val();
    let password=$("#user_add_password").val();
    var usernamereg=/^[_a-zA-Z0-9]{5,12}$/;
    var passwordreg = /^[a-zA-Z0-9!@#$%^&*?.]{6,22}$/;
    if (!usernamereg.test(username))
    {
        alert("账号格式5-12位字母数字或者下划线");
        return;
    }
    if (!passwordreg.test(password))
    {
        alert("密码格式6-22位字母数字或者特殊字符");
        return;
    }
    $.ajax({
        url: "user/user_add/",
        type: 'POST',
        data: {
            "username":username,
            "password":password,
        },
        //dataType: "json",
        success: function (data_list) {
            alert(data_list['msg']);
            user_admin_load(1);

        },
        error:function () {
            alert("添加失败");
            // $('#add_user').modal('hide');
        }
    });
}