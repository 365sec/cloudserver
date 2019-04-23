function agent_click(page) {
    /*
    * 探针管理被点击
    * */
    //let page=1;
    $.ajax( {
        url: 'agent',
        dataType:"html",
        type: "get",

        success: function(res){

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
                    //html += '<th>是否禁用该探针</th>';
                    html += '<th>备注信息</th>';
                    html += '<th>远程配置</th>';
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
                        if (data[x]['online'] == '在线') {
                            html += '<td><img src = "/static/images/online.png" style="width: 12px;">' + data[x]['online'] + '</td>';
                        } else {
                            html += '<td><img src = "/static/images/offline.png" style="width: 12px;">' + data[x]['online'] + '</td>';
                        }


                        //html += '<td>' + data[x]['disabled'] + '</td>';
                        html += '<td>' + data[x]['remark'] + '</td>';
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
            $(".container1").css('background-color', '#f0f2f5');
        }

    });
}

$(document).on("click", ".detail-a-agent", function () {
    let model_html = `
    <div class="modal fade" id="setting" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
     aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">
                </button>
                <h4 class="modal-title myModalLabel">
                    agent配置
                </h4>
            </div>
            <div class="modal-body">

                <div id="host_msg">
                    <!--<h3>主机信息</h3>-->
                    <div id="host_msg_div" >

                    </div>

                </div>
                <ul class="nav nav-tabs myTab">
                    <li class="active"><a href="#algorithm_config" data-toggle="tab">RASP防御策略</a></li>
                    <li>
                        <a href="#httpProtec_config" data-toggle="tab">
                            WAF防御策略
                        </a>
                    </li>

                    <li><a href="#globalConfig" data-toggle="tab">全局配置</a></li>
                </ul>
                <div id="myTabContent" class="tab-content">
                    <div class="tab-pane fade in active" id="algorithm_config">
                        <div>
                            <textarea style="min-height: 300px;min-width: 600px  ;display: none"
                                      id="input_algorithm_config"> </textarea> <br>
                        </div>
                        <div id="algorithm_config_body">

                        </div>


                    </div>
                    <div class="tab-pane fade" id="httpProtec_config">
                        <div>
                            <textarea style="min-height: 300px;min-width: 600px ;display: none"
                                      id="input_httpProtec_config"> </textarea> <br>

                        </div>
                        <div id="httpProtec_config_body">

                        </div>


                    </div>
                    <div class="tab-pane fade" id="globalConfig">
                        <div>
                            <textarea style="min-height: 300px;min-width: 600px  ;display: none"
                                      id="input_global_config"> </textarea> <br>
                        </div>
                        <div id="globalConfig_body">

                        </div>

                    </div>
                </div>
            </div><!-- /.modal-content -->
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">关闭
                </button>
                <div id="agent_manage_submit">

                </div>

            </div>
        </div><!-- /.modal -->
    </div>
    `;

    $("#agent_model_div").text("").append(model_html);


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
    dic.transformer_deser = "Transformer 反序列化攻击";
    dic.webshell_eval = "网页后门";
    dic.webshell_command = "网页后门";
    dic.webshell_file_put_contents = "网页后门";
    dic.webshell_callable = "网页后门";
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
    aa.val(JSON.stringify(data1,undefined,4));
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

function formSubmit() {
    $.ajax({
        type: "post",
        //async : false, //同步请求
        url: "add_host",
        data: {"remarkmsg": $("#remarkmsg").html()},
        // timeout:1000,
        success: function (data) {
            if (!data['code']) {
                $("#agent-id").html(data['agent_id'])
            } else {
                alert('添加主机失败。');
            }
        }
    });
    //document.getElementById("myForm").submit();
}

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
$(document).on("click", ".agentDiv .card .btngroup .btn", function() {
    actionIn(".layout", 'action_scale', .3, "");
    $(".shade").css({
        visibility: "visible"
    });
    event.stopPropagation(); //阻止事件向上冒泡
});

$(document).on("click", ".btn-group button", function () {
    $(this).addClass("active").siblings().removeClass("active");
})