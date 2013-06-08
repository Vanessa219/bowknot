/*
 * Copyright (c) 2013, Yunnan Yuan Xin technology Co., Ltd.
 *
 * All rights reserved.
 */
/**
 * @fileoverview 属性配置.
 *
 * @author <a href="mailto:LLY219@gmail.com">Liyuan Li</a>
 * @version 1.0.1.4, Jun 3, 2013
 */
/**
 * @description 根据数据设置界面中的值
 */
eCooeModel.model.config.settings.task.commentAction.advance.setData = function() {
    $("#taskCommentActionBefore, #taskCommentActionAfter").html(eCooeModel.model.config.getFlowScriptHTML());
    // 环节
    eCooeModel.model.config.genAllTask("taskCommentActionAdvanceTask");
    var data = eCooeModel.model.config.settings.task.commentAction.base.tempData[0];
    if (!data) {
        return;
    }
    var advanceTasks = data.representation.activityIds,
            advanecValues = "";
    $("#taskCommentActionAdvanceTaskPanel input").each(function() {
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
    $("#taskCommentActionAdvanceTask").val(advanecValues.substr(0, advanecValues.length - 1)).
            data("ids", data.representation.activityIds);
    $("#taskCommentActionBefore").val(data.appEvents.beforeScriptId);
    $("#taskCommentActionAfter").val(data.appEvents.afterScriptId);
};

/**
 * @description 根据数据设置界面中的值
 * @param {Obj} data 选中项中的数据
 */
eCooeModel.model.config.settings.task.commentAction.advance.setForm = function(data) {
    $("#taskCommentActionCondition").val(data.condition.expression);
    $("#taskCommentActionAdvanceRange").val(data.representation.range);
    $("#taskCommentActionBefore").val(data.appEvents.beforeScriptId);
    $("#taskCommentActionAfter").val(data.appEvents.afterScriptId);

    var advanceTasks = data.representation.activityIds,
            advanecValues = "";
    $("#taskCommentActionAdvanceTaskPanel input").each(function() {
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
    $("#taskCommentActionAdvanceTask").val(advanecValues.substr(0, advanecValues.length - 1)).data("ids", advanceTasks);
    $("#taskCommentActionAdvanceTaskPanel").hide();
};

/**
 * @description 获取设置界面中的值
 * @param {Obj} data 选中项中的数据
 */
eCooeModel.model.config.settings.task.commentAction.advance.getForm = function(data) {
    data.condition.expression = $("#taskCommentActionCondition").val();
    data.representation.range = $("#taskCommentActionAdvanceRange").val();
    data.appEvents.beforeScriptId = $("#taskCommentActionBefore").val();
    data.appEvents.afterScriptId = $("#taskCommentActionAfter").val();
    data.representation.activityIds = $("#taskCommentActionAdvanceTask").data("ids");
};