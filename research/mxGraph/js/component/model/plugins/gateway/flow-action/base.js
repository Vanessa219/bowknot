/*
 * Copyright (c) 2013, Yunnan Yuan Xin technology Co., Ltd.
 *
 * All rights reserved.
 */
/**
 * @fileoverview 属性配置.
 *
 * @author <a href="mailto:LLY219@gmail.com">Liyuan Li</a>
 * @version 1.0.0.3, Jun 3, 2013
 */
/**
 * @description 获取数据
 */
eCooeModel.model.config.settings.gateway.flowAction.base.getData = function() {
    var data = eCooeModel.model.config.settings.gateway.flowAction.base.tempData;

    // 记录原值
    var currentId = $("#gatewayFlowActionList li.current").data("id");
    for (var i = 0; i < data.length; i++) {
        if (data[i].id === currentId) {
            data[i].name = $("#gatewayFlowActionName").val();
            data[i].desc = $("#gatewayFlowActionDesc").val();
            $("#gatewayFlowActionList .current").text(data[i].name);

            if (data[i].type !== "End") {
                data[i].type = $('input[name="gatewayFlowActionType"]:checked').val();
                if (data[i].type === "SelSend") {
                    data[i].filter = $("#gatewayFlowActionFilter").val();
                    data[i].chooseType = $("#gatewayFlowActionChooseType").val();
                    data[i].chooseNode = $('input[name="gatewayFlowActionChooseNode"]:checked').val();
                    data[i].showLevel = $('input[name="gatewayFlowActionShowLevel"]:checked').val();
                } else {
                    data[i].filter = $("#gatewayFlowActionSendRule").val();
                }

                data[i].activationMode.type = $("#gatewayFlowActionActivationMode").val();
                if (data[i].activationMode.type === "Complex") {
                    data[i].activationMode.range = $("#gatewayFlowActionRange").val();
                    data[i].activationMode.tasks = $("#gatewayFlowActionTask").data("ids");
                    if (!data[i].activationMode.id) {
                        data[i].activationMode.id = UUIDjs.create();
                    }
                }
                data[i].targetStep = ($("#gatewayFlowActionTargetStep").val() ?
                $("#gatewayFlowActionTargetStep").val() : "");
                eCooeModel.model.config.settings.gateway.flowAction.advance.getForm(data[i]);
                if (eCooeModel.model.config.settings.gateway.flowAction.extend
                        && eCooeModel.model.config.settings.gateway.flowAction.extend.getForm) {
                    eCooeModel.model.config.settings.gateway.flowAction.extend.getForm(data[i]);
                }
            }
        }

        model.graph.getModel().getCellById(data[i].sequenceId).value = data[i].name;
        model.graph.refresh(model.graph.getModel().getCellById(data[i].sequenceId));
    }

    // remove edge 
    var removeIds = eCooeModel.model.config.settings.gateway.flowAction.base.removeIds;
    for (var j = 0; j < removeIds.length; j++) {
        delete eCooeModel.model.config.settings.sequence.data[removeIds[j]];
        model.graph.getModel().remove(model.graph.getModel().getCellById(removeIds[j]));
    }
    eCooeModel.model.config.settings.gateway.data.flowActions = 
            eCooeModel.model.config.settings.gateway.flowAction.base.tempData;
};

/**
 * @description 根据数据设置界面中的值
 * @param {Obj} cell mxGraph 中的 cell 对象
 */
eCooeModel.model.config.settings.gateway.flowAction.base.setData = function(cell) {
    var tasksData = eCooeModel.model.config.data.tasks;
    for (var i = 0; i < tasksData.length; i++) {
        if (cell.id === tasksData[i].id) {
            eCooeModel.model.config.settings.gateway.data = tasksData[i];
            break;
        }
    }

    eCooeModel.model.config.settings.gateway.flowAction.base.tempData = [];
    eCooeModel.model.config.settings.gateway.flowAction.base.removeIds = [];
    $.extend(true, eCooeModel.model.config.settings.gateway.flowAction.base.tempData, 
    eCooeModel.model.config.settings.gateway.data.flowActions);
    var data = eCooeModel.model.config.settings.gateway.flowAction.base.tempData;
    // 左侧导航
    var listHTML = "";
    for (var i = 0; i < data.length; i++) {
        if (data[i].name) {
            listHTML += "<li class='fn-pointer' " +
                    "onclick=\"eCooeModel.model.config.settings.gateway.flowAction.base.changeForm('" +
                    data[i].sequenceId + "', this)\" data-id='" + data[i].id + "' data-sequenceid='" +
                    data[i].sequenceId + "'>" + data[i].name + "</li>";
        }
    }
    $("#gatewayFlowActionList").html(listHTML);

    if (listHTML === "") {
        $("#gatewayFlowActionPanel").hide();
        $("#gatewayFlowActionAdvancePanel").hide();
        return;
    }

    $("#gatewayFlowActionPanel").show();
    $("#gatewayFlowActionAdvancePanel").show();

    // 环节
    eCooeModel.model.config.genAllTask("gatewayFlowActionTask");

    $("#gatewayFlowActionList li").get(0).className = "first fn-pointer";
    $("#gatewayFlowActionList li:first").click();
};

/**
 * @description 点击侧边栏触发的事件
 * @param {String} sequenceId 连线唯一标识
 * @param {BOM} it 事件源
 */
eCooeModel.model.config.settings.gateway.flowAction.base.changeForm = function(sequenceId, it) {
    if ($(it).hasClass("current")) {
        return;
    }

    var lastId = $("#gatewayFlowActionList .current").data("id"),
            data = eCooeModel.model.config.settings.gateway.flowAction.base.tempData;
    for (var i = 0; i < data.length; i++) {
        if (data[i].id === lastId) {
            data[i].name = $("#gatewayFlowActionName").val();
            data[i].desc = $("#gatewayFlowActionDesc").val();
            $("#gatewayFlowActionList .current").text(data[i].name);

            if (data[i].type !== "End") {
                data[i].type = $('input[name="gatewayFlowActionType"]:checked').val();
                if (data[i].type === "SelSend") {
                    data[i].filter = $("#gatewayFlowActionFilter").val();
                    data[i].chooseType = $("#gatewayFlowActionChooseType").val();
                    data[i].chooseNode = $('input[name="gatewayFlowActionChooseNode"]:checked').val();
                    data[i].showLevel = $('input[name="gatewayFlowActionShowLevel"]:checked').val();
                } else {
                    data[i].filter = $("#gatewayFlowActionSendRule").val();
                }

                data[i].activationMode.type = $("#gatewayFlowActionActivationMode").val();
                if (data[i].activationMode.type === "Complex") {
                    data[i].activationMode.range = $("#gatewayFlowActionRange").val();
                    data[i].activationMode.tasks = $("#gatewayFlowActionTask").data("ids");
                    if (!data[i].activationMode.id) {
                        data[i].activationMode.id = UUIDjs.create();
                    }
                }
                data[i].targetStep = ($("#gatewayFlowActionTargetStep").val() ? 
                $("#gatewayFlowActionTargetStep").val() : "");
                eCooeModel.model.config.settings.gateway.flowAction.advance.getForm(data[i]);
                if (eCooeModel.model.config.settings.gateway.flowAction.extend
                        && eCooeModel.model.config.settings.gateway.flowAction.extend.getForm) {
                    eCooeModel.model.config.settings.gateway.flowAction.extend.getForm(data[i]);
                }
            }
            break;
        }
    }

    // 触发步骤
    var edge = model.graph.getModel().getCellById(sequenceId);
    var targetId = model.graph.getModel().getTerminal(edge, false).id;
    var tasksData = eCooeModel.model.config.data.tasks,
            targetStepHTML = "";
    for (var i = 0; i < tasksData.length; i++) {
        if (tasksData[i].id === targetId) {
            var steps = tasksData[i].steps;
            for (var j = 0; j < steps.length; j++) {
                targetStepHTML += "<option value='" + steps[j].id + "'>" + steps[j].name + "</option>";
            }
            break;
        }
    }

    if (targetStepHTML === "") {
        targetStepHTML = "<option value=''> </option>";
    }
    $("#gatewayFlowActionTargetStep").html(targetStepHTML);

    $("#gatewayFlowActionList li").removeClass("current");
    $(it).addClass("current");
    for (var i = 0; i < data.length; i++) {
        if ($("#gatewayFlowActionList li.current").data("id") === data[i].id) {
            $("#gatewayFlowActionName").val(data[i].name);
            $("#gatewayFlowActionDesc").val(data[i].desc);

            if (data[i].type !== "End") {
                $('input[name="gatewayFlowActionType"][value="' + data[i].type + '"]').
                        prop("checked", "checked");
                if (data[i].type === "SelSend") {
                    $("#gatewayFlowActionSendRule").val("");
                    $("#gatewayFlowActionFilter").val(data[i].filter);
                    $("#gatewayFlowActionChooseType").val(data[i].chooseType);
                    $('input[name="gatewayFlowActionChooseNode"][value="' + data[i].chooseNode + '"]').
                            prop("checked", "checked");
                    $('input[name="gatewayFlowActionShowLevel"][value="' + data[i].showLevel + '"]').
                            prop("checked", "checked");
                    $('input[name="gatewayFlowActionType"]').parent().next().next().hide();
                    $('input[name="gatewayFlowActionType"]').parent().next().show();
                } else {
                    $("#gatewayFlowActionSendRule").val(data[i].filter);
                    $("#gatewayFlowActionFilter").val("");
                    $("#gatewayFlowActionChooseType").val("Single");
                    $('input[name="gatewayFlowActionChooseNode"][value="User"]').prop("checked", "checked");
                    $('input[name="gatewayFlowActionShowLevel"][value=""]').prop("checked", "checked");
                    $('input[name="gatewayFlowActionType"]').parent().next().next().show();
                    $('input[name="gatewayFlowActionType"]').parent().next().hide();
                }

                $("#gatewayFlowActionActivationMode").val(data[i].activationMode.type);
                if (data[i].activationMode.type === "Complex") {
                    $("#gatewayFlowActionRange").val(data[i].activationMode.range);
                    $("#gatewayFlowActionActivationMode").next().show();
                    $("#gatewayFlowActionActivationMode").css("margin-top", "0");

                    var gateways = data[i].activationMode.tasks,
                            values = "";

                    $("#gatewayFlowActionTaskPanel input").each(function() {
                        $(this).removeProp("checked");
                        $(this).parent().removeClass("current");
                        for (var j = 0; j < gateways.length; j++) {
                            if (gateways[j].toString() === $(this).data("id").toString()) {
                                values += $(this).next().text() + "、";
                                $(this).prop("checked", "checked");
                                $(this).parent().addClass("current");
                            }
                        }
                    });
                    $("#gatewayFlowActionTask").val(values.substr(0, values.length - 1)).
                            data("ids", gateways);
                    $("#gatewayFlowActionTaskPanel").hide();
                } else {
                    $("#gatewayFlowActionRange").val("Org");
                    $("#gatewayFlowActionActivationMode").next().hide();
                    $("#gatewayFlowActionActivationMode").css("margin-top", "9px");

                    $("#gatewayFlowActionTaskPanel input").each(function() {
                        $(this).removeProp("checked");
                        $(this).parent().removeClass("current");
                    });
                    $("#gatewayFlowActionTask").val("").data("ids", []);
                    $("#gatewayFlowActionTaskPanel").hide();
                }
                $("#gatewayFlowActionTargetStep").val(data[i].targetStep);

                $($("#gatewayFlowActionPanel tr").get(2)).show();
                $($("#gatewayFlowActionPanel tr").get(3)).show();
                $($("#gatewayFlowActionPanel tr").get(4)).show();
                $("#gatewayFlowActionAdvancePanel").show();
                eCooeModel.model.config.settings.gateway.flowAction.advance.setForm(data[i]);
                if (eCooeModel.model.config.settings.gateway.flowAction.extend &&
                        eCooeModel.model.config.settings.gateway.flowAction.extend.setForm) {
                    eCooeModel.model.config.settings.gateway.flowAction.extend.setForm(data[i]);
                }
            } else {
                $("#gatewayFlowActionPanel tr").get(2).style.display = "none";
                $("#gatewayFlowActionPanel tr").get(3).style.display = "none";
                $("#gatewayFlowActionPanel tr").get(4).style.display = "none";
                $("#gatewayFlowActionAdvancePanel").hide();
                break;
            }
        }
    }

};

/**
 * @description 初始化页面中的关联事件
 */
eCooeModel.model.config.settings.gateway.flowAction.base.init = function() {
    $("input[name=gatewayFlowActionType]").change(function() {
        if (this.value === "SelSend") {
            $(this).parent().next().next().hide();
            $(this).parent().next().show();
        } else {
            $(this).parent().next().next().show();
            $(this).parent().next().hide();
        }
    });

    $("#gatewayFlowActionActivationMode").change(function() {
        if (this.value === "Complex") {
            $(this).next().show();
            $(this).css("margin-top", "0");
        } else {
            $(this).next().hide();
            $(this).css("margin-top", "9px");
        }
    });

    $("#gatewayFlowActionRemove").click(function() {
        if ($("#gatewayFlowActionList li.current").length !== 1) {
            return;
        }

        var id = $("#gatewayFlowActionList li.current").data("sequenceid");
        var data = eCooeModel.model.config.settings.gateway.flowAction.base.tempData;
        for (var i = 0; i < data.length; i++) {
            if (data[i].sequenceId === id) {
                eCooeModel.model.config.settings.gateway.flowAction.base.removeIds.push(data[i].sequenceId);
                data.splice(i, 1);
                $("#gatewayFlowActionList li.current").remove();
                $("#gatewayFlowActionList li:first").addClass("first").click();
            }
        }
    });

    $("#gatewayFlowActionTop").click(function() {
        if ($("#gatewayFlowActionList li.current").length < 1 ||
                $("#gatewayFlowActionList li.current").hasClass("first") ||
                $("#gatewayFlowActionList li").length < 2) {
            return;
        }

        var currentId = $("#gatewayFlowActionList li.current").data("id");
        var data = eCooeModel.model.config.settings.gateway.flowAction.base.tempData;

        for (var i = 0; i < data.length; i++) {
            if (currentId === data[i].id) {
                var removeData = data.splice(i, 1)[0];
                data.splice(i - 1, 0, removeData);
                break;
            }
        }

        $("#gatewayFlowActionList li.current").prev().before($("#gatewayFlowActionList li.current"));

        $("#gatewayFlowActionList li").removeClass("first");
        $("#gatewayFlowActionList li:first").addClass("first");
    });

    $("#gatewayFlowActionDown").click(function() {
        if ($("#gatewayFlowActionList li.current").length < 1 ||
                $("#gatewayFlowActionList li:last").hasClass("current") ||
                $("#gatewayFlowActionList li").length < 2) {
            return;
        }

        var currentId = $("#gatewayFlowActionList li.current").data("id");
        var data = eCooeModel.model.config.settings.gateway.flowAction.base.tempData;

        for (var i = 0; i < data.length; i++) {
            if (currentId === data[i].id) {
                var removeData = data.splice(i, 1)[0];
                data.splice(i + 1, 0, removeData);
                break;
            }
        }

        $("#gatewayFlowActionList li.current").next().after($("#gatewayFlowActionList li.current"));

        $("#gatewayFlowActionList li").removeClass("first");
        $("#gatewayFlowActionList li:first").addClass("first");
    });
};