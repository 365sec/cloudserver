function download_click(attack_page) {
    /*
    * 下载事件*/

    $.ajax( {
        url: 'agent_download',
        dataType:"html",
        type: "get",

        success: function(res){

            $("#div_container").html($(res));
            $(".javaDiv").hide();
            $(".IISDiv").hide();
            let html = ``;
            $(".container1").css('background-color', '#fff');
        }

    });

}

function java_click() {
    $.ajax({
        url: "agentClick",
        type: 'POST',
        data: {
            "agent": "java"
        },
        //dataType: "json",
        success: function (data_list) {
            $(".tanzhen .javaDiv").show().siblings().hide();
            $("#agent_server_addr1").text(data_list['agent_server']);
            $("#java_guid").text(data_list['guid']);
            $("#java_a_download_url").attr("href", data_list['download_url']);
            $("#java_wget_download_url").text(data_list['wget']);
        }
    });

}

function iis_click() {

    $.ajax({
        url: "agentClick",
        type: 'POST',
        data: {
            "agent": "iis"
        },
        success: function (data_list) {
            $(".tanzhen .IISDiv").show().siblings().hide();
            $("#agent_server_addr2").text(data_list['agent_server']);
            $("#iis_guid").text(data_list['guid']);
            $("#iis_a_download_url").attr("href", data_list['download_url']);
            $("#iis_wget_download_url").text(data_list['wget']);
        }
    });

}