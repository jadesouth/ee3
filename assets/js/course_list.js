/**
 * Created by wangnan on 16-10-27.
 */
var editCourseIndex, addTaskIndex, singleIndex, multiIndex, photoIndex, qaIndex;
var viewCourseSwap, editCourseSwap, taskListSwap, addTaskSwap;
var amap,search;
var _onMouseDown, _onMouseUp;
var mouseTool;
var viewTaskButton, addTaskButton, editTaskButton, taskCancelButton, addTaskSubmitButton;
var singleItemNum = 2;
var multiItemNum = 2;
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

$(function() {
    // layui
    layui.use(['layer', 'form', 'upload'], function () {
        var layer = layui.layer;
        var form = layui.form;
        var uoload = layui.upload();
    });
    // 获取节点
    viewCourseSwap = $("#view-course-swap");
    editCourseSwap = $("#edit-course-swap");
    taskListSwap = $("#task-list-swap");
    addTaskSwap = $("#add-task-swap");
    amap = $("#amap");
    search = $("#search");
    viewTaskButton = $(".view-task-button");
    addTaskButton = $("#add-task-button");
    editTaskButton = $(".edit-task-button");
    taskCancelButton = $("#task-cancel-button");
    addTaskSubmitButton = $("#add-task-submit-button");
    // 点击编辑课程按钮
    $(".edit-course-button").click(function() {
        viewCourseSwap.hide();
        amap.show();
        search.show();
        editCourseIndex = layer.open({
            type: 1
            , title: ['编辑课程', 'font-weight:bold;']
            , offset: ['10px', '10px']
            , area: ['500px', 'auto']
            , maxmin: true
            , shade: 0
            , moveType: 1
            , content: editCourseSwap
            , cancel: function () {
                map.off('mousedown', _onMouseDown);
                map.off('mouseup', _onMouseUp);
                //$("#create-course-li").removeClass('active');
                //$('#create-form')[0].reset();
                //$('#area-lt-lnglat').html('');
                //$('#area-rb-lnglat').html('');
                //$('#area-rectangle').html('选择区域');
            }
        });
    });
    // 点击区域选择选择区域
    $('#area-rectangle').click(function () {
        mouseTool.close(true);
        layer.min(editCourseIndex);
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
    // 课程区域重选
    $('#re-drag').click(function () {
        iRectangle();
        $("#rectangle-control").hide();
    });
    // 课程区域选择OK
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
        layer.restore(editCourseIndex);
        $("input[name='lt-lng']").val(rectangleLTLng);
        $("input[name='lt-lat']").val(rectangleLTLat);
        $("input[name='rb-lng']").val(rectangleRBLng);
        $("input[name='rb-lat']").val(rectangleRBLat);
    });
    // 点击查看任务按钮
    viewTaskButton.click(function() {
        viewCourseSwap.hide();
        taskListSwap.show();
    });
    $("#return-course-button").click(function() {
        viewCourseSwap.show();
        taskListSwap.hide();
    });
    // 点击添加任务按钮
    var taskFunction = function() {
        amap.show();
        addTaskIndex = layer.open({
            type: 1
            , title: ['添加任务', 'font-weight:bold;']
            , offset: ['10px', '10px']
            , area: ['500px', 'auto']
            , maxmin: true
            , shade: 0
            , moveType: 1
            , content: addTaskSwap
            , cancel: function () {
                map.off('mousedown', _onMouseDown);
                map.off('mouseup', _onMouseUp);
                //$("#create-course-li").removeClass('active');
                //$('#create-form')[0].reset();
                //$('#area-lt-lnglat').html('');
                //$('#area-rb-lnglat').html('');
                //$('#area-rectangle').html('选择区域');
            }
        });
    };
    addTaskButton.click(taskFunction);
    // 点击编辑任务按钮
    editTaskButton.click(taskFunction);
    // 点击添加任务取消按钮
    taskCancelButton.click(function() {
        amap.hide();
        layer.close(addTaskIndex);
    });
    addTaskSubmitButton.click(function() {
        amap.hide();
        layer.close(addTaskIndex);
    });
    // 任务区域选择
    $('#task-area-rectangle').click(function () {
        mouseTool.close(true);
        layer.min(addTaskIndex);
        layer.msg('鼠标在地图上拖动即可选择矩形区域', {icon: 6});
        mouseTool.rectangle();
        _onMouseDown = function (e) {
            taskRectangleLTLng = e.lnglat.getLng();
            taskRectangleLTLat = e.lnglat.getLat();
        };
        map.on('mousedown', _onMouseDown);
        _onMouseUp = function (e) {
            taskRectangleRBLng = e.lnglat.getLng();
            taskRectangleRBLat = e.lnglat.getLat();
            $("#task-rectangle-control").show();
            mouseTool.close(false);
        };
        map.on('mouseup', _onMouseUp);
    });
    // 任务区域选择OK
    $('#task-rectangle-ok').click(function () {
        mouseTool.close(true);
        map.off('mousedown', _onMouseDown);
        map.off('mouseup', _onMouseUp);
        $("#task-rectangle-control").hide();
        $('#task-area-rectangle').html('重选区域');
        var ltLngLat = '左上经纬(' + taskRectangleLTLng + ', ' + taskRectangleLTLat + ')';
        var rbLngLat = '右下经纬(' + taskRectangleRBLng + ', ' + taskRectangleRBLat + ')';
        $('#task-area-lt-lnglat').html(ltLngLat);
        $('#task-area-rb-lnglat').html(rbLngLat);
        layer.restore(addTaskIndex);
        $("input[name='task-lt-lng']").val(taskRectangleLTLng);
        $("input[name='task-lt-lat']").val(taskRectangleLTLat);
        $("input[name='task-rb-lng']").val(taskRectangleRBLng);
        $("input[name='task-rb-lat']").val(taskRectangleRBLat);
        layer.style(addTaskIndex, {
            height: 'auto'
        });
    });
    // 任务区域重选
    $('#task-re-drag').click(function () {
        iRectangle();
        $("#task-rectangle-control").hide();
    });
    // 点击添加题目按钮
    $(".add-topic-button").click(function() {
        $("#topic-list-swap").show();
        taskListSwap.hide();
    });
    // 点击添加单选题
    $("#add-single-button").click(function() {
        singleIndex = layer.open({
            type: 1
            , title: ['添加单选题', 'font-weight:bold;']
            , offset: ['10px', '10px']
            , area: ['510px', 'auto']
            , maxmin: true
            , shade: 0
            , moveType: 1
            , content: $("#single-swap")
            , cancel: function () {
                //$("#create-course-li").removeClass('active');
                //$('#create-form')[0].reset();
                //$('#area-lt-lnglat').html('');
                //$('#area-rb-lnglat').html('');
                //$('#area-rectangle').html('选择区域');
            }
        });
    });
    // 点击添加一项单选
    $("#add-single-item-button").click(function() {
        singleItemNum++;
        var item = '<div class="layui-form-item"><div class="layui-inline" style="margin-right:0"><label class="layui-form-label">选项' + singleItemNum +
            '</label><div class="layui-input-inline" style="width:auto;"><input type="radio" name="sex" title="选为正答">' +
            '<div class="layui-unselect layui-form-radio"><i class="layui-anim layui-icon"></i><span>选为正答</span></div></div>' +
            '<div class="layui-input-inline" style="width:220px;">' +
            '<input type="text" name="price_max" placeholder="输入选项答案" autocomplete="off" class="layui-input"></div>' +
            '<div class="layui-input-inline del-item" style="width:auto;line-height:30px;">' +
            '<button type="button" class="layui-btn layui-btn-mini layui-btn-danger"><i class="layui-icon">&#x1006;</i></button></div></div></div>';
        $("#add-single-swap").append(item);
    });
    // 点击添加多选
    $("#add-multi-button").click(function() {
        multiIndex = layer.open({
            type: 1
            , title: ['添加多选题', 'font-weight:bold;']
            , offset: ['10px', '10px']
            , area: ['526x', 'auto']
            , maxmin: true
            , shade: 0
            , moveType: 1
            , content: $("#multi-swap")
            , cancel: function () {
                //$("#create-course-li").removeClass('active');
                //$('#create-form')[0].reset();
                //$('#area-lt-lnglat').html('');
                //$('#area-rb-lnglat').html('');
                //$('#area-rectangle').html('选择区域');
            }
        });
    });
    // 点击添加一项多
    $("#add-multi-item-button").click(function() {
        multiItemNum++;
        var item = '<div class="layui-form-item"><div class="layui-inline" style="margin-right:0"><label class="layui-form-label">选项' + multiItemNum +
            '</label><div class="layui-input-inline" style="width:auto;"><input type="checkbox" name="sex" title="选为正答">' +
            '<div class="layui-unselect layui-form-checkbox"><span>选为正答</span><i class="layui-icon"></i></div></div>' +
            '<div class="layui-input-inline" style="width:220px;">' +
            '<input type="text" name="price_max" placeholder="输入选项答案" autocomplete="off" class="layui-input"></div>' +
            '<div class="layui-input-inline del-item" style="width:auto;line-height:30px;">' +
            '<button type="button" class="layui-btn layui-btn-mini layui-btn-danger"><i class="layui-icon">&#x1006;</i></button></div></div></div>';
        $("#add-multi-swap").append(item);
    });
    // 点击添加拍照题
    $("#add-photo-button").click(function() {
        photoIndex = layer.open({
            type: 1
            , title: ['添加拍照题', 'font-weight:bold;']
            , offset: ['10px', '10px']
            , area: ['500px', 'auto']
            , maxmin: true
            , shade: 0
            , moveType: 1
            , content: $("#photo-swap")
            , cancel: function () {
                //$("#create-course-li").removeClass('active');
                //$('#create-form')[0].reset();
                //$('#area-lt-lnglat').html('');
                //$('#area-rb-lnglat').html('');
                //$('#area-rectangle').html('选择区域');
            }
        });
    });
    // 点击添加问答题
    $("#add-qa-button").click(function() {
        qaIndex = layer.open({
            type: 1
            , title: ['添加问答题', 'font-weight:bold;']
            , offset: ['10px', '10px']
            , area: ['500px', 'auto']
            , maxmin: true
            , shade: 0
            , moveType: 1
            , content: $("#qa-swap")
            , cancel: function () {
                //$("#create-course-li").removeClass('active');
                //$('#create-form')[0].reset();
                //$('#area-lt-lnglat').html('');
                //$('#area-rb-lnglat').html('');
                //$('#area-rectangle').html('选择区域');
            }
        });
    });

    // 临时关闭
    $('.close-msg').click(function() {
        layer.closeAll();
    });
    $('.del-item').delegate('button', 'click', function() {
        alert(1);
        $(this).parent().parent().remove();
    });
});