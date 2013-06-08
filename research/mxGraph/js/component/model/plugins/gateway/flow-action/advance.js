/*
 * Copyright (c) 2013, Yunnan Yuan Xin technology Co., Ltd.
 *
 * All rights reserved.
 */
/**
 * @fileoverview 属性配置.
 *
 * @author <a href="mailto:LLY219@gmail.com">Liyuan Li</a>
 * @version 1.0.0.2, May 30, 2013
 */
/**
 * @description 根据数据设置界面中的值
 */
eCooeModel.model.config.settings.gateway.flowAction.advance.setData = function() {
    $("#gatewayFlowActionBefore, #gatewayFlowActionAfter").html(eCooeModel.model.config.getFlowScriptHTML());
    eCooeModel.model.config.genAllTask("gatewayFlowActionAdvanceTask");
    
    
    var data = eCooeModel.model.config.settings.gateway.flowAction.base.tempData[0];
    if (!data || data.type === "End" || !data.name) {
        return;
    }
    var advanceTasks = (data.representation ? data.representation.activityIds : []),
            advanecValues = "";
    $("#gatewayFlowActionAdvanceTaskPanel input").each(function() {
        $(this).removeProp("checked");
        $(this).parent().removeClass("current");
        for (var j = 0; j < advanceTasks.length; j++) {
            if (advanceTasks[j].toString() === $(this).data("id").toString()) {
                advanecValues += $(this).next().text() + "、";
                $(this).prop("checked", "checked");
                $(this).parent().addClass("current");
            }
        }
    });
    $("#gatewayFlowActionAdvanceTask").val(advanecValues.substr(0, advanecValues.length - 1)).data("ids", data.representation ? data.representation.activityIds : []);
    $("#gatewayFlowActionBefore").val(data.appEvents.beforeScriptId);
    $("#gatewayFlowActionAfter").val(data.appEvents.afterScriptId);
};

/**
 * @description 根据数据设置界面中的值
 * @param {Obj} data 选中项中的数据
 */
eCooeModel.model.config.settings.gateway.flowAction.advance.setForm = function(data) {
    $("#gatewayFlowActionCondition").val(data.condition.expression);
    $("#gatewayFlowActionAdvanceRange").val(data.representation ? data.representation.range : "");
    $("#gatewayFlowActionBefore").val(data.appEvents.beforeScriptId);
    $("#gatewayFlowActionAfter").val(data.appEvents.afterScriptId);

    var advanceTasks = data.representation ? data.representation.activityIds : [],
    advanecValues = "";
    $("#gatewayFlowActionAdvanceTaskPanel input").each(function() {
        $(this).removeProp("checked");
        $(this).parent().removeClass("current");
        for (var j = 0; j < advanceTasks.length; j++) {
            if (advanceTasks[j].toString() === $(this).data("id").toString()) {
                advanecValues += $(this).next().text() + "、";
                $(this).prop("checked", "checked");
                $(this).parent().addClass("current");
            }
        }
    });
    $("#gatewayFlowActionAdvanceTask").val(advanecValues.substr(0, advanecValues.length - 1)).data("ids", advanceTasks);
    $("#gatewayFlowActionAdvanceTaskPanel").hide();
};

/**
 * @description 获取设置界面中的值
 * @param {Obj} data 选中项中的数据
 */
eCooeModel.model.config.settings.gateway.flowAction.advance.getForm = function(data) {
    data.condition.expression = $("#gatewayFlowActionCondition").val();
    data.representation = {
        "range": $("#gatewayFlowActionAdvanceRange").val(),
        "activityIds": $("#gatewayFlowActionAdvanceTask").data("ids")
    };
    data.appEvents.beforeScriptId = $("#gatewayFlowActionBefore").val();
    data.appEvents.afterScriptId = $("#gatewayFlowActionAfter").val();
};