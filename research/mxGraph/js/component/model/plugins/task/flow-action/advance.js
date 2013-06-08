/*
 * Copyright (c) 2013, Yunnan Yuan Xin technology Co., Ltd.
 *
 * All rights reserved.
 */
/**
 * @fileoverview 属性配置.
 *
 * @author <a href="mailto:LLY219@gmail.com">Liyuan Li</a>
 * @version 1.0.1.7, Jun 3, 2013
 */
/**
 * @description 根据数据设置界面中的值
 */
eCooeModel.model.config.settings.task.flowAction.advance.setData = function() {
    $("#taskFlowActionBefore, #taskFlowActionAfter").html(eCooeModel.model.config.getFlowScriptHTML());
    eCooeModel.model.config.genAllTask("taskFlowActionAdvanceTask");
    var data = eCooeModel.model.config.settings.task.flowAction.base.tempData[0];
    if (!data || data.type === "End") {
        return;
    }
    var advanceTasks = (data.representation ? data.representation.activityIds : []),
            advanecValues = "";
    $("#taskFlowActionAdvanceTaskPanel input").each(function() {
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
    $("#taskFlowActionAdvanceTask").val(advanecValues.substr(0, advanecValues.length - 1)).
            data("ids", data.representation ? data.representation.activityIds : []);
    $("#taskFlowActionBefore").val(data.appEvents.beforeScriptId);
    $("#taskFlowActionAfter").val(data.appEvents.afterScriptId);
};

/**
 * @description 根据数据设置界面中的值
 * @param {Obj} data 选中项中的数据
 */
eCooeModel.model.config.settings.task.flowAction.advance.setForm = function(data) {
    $("#taskFlowActionCondition").val(data.condition.expression);
    $("#taskFlowActionAdvanceRange").val(data.representation ? data.representation.range : "");
    $("#taskFlowActionBefore").val(data.appEvents.beforeScriptId);
    $("#taskFlowActionAfter").val(data.appEvents.afterScriptId);

    var advanceTasks = data.representation ? data.representation.activityIds : [],
    advanecValues = "";
    $("#taskFlowActionAdvanceTaskPanel input").each(function() {
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
    $("#taskFlowActionAdvanceTask").val(advanecValues.substr(0, advanecValues.length - 1)).data("ids", advanceTasks);
    $("#taskFlowActionAdvanceTaskPanel").hide();
};

/**
 * @description 获取设置界面中的值
 * @param {Obj} data 选中项中的数据
 */
eCooeModel.model.config.settings.task.flowAction.advance.getForm = function(data) {
    data.condition.expression = $("#taskFlowActionCondition").val();
    data.representation = {
        "range": $("#taskFlowActionAdvanceRange").val(),
        "activityIds": $("#taskFlowActionAdvanceTask").data("ids")
    };
    data.appEvents.beforeScriptId = $("#taskFlowActionBefore").val();
    data.appEvents.afterScriptId = $("#taskFlowActionAfter").val();
};