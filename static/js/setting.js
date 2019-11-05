function setting_chart_click() {

    $.ajax( {
        url: '/chart',
        dataType:"html",
        type: "get",
        success: function(res){
            let secvalue = $(this).children().attr("data-secvalue");
            $("#div_container").html($(res));
            get_chart_data(0)

        }})


}
let chart_data={};
let now_id;
$(document).on("click",".chart-set-tab-con li",function () {
    var thisid = $(this).attr("id");
    get_chart_data(thisid)

});


function get_chart_data(id) {
    now_id=id;
    $.ajax({
        url: "/setting/get_chart/",
        type: 'POST',
        data: {
            "id":id
        },
        //dataType: "json",
        success: function (data_list) {
            console.log(data_list);
            chart_data =data_list;
            pie_click()
        }
    });


}

function pie_click() {
    let chart_pie=chart_data['chart_android']['chart']['PieChart'];
    // let varobj=JSON.stringify(chart_android_pie,undefined,2);
    get_config_html(chart_pie,"chart_android","chart","PieChart");

}
function line_click() {
    let chart_line=chart_data['chart_android']['chart']['LineChart'];
    // let varobj=JSON.stringify(chart_android_pie,undefined,2);
    get_config_html(chart_line,"chart_android","chart","LineChart");

}

function get_config_html(data, phone,type,chart_type) {

    let html=``;
  for (x in data)
  {
      // console.log(data[x]);

      let description=data[x]['description'];
      let val=data[x]['val'];
      html+=`<li>${description}:<input placeholder="${val}"
                    onchange="chart_vul_change(this,'${phone}','${type}','${chart_type}','${x}')"/></li>`;
  }

    $("#chart_config").html(html);
}
function chart_vul_change(obj,phone,type,chart_type,key) {
    let  html=`<button class="btn btn-default" onclick="chart_submit()">提交</button>`;
    //chart_submit
    chart_data[phone][type][chart_type][key]['val']=obj.value
    $("#chart_submit").html(html);

}
function chart_submit() {

    let submit_data=JSON.stringify(chart_data);
    $.ajax({
        url: "/setting/chart_submit/",
        type: 'POST',
        data: {
            "id":now_id,
            "data":submit_data
        },
        //dataType: "json",
        success: function (data_list) {
            console.log(data_list);

        }
    });
}