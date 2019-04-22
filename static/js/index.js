$(document).on("click", ".nav.nav-tabs li>a", function () {
    $(this).addClass("active router-link-active").parent().siblings().children().removeClass("active router-link-active");
    $(this).parent().addClass("active").siblings().removeClass("active");
    let value = $(this).attr("data-value");
    // console.log(value);
    switch (value) {
        case "agent":
            agent_click(1);
            break;
        case "attack":
            attack_click(1);
            break;
        case "download":
            download_click(1);
            break;
        case "overview":
            overview_click();
            break;
        case "countDiv":
            count_div_click();
            break;
        default:
    }
});
$(document).on("click", ".map-tab", function () {
    $(this).addClass('current').siblings().removeClass('current');
});
// var beginTimeStore = '';
// var endTimeStore = '';
// $('#attack_time').daterangepicker({
//     "timePicker": true,
//     "timePicker24Hour": true,
//     "linkedCalendars": false,
//     "autoUpdateInput": false,
//     "locale": {
//         format: 'YYYY-MM-DD',
//         separator: ' ~ ',
//         applyLabel: "应用",
//         cancelLabel: "取消",
//         resetLabel: "重置",
//     }
// }, function (start, end, label) {
//     beginTimeStore = start;
//     endTimeStore = end;
//     console.log(this.startDate.format(this.locale.format));
//     console.log(this.endDate.format(this.locale.format));
//     if (!this.startDate) {
//         this.element.val('');
//     } else {
//         this.element.val(this.startDate.format(this.locale.format) + this.locale.separator + this.endDate.format(this.locale.format));
//     }
// });