// function agent_click(page) {
//     /*
//     * 探针管理被点击
//     * */
//     //let page=1;
//     $.ajax( {
//         url: 'manage',
//         dataType:"html",
//         type: "get",
//         success: function(res){
//             $("#div_container").html($(res));
//             if (page == null || page < 1) {
//                 page = 1;
//             }
//             $(this).addClass("active router-link-active").siblings().removeClass("active router-link-active");
//             $.ajax({
//                 url: "agent/query/",
//                 type: 'POST',
//                 data: {
//                     "page": page
//                 },
//                 //dataType: "json",
//                 success: function (data_list) {
//                     data = data_list['agents'];
//                     let now_page = data_list['page'];
//                     let max_size = data_list['max_size'];
//                     // data = data.replace(/}{/g, "}****{").split("****");
//                     let div_container = $(".manageDiv");
//                     // let div_container2 = $(".table-manage");
//                     div_container.text("");
//                     let html = '<h1 class="page-title" ><i class="iconfont">&#xe73b;</i>探针管理</h1>';
//                     html += '<div class="card">';
//                     html += '<div class = "btngroup"><div  class="btn" onclick="javascript:void(0)" >添加主机</div></div>'
//                     html += '<div class="card-body">';
//                     html += '<table class="table table-bordered">';
//                     html += '<thead>';
//                     html += '<tr>';
//                     html += '<th>agent id</th>';
//                     html += '<th>探针类型</th>';
//                     html += '<th>注册IP</th>';
//                     html += '<th>操作系统</th>';
//                     html += '<th>主机名</th>';
//                     html += '<th>agent 版本</th>';
//                     html += '<th>开发语言</th>';
//                     html += '<th>服务器类型</th>';
//                     html += '<th>服务器版本</th>';
//                     html += '<th>是否在线</th>';
//                     //html += '<th>是否禁用该探针</th>';
//                     html += '<th>备注信息</th>';
//                     html += '</tr>';
//                     html += '</thead>';
//                     html += '<tbody>';
//                     for (x in data) {
//                         html += '<tr>';
//                         data[x] = JSON.parse(data[x]);
//                         let agent_id = data[x]['agent_id'];
//                         html += '<td><a class="detail-a-agent" href="javascript:void(0)" data-name="' + agent_id + '"   >' + data[x]['agent_id'] + '</a> </td>';
//                         html += '<td>' + data[x]['sensor_type_id'] + '</td>';
//                         html += '<td>' + data[x]['register_ip'] + '</td>';
//                         html += '<td>' + data[x]['os'] + '</td>';
//                         html += '<td>' + data[x]['host_name'] + '</td>';
//                         html += '<td>' + data[x]['version'] + '</td>';
//                         html += '<td>' + data[x]['language'] + '</td>';
//                         html += '<td>' + data[x]['server_type'] + '</td>';
//                         html += '<td>' + data[x]['server_version'] + '</td>';
//                         if (data[x]['online'] == '在线') {
//                             html += '<td><img src = "/static/images/online.png" style="width: 12px;">' + data[x]['online'] + '</td>';
//                         } else {
//                             html += '<td><img src = "/static/images/offline.png" style="width: 12px;">' + data[x]['online'] + '</td>';
//                         }
//                         html += '<td>' + data[x]['remark'] + '</td>';
//                         html += '</tr>';
//                     }
//                     html += '</tbody>';
//                     html += '</table>';
//                     html += '</div>';
//
//
//                     html += '<ul role="menubar" aria-disabled="false" aria-label="Pagination" class="pagination b-pagination pagination-md justify-content-center">';
//
//                     html += '<a href="javascript:void(0);" onclick="agent_click(' + (now_page - 1) + ')">上一页</a>';
//                     html += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp';
//                     html += '<a href="javascript:void(0);">' + now_page + "/" + max_size + '</a>';
//                     html += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp';
//                     html += '<a href="javascript:void(0);" onclick="agent_click(' + (now_page + 1) + ')">下一页</a>';
//                     //html += '<input id = "agent_jump" value="'+now_page+'" />';
//                     //  html += '<a href="javascript:void(0);" onclick="agent_jump()">跳转</a>';
//                     html += '</ul>';
//                     div_container.append(html);
//                 },
//                 error: function (XMLHttpRequest, textStatus, errorThrown) {
//                     alert(XMLHttpRequest.status);
//                     alert(XMLHttpRequest.readyState);
//                     alert(textStatus);
//                 }
//             });
//             $(".container1").css('background-color', '#f0f2f5');
//         }
//
//     });
// }
//
// $(document).on("click", ".detail-a-agent", function () {
//     let id = $(this).attr("data-name");
//     $.ajax({
//         url: 'agent_detail',
//         type: 'get',
//         dataType: 'html',
//         success: function (res) {
//             $('#div_container').html($(res));
//
//             $('.page-title').html('主机：'+id);
//             let algorithm_html = ``;
//             let httpProtec_html = ``;
//             let global_html = ``;
//             let httpProtectConfig;
//             let algorithm_config;
//             let globalConfig;
//             $.ajax({
//                 url: "plugins",
//                 type: 'POST',
//                 data: {
//                     "id": id
//                 },
//                 async: false,
//                 dataType: "json",
//                 success: function (data_list) {
//                     httpProtectConfig = data_list['httpProtectConfig'];
//                     algorithm_config = data_list['algorithm_config'];
//                     globalConfig = data_list['globalConfig'];
//                     $("#input_httpProtec_config").val(httpProtectConfig);
//                     $("#input_algorithm_config").val(algorithm_config);
//                     $("#input_global_config").val(globalConfig);
//
//                     httpProtec_html = httpProtec_config_show(httpProtectConfig, id);
//                     algorithm_html = algorithm_config_show(algorithm_config, id);
//                     global_html = global_config_show(globalConfig, id);
//                 }
//             });
//             $("#agent_manage_submit").html("");
//             $("#algorithm_config_body").html(algorithm_html);
//             $("#httpProtec_config_body").html(httpProtec_html);
//
//             $("#globalConfig_body").html(global_html);
//             // $("#setting").modal("show");
//         }
//     });
// });



// //添加主机弹窗
// //关闭弹窗
// $(document).on('click',".layout .close,.layout .layout-close",function (e) {
//     $('.shade>.layout').html('');
//     actionIn(".layout", 'action_scale_out', .3, "");
//     $(".shade").css({
//         visibility: "hidden"
//     });
//     event.stopPropagation(); //阻止事件向上冒泡
//
// });
// //打开弹窗
// $(document).on("click", ".manageDiv .card .btngroup .btn", function() {
//     let html = `<div class="layout-title">备注信息：</div>
//         <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
//         <form action="post">
//             <div id="remarkid">Agent ID <span style="color:#F00" id="agent-id">{{ agent_id }}</span></div>
//             <br/>
//             <div contenteditable="true" id="remarkmsg"></div>
//             <div class='layout-btn'>
//                 <div class="btn layout-close" onclick="formSubmit()">保存</div>
//                 <div class="btn layout-close" onclick="javascript:void(0)">关闭</div>
//             </div>
//         </form>`;
//     $('.shade>.layout').html(html);
//     actionIn(".layout", 'action_scale', .3, "");
//     $(".shade").css({
//         visibility: "visible"
//     });
//     event.stopPropagation(); //阻止事件向上冒泡
// });
//
//
//
// $(function () {
//     httpProtec_config_show
//
// })