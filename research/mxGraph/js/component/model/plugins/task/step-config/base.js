/*
 * Copyright (c) 2013, Yunnan Yuan Xin technology Co., Ltd.
 *
 * All rights reserved.
 */
/**
 * @fileoverview 属性配置.
 *
 * @author <a href="mailto:LLY219@gmail.com">Liyuan Li</a>
 * @version 1.0.1.5, Jun 3, 2013
 */
/**
 * @description 获取数据
 */
eCooeModel.model.config.settings.task.stepConfig.base.getData = function() {
    var data = eCooeModel.model.config.settings.task.stepConfig.base.tempData;

    // 记录原值
    var currentId = $("#taskStepConfigList li.current").data("id");
    for (var i = 0; i < data.length; i++) {
        if (data[i].id === currentId) {
            data[i].name = $("#taskStepConfigName").val();
            data[i].desc = $("#taskStepConfigDesc").val();
            data[i].actionIds = [];
            $("#taskStepConfigAction input:checked").each(function() {
                data[i].actionIds.push($(this).parent().data("id"));
            });
            break;
        }
    }

    // 同步上一 user task 中当前 sequence 中的步骤
    var removeIds = eCooeModel.model.config.settings.task.stepConfig.base.removeIds,
            tasks = eCooeModel.model.config.data.tasks;
    for (var m = 0; m < removeIds.length; m++) {
        var edges = model.graph.getEdges(model.graph.getModel().
                getCellById(eCooeModel.model.config.settings.task.data.id));
        for (var j = 0; j < edges.length; j++) {
            var srcId = edges[j].source.id,
                    edgeId = edges[j].id;

            for (var k = 0; k < tasks.length; k++) {
                if (tasks[k].id === srcId) {
                    var flowActions = tasks[k].flowActions;
                    for (var l = 0; l < flowActions.length; l++) {
                        if (flowActions[l].sequenceId === edgeId) {
                            if (removeIds[m] === flowActions[l].targetStep) {
                                flowActions[l].targetStep = "";
                            }
                            break;
                        }
                    }
                    break;
                }
            }
        }
    }

    // 同步删除其余操作时，删除无用 id
    var allActionIds = [];
    $("#taskFlowActionList li").each(function() {
        allActionIds.push($(this).data("id"));
    });

    $("#taskAppActionList li").each(function() {
        if ($(this).find("input").prop("checked")) {
            allActionIds.push($(this).data("id"));
        }
    });

    $("#taskCommentActionList li").each(function() {
        allActionIds.push($(this).data("id"));
    });

    var steps = eCooeModel.model.config.settings.task.stepConfig.base.tempData;
    for (var j = 0; j < steps.length; j++) {
        var actionIds = steps[j].actionIds;
        for (var k = 0; k < actionIds.length; k++) {
            var isExist = false;
            for (var l = 0; l < allActionIds.length; l++) {
                if (allActionIds[l] === actionIds[k]) {
                    isExist = true;
                }
            }
            if (!isExist) {
                actionIds.splice(k, 1);
            }
        }
    }

    eCooeModel.model.config.settings.task.data.steps = eCooeModel.model.config.settings.task.stepConfig.base.tempData;
};

/**
 * @description 根据数据设置界面中的值
 */
eCooeModel.model.config.settings.task.stepConfig.base.setData = function() {
    eCooeModel.model.config.settings.task.stepConfig.base.tempData = [];
    eCooeModel.model.config.settings.task.stepConfig.base.removeIds = [];
    if (!eCooeModel.model.config.settings.task.data.steps) {
        eCooeModel.model.config.settings.task.data.steps = [];
    }
    $.extend(true, eCooeModel.model.config.settings.task.stepConfig.base.tempData, 
    eCooeModel.model.config.settings.task.data.steps);

    $("#taskStepConfigAction input").removeProp("checked");
    $("#taskStepConfigName").val("");
    $("#taskStepConfigDesc").val("");
    var data = eCooeModel.model.config.settings.task.stepConfig.base.tempData;
    if (data.length === 0) {
        $("#taskStepConfigPanel").hide();
        $("#taskStepConfigList").html("");
        return;
    }

    $("#taskStepConfigPanel").show();

    var liHTML = "";
    for (var i = 0; i < data.length; i++) {
        var className = "class='fn-pointer' ";
        if (i === 0) {
            $("#taskStepConfigName").val(data[i].name);
            $("#taskStepConfigDesc").val(data[i].desc);
            var actionIds = data[i].actionIds;
            for (var j = 0; j < actionIds.length; j++) {
                $("#taskStepConfigAction li").each(function() {
                    if ($(this).data("id") === data[i].actionIds[j]) {
                        $(this).find("input").prop("checked", true);
                    }
                });
            }

            className = "class='current first fn-pointer' ";
        }
        liHTML += "<li " + className + "onclick='eCooeModel.model.config.settings.task.stepConfig.base.changeForm(\"" + 
                data[i].id + "\", this)' data-id='" + data[i].id + "'>" + data[i].name + "</li>";
    }
    $("#taskStepConfigList").html(liHTML);
};

/**
 * @description 初始化页面中的关联事件
 */
eCooeModel.model.config.settings.task.stepConfig.base.init = function() {
    eCooeModel.model.config.settings.task.stepConfig.base.tempData = [];

    $("#taskStepConfigAdd").click(function() {
        // 添加
        var newObj = {
            "id": UUIDjs.create(),
            "name": "新增步骤",
            "isDefault": (eCooeModel.model.config.settings.task.stepConfig.base.tempData.length === 0 ? true : false),
            "desc": "",
            "actionIds": []
        };
        eCooeModel.model.config.settings.task.stepConfig.base.tempData.push(newObj);

        // 记录原值
        if (!newObj.isDefault) {
            var lastId = $("#taskStepConfigList li.current").data("id");
            for (var i = 0; i < eCooeModel.model.config.settings.task.stepConfig.base.tempData.length; i++) {
                var temp = eCooeModel.model.config.settings.task.stepConfig.base.tempData[i];
                if (temp.id === lastId) {
                    temp.name = $("#taskStepConfigName").val();
                    temp.desc = $("#taskStepConfigDesc").val();
                    $("#taskStepConfigAction input:checked").each(function() {
                        temp.actionIds.push($(this).parent().data("id"));
                    });
                    break;
                }
            }

            // 修改侧边值
            $("#taskStepConfigList li.current").text($("#taskStepConfigName").val());
        }

        // 设置默认
        $("#taskStepConfigAction input").removeProp("checked");
        $("#taskStepConfigName").val("新增步骤");
        $("#taskStepConfigDesc").val("");
        $("#taskStepConfigPanel").show();
        $("#taskStepConfigAction li.current").removeClass("current");

        // 添加侧边栏
        if (newObj.isDefault) {
            $("#taskStepConfigList").html("<li " + 
                    "onclick='eCooeModel.model.config.settings.task.stepConfig.base.changeForm(\"" 
                    + newObj.id + "\", this)' class='first fn-pointer current' data-id='" + newObj.id + "'>" +
                    newObj.name + "</li>");
        } else {
            $("#taskStepConfigList li").removeClass("current");
            $("#taskStepConfigList li:last").after("<li " + 
                    "onclick='eCooeModel.model.config.settings.task.stepConfig.base.changeForm(\"" + 
                    newObj.id + "\", this)' class='current fn-pointer' data-id='" + newObj.id + "'>" +
                    newObj.name + "</li>");
        }
    });

    $("#taskStepConfigRemove").click(function() {
        var currentId = $("#taskStepConfigList li.current").data("id");
        var data = eCooeModel.model.config.settings.task.stepConfig.base.tempData;

        for (var i = 0; i < data.length; i++) {
            if (currentId === data[i].id) {
                data.splice(i, 1);
                $("#taskStepConfigList li.current").remove();
            }
        }

        if (data.length === 0) {
            $("#taskStepConfigPanel").hide();
        } else {
            data[0].isDefault = true;
            $("#taskStepConfigList li:first").click().addClass("first");
        }

        //  同步当前 user task 中操作的目标步骤
        eCooeModel.model.config.settings.task.commentAction.base.getTarget();
        eCooeModel.model.config.settings.task.appAction.base.getTarget();

        if ($("#taskAppActionList li.current").length === 0
                && eCooeModel.model.config.settings.task.appAction.base.tempData.length > 0) {
            eCooeModel.model.config.settings.task.appAction.base.tempData[0].targetStep = "";
        }

        // 同步上一 user task 中当前 sequence 中的步骤
        eCooeModel.model.config.settings.task.stepConfig.base.removeIds.push(currentId);
    });

    $("#taskStepConfigTop").click(function() {
        if ($("#taskStepConfigList li.current").length < 1 ||
                $("#taskStepConfigList li.current").hasClass("first") ||
                $("#taskStepConfigList li").length < 2) {
            return;
        }

        var currentId = $("#taskStepConfigList li.current").data("id");
        var data = eCooeModel.model.config.settings.task.stepConfig.base.tempData;

        for (var i = 0; i < data.length; i++) {
            if (currentId === data[i].id) {
                var removeData = data.splice(i, 1)[0];
                data.splice(i - 1, 0, removeData);

                if (i === 1) {
                    data[0].isDefault = true;
                    data[1].isDefault = false;
                }
                break;
            }
        }

        $("#taskStepConfigList li.current").prev().before($("#taskStepConfigList li.current"));

        $("#taskStepConfigList li").removeClass("first");
        $("#taskStepConfigList li:first").addClass("first");
    });

    $("#taskStepConfigDown").click(function() {
        if ($("#taskStepConfigList li.current").length < 1 ||
                $("#taskStepConfigList li:last").hasClass("current") ||
                $("#taskStepConfigList li").length < 2) {
            return;
        }

        var currentId = $("#taskStepConfigList li.current").data("id");
        var data = eCooeModel.model.config.settings.task.stepConfig.base.tempData;

        for (var i = 0; i < data.length; i++) {
            if (currentId === data[i].id) {
                var removeData = data.splice(i, 1)[0];
                data.splice(i + 1, 0, removeData);

                if (i === 0) {
                    data[0].isDefault = true;
                    data[1].isDefault = false;
                }
                break;
            }
        }

        $("#taskStepConfigList li.current").next().after($("#taskStepConfigList li.current"));

        $("#taskStepConfigList li").removeClass("first");
        $("#taskStepConfigList li:first").addClass("first");
    });
};

/**
 * @description 点击侧边栏触发的事件
 * @param {String} id 步骤唯一标识
 * @param {BOM} it 事件源
 */
eCooeModel.model.config.settings.task.stepConfig.base.changeForm = function(id, it) {
    if ($(it).hasClass("current")) {
        return;
    }

    // 修改侧边值
    $("#taskStepConfigList li.current").text($("#taskStepConfigName").val());

    var data = eCooeModel.model.config.settings.task.stepConfig.base.tempData;

    // 记录原值
    var lastId = $("#taskStepConfigList li.current").data("id");
    for (var i = 0; i < data.length; i++) {
        if (data[i].id === lastId) {
            data[i].name = $("#taskStepConfigName").val();
            data[i].desc = $("#taskStepConfigDesc").val();
            data[i].actionIds = [];
            $("#taskStepConfigAction input:checked").each(function() {
                data[i].actionIds.push($(this).parent().data("id"));
            });
            break;
        }
    }
    $("#taskStepConfigList li, #taskStepConfigAction li").removeClass("current");

    // 设置
    $(it).addClass("current");
    for (var i = 0; i < data.length; i++) {
        if (id === data[i].id) {
            $("#taskStepConfigAction input").removeProp("checked");
            $("#taskStepConfigName").val(data[i].name);
            $("#taskStepConfigDesc").val(data[i].desc);

            for (var j = 0; j < data[i].actionIds.length; j++) {
                $("#taskStepConfigAction li").each(function() {
                    if ($(this).data("id") === data[i].actionIds[j]) {
                        $(this).find("input").prop("checked", true);
                        $(this).addClass("current");
                    }
                });
            }

            break;
        }
    }
};

/**
 * @description 获取步骤操作
 */
eCooeModel.model.config.settings.task.stepConfig.base.getStep = function() {
    var stepHTML = "";
    $("#taskFlowActionList li").each(function() {
        stepHTML += "<li data-id='" + $(this).data("id") + "'><input type='checkbox'/>" + $(this).text() + "</li>";
    });
    $("#taskAppActionList li").each(function() {
        if ($(this).find("input").prop("checked")) {
            stepHTML += "<li data-id='" + $(this).data("id") + "'><input type='checkbox'/>" + $(this).find("span").text() +
                    "</li>";
        }
    });
    $("#taskCommentActionList li").each(function() {
        stepHTML += "<li data-id='" + $(this).data("id") + "'><input type='checkbox'/>" + $(this).text() + "</li>";
    });

    $("#taskStepConfigAction").html(stepHTML);
    $("#taskStepConfigAction li:last").addClass("last");

    var data = eCooeModel.model.config.settings.task.stepConfig.base.tempData;
    var currentId = $("#taskStepConfigList li.current").data("id");
    for (var i = 0; i < data.length; i++) {
        if (data[i].id === currentId) {

            for (var j = 0; j < data[i].actionIds.length; j++) {
                $("#taskStepConfigAction li").each(function() {
                    if ($(this).data("id") === data[i].actionIds[j]) {
                        $(this).find("input").prop("checked", true);
                        $(this).addClass("current");
                    }
                });
            }
            break;
        }
    }

    $("#taskStepConfigAction input").click(function() {
        if ($(this).prop("checked")) {
            $(this).parent().addClass("current");
        } else {
            $(this).parent().removeClass("current");
        }
    });
};