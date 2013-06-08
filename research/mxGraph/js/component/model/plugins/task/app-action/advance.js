/*
 * Copyright (c) 2013, Yunnan Yuan Xin technology Co., Ltd.
 *
 * All rights reserved.
 */
/**
 * @fileoverview 属性配置.
 *
 * @author <a href="mailto:LLY219@gmail.com">Liyuan Li</a>
 * @version 1.0.1.1, May 17, 2013
 */
/**
 * @description 根据数据设置界面中的值
 */
eCooeModel.model.config.settings.task.appAction.advance.setData = function() {
    $("#taskAppActionBefore, #taskAppActionAfter").html(eCooeModel.model.config.getFlowScriptHTML());
    // 环节
    eCooeModel.model.config.genAllTask("taskAppActionAdvanceTask");
};

/**
 * @description 根据数据设置界面中的值
 * @param {Obj} data 选中项中的数据
 */
eCooeModel.model.config.settings.task.appAction.advance.setForm = function(data) {
    $("#taskAppActionCondition").val(data.condition.expression);
    $("#taskAppActionAdvanceRange").val(data.representation.range);
    $("#taskAppActionBefore").val(data.appEvents.beforeScriptId);
    $("#taskAppActionAfter").val(data.appEvents.afterScriptId);

    var advanceTasks = data.representation.activityIds,
            advanecValues = "";
    $("#taskAppActionAdvanceTaskPanel input").each(function() {
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
    $("#taskAppActionAdvanceTask").val(advanecValues.substr(0, advanecValues.length - 1)).data("ids", advanceTasks);
    $("#taskAppActionAdvanceTaskPanel").hide();
};

/**
 * @description 获取设置界面中的值
 * @param {Obj} data 选中项中的数据
 */
eCooeModel.model.config.settings.task.appAction.advance.getForm = function(data) {
    data.condition.expression = $("#taskAppActionCondition").val();
    data.representation.range = $("#taskAppActionAdvanceRange").val();
    data.appEvents.beforeScriptId = $("#taskAppActionBefore").val();
    data.appEvents.afterScriptId = $("#taskAppActionAfter").val();
    data.representation.activityIds = $("#taskAppActionAdvanceTask").data("ids");
};