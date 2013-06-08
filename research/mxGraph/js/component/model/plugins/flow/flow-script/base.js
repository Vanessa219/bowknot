/*
 * Copyright (c) 2013, Yunnan Yuan Xin technology Co., Ltd.
 *
 * All rights reserved.
 */
/**
 * @fileoverview 属性配置.
 *
 * @author <a href="mailto:LLY219@gmail.com">Liyuan Li</a>
 * @version 1.0.0.9, Jun 3, 2013
 */
/**
 * @description 获取数据
 */
eCooeModel.model.config.settings.flow.flowScript.base.getData = function() {
    var data = eCooeModel.model.config.data.property.flowScriptCfgs = [];

    var removeIds = eCooeModel.model.config.settings.flow.flowScript.base.removeIds,
            tasks = eCooeModel.model.config.data.tasks;

    for (var m = 0; m < tasks.length; m++) {
        // 如果当前环节包含此脚本，则移除
        var flowActions = tasks[m].flowActions;
        if (flowActions) {
            for (var n = 0; n < flowActions.length; n++) {
                if (flowActions[n].appEvents) {
                    for (var i = 0; i < removeIds.length; i++) {
                        if (flowActions[n].appEvents.afterScriptId === removeIds[i]) {
                            flowActions[n].appEvents.afterScriptId = "";
                        }
                        if (flowActions[n].appEvents.beforeScriptId === removeIds[i]) {
                            flowActions[n].appEvents.beforeScriptId = "";
                        }
                    }
                }
            }
        }

        var appActions = tasks[m].appActions;
        if (appActions) {
            for (var n = 0; n < appActions.length; n++) {
                if (appActions[n].appEvents) {
                    for (var i = 0; i < removeIds.length; i++) {
                        if (appActions[n].appEvents.afterScriptId === removeIds[i]) {
                            appActions[n].appEvents.afterScriptId = "";
                        }
                        if (appActions[n].appEvents.beforeScriptId === removeIds[i]) {
                            appActions[n].appEvents.beforeScriptId = "";
                        }
                    }
                }
            }
        }

        var cmtActions = tasks[m].cmtActions;
        if (cmtActions) {
            for (var n = 0; n < cmtActions.length; n++) {
                if (cmtActions[n].appEvents) {
                    for (var i = 0; i < removeIds.length; i++) {
                        if (cmtActions[n].appEvents.afterScriptId === removeIds[i]) {
                            cmtActions[n].appEvents.afterScriptId = "";
                        }
                        if (cmtActions[n].appEvents.beforeScriptId === removeIds[i]) {
                            cmtActions[n].appEvents.beforeScriptId = "";
                        }
                    }
                }
            }
        }
    }


    $("#flowFlowScriptTable tr:not(:first)").each(function(i) {
        var obj = {};
        obj.id = $(this).data("id");
        obj.sort = parseInt($(this).find("td").get(1).innerHTML);
        obj.name = $($(this).find("td").get(2)).find("input").val();
        obj.clientId = $($(this).find("td").get(3)).find("input").val();
        obj.param = $($(this).find("td").get(4)).find("input").val();
        obj.desc = $($(this).find("td").get(5)).find("input").val();
        data.push(obj);
    });
};

/**
 * @description 根据数据设置界面中的值
 */
eCooeModel.model.config.settings.flow.flowScript.base.setData = function() {
    eCooeModel.model.config.settings.flow.flowScript.base.removeIds = [];
    if (!eCooeModel.model.config.data.property.flowScriptCfgs) {
        eCooeModel.model.config.data.property.flowScriptCfgs = [];
    }
    var data = eCooeModel.model.config.data.property.flowScriptCfgs,
            trHTML = "";
    $("#flowFlowScriptTable tr:not(:first)").remove();
    for (var i = 0; i < data.length; i++) {
        trHTML += "<tr data-id='" + data[i].id + "'>" +
                "<td><input type='checkbox'/></td>" +
                "<td>" + data[i].sort + "</td>" +
                "<td><input type='text' value='" + data[i].name + "'/></td>" +
                "<td><input type='text' value='" + data[i].clientId + "'/></td>" +
                "<td><input type='text' value='" + data[i].param + "'/></td>" +
                "<td><input type='text' value='" + data[i].desc + "'/></td>" +
                "</tr>";
    }
    $("#flowFlowScriptTable tr").last().after(trHTML);
};
/**
 * @description 初始化页面中的关联事件
 */
eCooeModel.model.config.settings.flow.flowScript.base.init = function() {
    new EditList({
        "id": "flowFlowScript",
        "actions": {
            "checkedAll": {},
            "remove": {
                "after": function(removeId) {
                    eCooeModel.model.config.settings.flow.flowScript.base.removeIds.push(removeId);
                }
            },
            "up": {},
            "down": {},
            "add": {
                "col": [{
                        "type": "text"
                    }, {
                        "type": "text"
                    }, {
                        "type": "text"
                    }, {
                        "type": "text"
                    }]
            }
        }
    });
};