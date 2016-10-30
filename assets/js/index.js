/**
 * Created by wangnan on 16-10-26.
 */
var rectangleLTLng, rectangleLTLat, rectangleRBLng, rectangleRBLat;
var taskRectangleLTLng, taskRectangleLTLat, taskRectangleRBLng, taskRectangleRBLat;
var createCourseIndex, viewCourseIndex;
var _onMouseDown, _onMouseUp;
var mouseTool;
var map = new AMap.Map('amap', {
    resizeEnable: true,
    zoom: 11,
    center: [116.39, 39.9],
    keyboardEnable: false
});
AMap.plugin(['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.ToolBar', 'AMap.Scale', 'AMap.MouseTool'], function () {
    var autoOptions = {
        city: "北京", //城市，默认全国
        input: "keyword"//使用联想输入的input的id
    };
    autocomplete = new AMap.Autocomplete(autoOptions);
    var placeSearch = new AMap.PlaceSearch({
        city: '北京',
        map: map
    });
    AMap.event.addListener(autocomplete, "select", function (e) {
        placeSearch.search(e.poi.name)
    });
    map.addControl(new AMap.ToolBar({"position": "RB", "liteStyle": true}));
    // 鼠标工具
    mouseTool = new AMap.MouseTool(map);
});
// 绘制矩形
function iRectangle() {
    mouseTool.close(true);
    mouseTool.rectangle();
}
$(function () {
    // layui
    layui.use(['layer', 'form', 'upload'], function () {
        var layer = layui.layer;
        var form = layui.form;
        var upload = layui.upload();
    });
    // Create course
    $("#create-course").click(function () {
        $("#view-course-li").removeClass('active');
        $("#create-course-li").addClass('active');
        layer.close(viewCourseIndex);
        createCourseIndex = layer.open({
            type: 1
            , title: ['创建新课程', 'font-weight:bold;']
            , offset: ['56px', '10px']
            , area: ['500px', 'auto']
            , maxmin: true
            , shade: 0
            , moveType: 1
            , content: $('#create-course-form')
            , cancel: function () {
                map.off('mousedown', _onMouseDown);
                map.off('mouseup', _onMouseUp);
                $("#create-course-li").removeClass('active');
                $('#create-form')[0].reset();
                $('#area-lt-lnglat').html('');
                $('#area-rb-lnglat').html('');
                $('#area-rectangle').html('选择区域');
            }
        });
    });
    // rectangle
    $('#area-rectangle').click(function () {
        mouseTool.close(true);
        layer.min(createCourseIndex);
        layer.msg('鼠标在地图上拖动即可选择矩形区域', {icon: 6});
        mouseTool.rectangle();
        _onMouseDown = function (e) {
            rectangleLTLng = e.lnglat.getLng();
            rectangleLTLat = e.lnglat.getLat();
        };
        map.on('mousedown', _onMouseDown);
        _onMouseUp = function (e) {
            rectangleRBLng = e.lnglat.getLng();
            rectangleRBLat = e.lnglat.getLat();
            $("#rectangle-control").show();
            mouseTool.close(false);
        };
        map.on('mouseup', _onMouseUp);
    });
    // re-drag
    $('#re-drag').click(function () {
        iRectangle();
        $("#rectangle-control").hide();
    });
    // rectangle-ok
    $('#rectangle-ok').click(function () {
        mouseTool.close(true);
        map.off('mousedown', _onMouseDown);
        map.off('mouseup', _onMouseUp);
        $("#rectangle-control").hide();
        $('#area-rectangle').html('重选区域');
        var ltLngLat = '左上经纬(' + rectangleLTLng + ',' + rectangleLTLat + ')';
        var rbLngLat = '右下经纬(' + rectangleRBLng + ',' + rectangleRBLat + ')';
        $('#area-lt-lnglat').html(ltLngLat);
        $('#area-rb-lnglat').html(rbLngLat);
        layer.restore(createCourseIndex);
        $("input[name='lt-lng']").val(rectangleLTLng);
        $("input[name='lt-lat']").val(rectangleLTLat);
        $("input[name='rb-lng']").val(rectangleRBLng);
        $("input[name='rb-lat']").val(rectangleRBLat);
    });
    // upload image
//    layui.upload({
//      ext: 'jpg|png|gif'
//    });
    // Logout
    $("#logout").click(function () {
        var logoutIndex = layer.confirm('您确定要退出系统吗？', {
            btn: ['退出', '取消']
            , fix: true
            , move: false
        }, function () {

        }, function () {
            layer.close(logoutIndex);
        });
    });
});
