/*
 * Copyright (c) 2013, Yunnan Yuan Xin technology Co., Ltd.
 *
 * All rights reserved.
 */
/**
 * @fileoverview 属性配置.
 *
 * @author <a href="mailto:LLY219@gmail.com">Liyuan Li</a>
 * @version 1.0.2.3, Jun 3, 2013
 */
/**
 * @description 获取数据
 */
eCooeModel.model.config.settings.task.flowAction.base.getData = function() {
    var data = eCooeModel.model.config.settings.task.flowAction.base.tempData;

    // 记录原值
    var currentId = $("#taskFlowActionList li.current").data("id");
    for (var i = 0; i < data.length; i++) {
        if (data[i].id === currentId) {
            data[i].name = $("#taskFlowActionName").val();
            data[i].desc = $("#taskFlowActionDesc").val();
            $("#taskFlowActionList .current").text(data[i].name);

            if (data[i].type !== "End") {
                if (data[i].type !== "Gateway") {
                    data[i].type = $('input[name="taskFlowActionType"]:checked').val();
                    if (data[i].type === "SelSend") {
                        data[i].filter = $("#taskFlowActionFilter").val();
                        data[i].chooseType = $("#taskFlowActionChooseType").val();
                        data[i].chooseNode = $('input[name="taskFlowActionChooseNode"]:checked').val();
                        data[i].showLevel = $('input[name="taskFlowActionShowLevel"]:checked').val();
                    } else {
                        data[i].filter = $("#taskFlowActionSendRule").val();
                    }

                    data[i].activationMode.type = $("#taskFlowActionActivationMode").val();
                    if (data[i].activationMode.type === "Complex") {
                        data[i].activationMode.range = $("#taskFlowActionRange").val();
                        data[i].activationMode.tasks = $("#taskFlowActionTask").data("ids");
                        if (!data[i].activationMode.id) {
                            data[i].activationMode.id = UUIDjs.create();
                        }
                    }
                    data[i].targetStep = ($("#taskFlowActionTargetStep").val() ?
                            $("#taskFlowActionTargetStep").val() : "");
                }
                eCooeModel.model.config.settings.task.flowAction.advance.getForm(data[i]);
                if (eCooeModel.model.config.settings.task.flowAction.extend
                        && eCooeModel.model.config.settings.task.flowAction.extend.getForm) {
                    eCooeModel.model.config.settings.task.flowAction.extend.getForm(data[i]);
                }
            }
        }

        model.graph.getModel().getCellById(data[i].sequenceId).value = data[i].name;
        model.graph.refresh(model.graph.getModel().getCellById(data[i].sequenceId));
    }

    // remove edge 
    var removeIds = eCooeModel.model.config.settings.task.flowAction.base.removeIds;
    for (var j = 0; j < removeIds.length; j++) {
        delete eCooeModel.model.config.settings.sequence.data[removeIds[j]];
        model.graph.getModel().remove(model.graph.getModel().getCellById(removeIds[j]));
    }
    eCooeModel.model.config.settings.task.data.flowActions =
            eCooeModel.model.config.settings.task.flowAction.base.tempData;
};

/**
 * @description 根据数据设置界面中的值
 * @param {Obj} cell mxGraph 中的 cell 对象
 */
eCooeModel.model.config.settings.task.flowAction.base.setData = function(cell) {
    eCooeModel.model.config.settings.task.flowAction.base.tempData = [];
    eCooeModel.model.config.settings.task.flowAction.base.removeIds = [];
    $.extend(true, eCooeModel.model.config.settings.task.flowAction.base.tempData,
            eCooeModel.model.config.settings.task.data.flowActions);
    var data = eCooeModel.model.config.settings.task.flowAction.base.tempData;
    // 左侧导航
    var listHTML = "";
    for (var i = 0; i < data.length; i++) {
        listHTML += "<li class='fn-pointer' onclick=\"eCooeModel.model.config.settings.task.flowAction.base.changeForm('" +
                data[i].sequenceId + "', this)\" data-id='" + data[i].id + "' data-sequenceid='" +
                data[i].sequenceId + "'>" + data[i].name + "</li>";
    }
    $("#taskFlowActionList").html(listHTML);

    if (listHTML === "") {
        $("#taskFlowActionPanel").hide();
        $("#taskFlowActionAdvancePanel").hide();
        return;
    }

    $("#taskFlowActionPanel").show();
    $("#taskFlowActionAdvancePanel").show();

    // 环节
    eCooeModel.model.config.genAllTask("taskFlowActionTask");

    $("#taskFlowActionList li").get(0).className = "first fn-pointer";
    $("#taskFlowActionList li:first").click();
};

/**
 * @description 点击侧边栏触发的事件
 * @param {String} sequenceId 连线唯一标识
 * @param {BOM} it 事件源
 */
eCooeModel.model.config.settings.task.flowAction.base.changeForm = function(sequenceId, it) {
    if ($(it).hasClass("current")) {
        return;
    }

    var lastId = $("#taskFlowActionList .current").data("id"),
            data = eCooeModel.model.config.settings.task.flowAction.base.tempData;
    for (var i = 0; i < data.length; i++) {
        if (data[i].id === lastId) {
            data[i].name = $("#taskFlowActionName").val();
            data[i].desc = $("#taskFlowActionDesc").val();
            $("#taskFlowActionList .current").text(data[i].name);

            if (data[i].type !== "End") {
                if (data[i].type !== "Gateway") {
                    data[i].type = $('input[name="taskFlowActionType"]:checked').val();
                    if (data[i].type === "SelSend") {
                        data[i].filter = $("#taskFlowActionFilter").val();
                        data[i].chooseType = $("#taskFlowActionChooseType").val();
                        data[i].chooseNode = $('input[name="taskFlowActionChooseNode"]:checked').val();
                        data[i].showLevel = $('input[name="taskFlowActionShowLevel"]:checked').val();
                    } else {
                        data[i].filter = $("#taskFlowActionSendRule").val();
                    }

                    data[i].activationMode.type = $("#taskFlowActionActivationMode").val();
                    if (data[i].activationMode.type === "Complex") {
                        data[i].activationMode.range = $("#taskFlowActionRange").val();
                        data[i].activationMode.tasks = $("#taskFlowActionTask").data("ids");
                        if (!data[i].activationMode.id) {
                            data[i].activationMode.id = UUIDjs.create();
                        }
                    }
                    data[i].targetStep = ($("#taskFlowActionTargetStep").val() ? $("#taskFlowActionTargetStep").val() : "");
                }
                eCooeModel.model.config.settings.task.flowAction.advance.getForm(data[i]);
                if (eCooeModel.model.config.settings.task.flowAction.extend
                        && eCooeModel.model.config.settings.task.flowAction.extend.getForm) {
                    eCooeModel.model.config.settings.task.flowAction.extend.getForm(data[i]);
                }
            }
            break;
        }
    }

    // 触发步骤
    var edge = model.graph.getModel().getCellById(sequenceId);
    var target = model.graph.getModel().getTerminal(edge, false);
    var targetId = target.id,
            targetBpmn = target.bpmn;
    if (targetBpmn.indexOf("Gateway") === -1) {
        var tasks = eCooeModel.model.config.data.tasks,
                targetStepHTML = "";
        for (var i = 0; i < tasks.length; i++) {
            if (tasks[i].id === targetId) {
                var steps = tasks[i].steps;
                for (var j = 0; j < steps.length; j++) {
                    targetStepHTML += "<option value='" + steps[j].id + "'>" + steps[j].name + "</option>";
                }
                break;
            }
        }

        if (targetStepHTML === "") {
            targetStepHTML = "<option value=''> </option>";
        }
        $("#taskFlowActionTargetStep").html(targetStepHTML);
    }

    $("#taskFlowActionList li").removeClass("current");
    $(it).addClass("current");

    for (var i = 0; i < data.length; i++) {
        if ($("#taskFlowActionList li.current").data("id") === data[i].id) {
            $("#taskFlowActionName").val(data[i].name);
            $("#taskFlowActionDesc").val(data[i].desc);

            if (data[i].type !== "End") {
                if (data[i].type !== "Gateway") {
                    $('input[name="taskFlowActionType"][value="' + data[i].type + '"]').prop("checked", "checked");
                    if (data[i].type === "SelSend") {
                        $("#taskFlowActionSendRule").val("");
                        $("#taskFlowActionFilter").val(data[i].filter);
                        $("#taskFlowActionChooseType").val(data[i].chooseType);
                        $('input[name="taskFlowActionChooseNode"][value="' + data[i].chooseNode + '"]').
                                prop("checked", "checked");
                        $('input[name="taskFlowActionShowLevel"][value="' + data[i].showLevel + '"]').
                                prop("checked", "checked");
                        $('input[name="taskFlowActionType"]').parent().next().next().hide();
                        $('input[name="taskFlowActionType"]').parent().next().show();
                    } else {
                        $("#taskFlowActionSendRule").val(data[i].filter);
                        $("#taskFlowActionFilter").val("");
                        $("#taskFlowActionChooseType").val("Single");
                        $('input[name="taskFlowActionChooseNode"][value="User"]').prop("checked", "checked");
                        $('input[name="taskFlowActionShowLevel"][value=""]').prop("checked", "checked");
                        $('input[name="taskFlowActionType"]').parent().next().next().show();
                        $('input[name="taskFlowActionType"]').parent().next().hide();
                    }

                    $("#taskFlowActionActivationMode").val(data[i].activationMode.type);
                    if (data[i].activationMode.type === "Complex") {
                        $("#taskFlowActionRange").val(data[i].activationMode.range);
                        $("#taskFlowActionActivationMode").next().show();
                        $("#taskFlowActionActivationMode").css("margin-top", "0");

                        var tasks = data[i].activationMode.tasks,
                                values = "";

                        $("#taskFlowActionTaskPanel input").each(function() {
                            $(this).removeProp("checked");
                            $(this).parent().removeClass("current");
                            for (var j = 0; j < tasks.length; j++) {
                                if (tasks[j].toString() === $(this).data("id").toString()) {
                                    values += $(this).next().text() + "、";
                                    $(this).prop("checked", "checked");
                                    $(this).parent().addClass("current");
                                }
                            }
                        });
                        $("#taskFlowActionTask").val(values.substr(0, values.length - 1)).data("ids", tasks);
                        $("#taskFlowActionTaskPanel").hide();
                    } else {
                        $("#taskFlowActionRange").val("Org");
                        $("#taskFlowActionActivationMode").next().hide();
                        $("#taskFlowActionActivationMode").css("margin-top", "9px");

                        $("#taskFlowActionTaskPanel input").each(function() {
                            $(this).removeProp("checked");
                            $(this).parent().removeClass("current");
                        });
                        $("#taskFlowActionTask").val("").data("ids", []);
                        $("#taskFlowActionTaskPanel").hide();
                    }
                    $("#taskFlowActionTargetStep").val(data[i].targetStep);

                    $($("#taskFlowActionPanel tr").get(2)).show();
                    $($("#taskFlowActionPanel tr").get(3)).show();
                    $($("#taskFlowActionPanel tr").get(4)).show();
                    $($("#taskFlowActionAdvancePanel tr").get(1)).show();
                    $("#taskFlowActionAdvancePanel").show();
                } else {
                    $("#taskFlowActionAdvancePanel").show();
                    $("#taskFlowActionAdvancePanel tr").get(1).style.display = "none";
                    $("#taskFlowActionPanel tr").get(2).style.display = "none";
                    $("#taskFlowActionPanel tr").get(3).style.display = "none";
                    $("#taskFlowActionPanel tr").get(4).style.display = "none";
                }

                eCooeModel.model.config.settings.task.flowAction.advance.setForm(data[i]);
                if (eCooeModel.model.config.settings.task.flowAction.extend &&
                        eCooeModel.model.config.settings.task.flowAction.extend.setForm) {
                    eCooeModel.model.config.settings.task.flowAction.extend.setForm(data[i]);
                }
            } else {
                $("#taskFlowActionAdvancePanel").hide();
                $("#taskFlowActionPanel tr").get(2).style.display = "none";
                $("#taskFlowActionPanel tr").get(3).style.display = "none";
                $("#taskFlowActionPanel tr").get(4).style.display = "none";

            }
            break;
        }
    }
};

/**
 * @description 初始化页面中的关联事件
 */
eCooeModel.model.config.settings.task.flowAction.base.init = function() {
    $("input[name=taskFlowActionType]").change(function() {
        if (this.value === "SelSend") {
            $(this).parent().next().next().hide();
            $(this).parent().next().show();
        } else {
            $(this).parent().next().next().show();
            $(this).parent().next().hide();
        }
    });

    $("#taskFlowActionActivationMode").change(function() {
        if (this.value === "Complex") {
            $(this).next().show();
            $(this).css("margin-top", "0");
        } else {
            $(this).next().hide();
            $(this).css("margin-top", "9px");
        }
    });

    $("#taskFlowActionRemove").click(function() {
        if ($("#taskFlowActionList li.current").length !== 1) {
            return;
        }

        var id = $("#taskFlowActionList li.current").data("sequenceid");
        var data = eCooeModel.model.config.settings.task.flowAction.base.tempData;
        for (var i = 0; i < data.length; i++) {
            if (data[i].sequenceId === id) {
                eCooeModel.model.config.settings.task.flowAction.base.removeIds.push(data[i].sequenceId);
                data.splice(i, 1);
                $("#taskFlowActionList li.current").remove();
                $("#taskFlowActionList li:first").addClass("first").click();
            }
        }
    });

    $("#taskFlowActionTop").click(function() {
        if ($("#taskFlowActionList li.current").length < 1 ||
                $("#taskFlowActionList li.current").hasClass("first") ||
                $("#taskFlowActionList li").length < 2) {
            return;
        }

        var currentId = $("#taskFlowActionList li.current").data("id");
        var data = eCooeModel.model.config.settings.task.flowAction.base.tempData;

        for (var i = 0; i < data.length; i++) {
            if (currentId === data[i].id) {
                var removeData = data.splice(i, 1)[0];
                data.splice(i - 1, 0, removeData);
                break;
            }
        }

        $("#taskFlowActionList li.current").prev().before($("#taskFlowActionList li.current"));

        $("#taskFlowActionList li").removeClass("first");
        $("#taskFlowActionList li:first").addClass("first");
    });

    $("#taskFlowActionDown").click(function() {
        if ($("#taskFlowActionList li.current").length < 1 ||
                $("#taskFlowActionList li:last").hasClass("current") ||
                $("#taskFlowActionList li").length < 2) {
            return;
        }

        var currentId = $("#taskFlowActionList li.current").data("id");
        var data = eCooeModel.model.config.settings.task.flowAction.base.tempData;

        for (var i = 0; i < data.length; i++) {
            if (currentId === data[i].id) {
                var removeData = data.splice(i, 1)[0];
                data.splice(i + 1, 0, removeData);
                break;
            }
        }

        $("#taskFlowActionList li.current").next().after($("#taskFlowActionList li.current"));

        $("#taskFlowActionList li").removeClass("first");
        $("#taskFlowActionList li:first").addClass("first");
    });
};