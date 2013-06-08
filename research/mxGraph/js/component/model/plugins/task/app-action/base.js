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
 * @description 获取数据
 */
eCooeModel.model.config.settings.task.appAction.base.getData = function() {
    var data = eCooeModel.model.config.settings.task.appAction.base.tempData;

    // 记录原值
    var currentId = $("#taskAppActionList li.current").data("id");
    for (var i = 0; i < data.length; i++) {
        if (data[i].id === currentId) {
            data[i].showName = $("#taskAppActionShowName").val();
            data[i].desc = $("#taskAppActionDesc").val();
            data[i].targetStep = $("#taskAppActionTargetStep").val();
            data[i].refId = $("#taskAppActionList li.current").data("refid");
            eCooeModel.model.config.settings.task.appAction.advance.getForm(data[i]);
            if (eCooeModel.model.config.settings.task.appAction.extend
                    && eCooeModel.model.config.settings.task.appAction.extend.getForm) {
                eCooeModel.model.config.settings.task.appAction.extend.getForm(data[i]);
            }
            break;
        }
    }

    eCooeModel.model.config.settings.task.data.appActions = [];
    $("#taskAppActionList input:checked").each(function() {
        for (var j = 0; j < data.length; j++) {
            if (data[j].id === $(this).parent().data("id")) {
                eCooeModel.model.config.settings.task.data.appActions.push(data[j]);
            }
        }
    });

};

/**
 * @description 根据数据设置界面中的值
 */
eCooeModel.model.config.settings.task.appAction.base.setData = function() {
    eCooeModel.model.config.settings.task.appAction.base.tempData = [];
    $.extend(true, eCooeModel.model.config.settings.task.appAction.base.tempData, 
    eCooeModel.model.config.settings.task.data.appActions);

    var data = eCooeModel.model.config.settings.task.appAction.base.tempData,
            appCfgs = eCooeModel.model.config.data.property.appCfgs,
            listHTML = "";
    for (var i = 0; i < appCfgs.length; i++) {
        var checked = "",
                first = "",
                dataId = UUIDjs.create(),
                disabledClass = "class='disabled' ";

        for (var k = 0; k < data.length; k++) {
            if (appCfgs[i].id === data[k].refId) {
                checked = "checked='checked' ";
                dataId = data[k].id;
                disabledClass = "class='fn-pointer' ";
            }
        }

        if (i === 0) {
            first = "class='first fn-pointer' ";
        }

        listHTML += "<li " + first + "data-refid='" + appCfgs[i].id + "' data-id='" + 
                dataId + "'><input " + checked + "type='checkbox'>" +
                "<span " + disabledClass + 
                "onclick=\"eCooeModel.model.config.settings.task.appAction.base.changeForm(this)\">" + 
                appCfgs[i].name + "</span></li>";
    }

    $("#taskAppActionList").html(listHTML);

    $("#taskAppActionList input").click(function() {
        if ($(this).prop("checked")) {
            $(this).next().removeClass("disabled");

            var isExist = false;
            for (var j = 0; j < data.length; j++) {
                if ($(this).parent().data("id") === data[j].id) {
                    isExist === true;
                    break;
                }
            }
            if (!isExist) {
                data.push({
                    "id": $(this).parent().data("id"),
                    "refId": $(this).parent().data("refid"),
                    "showName": "",
                    "desc": "",
                    "targetStep": "",
                    "condition": {
                        "expression": ""
                    },
                    "appEvents": {
                        "beforeScriptId": "",
                        "afterScriptId": ""
                    },
                    "representation": {
                        "range": "",
                        "activityIds": []
                    }
                });
            }
        } else {
            if ($(this).parent().hasClass("current")) {
                $("#taskAppActionPanel").hide();
                $("#taskAppActionAdvancePanel").hide();
                $(this).parent().removeClass("current");
            }

            $(this).next().addClass("disabled");
        }
    });
    $("#taskAppActionPanel").hide();
    $("#taskAppActionAdvancePanel").hide();
};

/**
 * @description 获取目标步骤
 */
eCooeModel.model.config.settings.task.appAction.base.getTarget = function() {
    var targetHTML = "<option value=''></option>";
    $("#taskStepConfigList li").each(function() {
        targetHTML += "<option value='" + $(this).data("id") + "'>" + $(this).text() + "</option>";
    });
    $("#taskAppActionTargetStep").html(targetHTML);

    var data = eCooeModel.model.config.settings.task.appAction.base.tempData;
    for (var i = 0; i < data.length; i++) {
        var currentId = $("#taskAppActionList li.current").data("id");
        if (currentId === data[i].id) {
            $("#taskAppActionTargetStep").val(data[i].targetStep);
        }
    }
};

/**
 * @description 点击侧边栏触发的事件
 * @param {BOM} it 事件源
 */
eCooeModel.model.config.settings.task.appAction.base.changeForm = function(it) {
    if ($(it).parent().hasClass("current") || $(it).hasClass("disabled")) {
        return;
    }
    $("#taskAppActionPanel").show();
    $("#taskAppActionAdvancePanel").show();

    // 修改侧边值
    var data = eCooeModel.model.config.settings.task.appAction.base.tempData;

    // 记录原值
    var lastId = $("#taskAppActionList li.current").data("id");
    for (var i = 0; i < data.length; i++) {
        if (data[i].id === lastId) {
            data[i].showName = $("#taskAppActionShowName").val();
            data[i].desc = $("#taskAppActionDesc").val();
            data[i].targetStep = $("#taskAppActionTargetStep").val();
            data[i].refId = $("#taskAppActionList li.current").data("refid");
            eCooeModel.model.config.settings.task.appAction.advance.getForm(data[i]);
            if (eCooeModel.model.config.settings.task.appAction.extend
                    && eCooeModel.model.config.settings.task.appAction.extend.getForm) {
                eCooeModel.model.config.settings.task.appAction.extend.getForm(data[i]);
            }
            break;
        }
    }
    $("#taskAppActionList li").removeClass("current");

    // 设置
    $(it).parent().addClass("current");
    for (var i = 0; i < data.length; i++) {
        if ($("#taskAppActionList li.current").data("id") === data[i].id) {
            $("#taskAppActionShowName").val(data[i].showName);
            $("#taskAppActionDesc").val(data[i].desc);
            $("#taskAppActionName").val($(it).text());
            $("#taskAppActionTargetStep").val(data[i].targetStep);
            eCooeModel.model.config.settings.task.appAction.advance.setForm(data[i]);
             if (eCooeModel.model.config.settings.task.appAction.extend
                    && eCooeModel.model.config.settings.task.appAction.extend.setForm) {
                eCooeModel.model.config.settings.task.appAction.extend.setForm(data[i]);
            }
            break;
        }
    }
};

/**
 * @description 页面缓存值
 */
eCooeModel.model.config.settings.task.appAction.base.tempData = [];