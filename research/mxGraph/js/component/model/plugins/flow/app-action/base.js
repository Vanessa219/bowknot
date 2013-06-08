/*
 * Copyright (c) 2013, Yunnan Yuan Xin technology Co., Ltd.
 *
 * All rights reserved.
 */
/**
 * @fileoverview 属性配置.
 *
 * @author <a href="mailto:LLY219@gmail.com">Liyuan Li</a>
 * @version 1.0.1.1, Jun 3, 2013
 */
/**
 * @description 获取数据
 */
eCooeModel.model.config.settings.flow.appAction.base.getData = function() {
    var data = eCooeModel.model.config.data.property.appCfgs = [];


    var removeIds = eCooeModel.model.config.settings.flow.appAction.base.removeIds,
            tasks = eCooeModel.model.config.data.tasks;

    for (var m = 0; m < tasks.length; m++) {
        // 如果当前环节包含此脚本，则移除
        var appActions = tasks[m].appActions;
        if (appActions) {
            for (var n = 0; n < appActions.length; n++) {
                for (var i = 0; i < removeIds.length; i++) {
                    if (appActions[n].refId === removeIds[i]) {
                        appActions.splice(n, 1);
                    }
                }
            }
        }
    }

    $("#flowBaseInfoAppActionTable tr:not(:first)").each(function(i) {
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
eCooeModel.model.config.settings.flow.appAction.base.setData = function() {
    eCooeModel.model.config.settings.flow.appAction.base.removeIds = [];
    var data = eCooeModel.model.config.data.property.appCfgs,
            trHTML = "";
    $("#flowBaseInfoAppActionTable tr:not(:first)").remove();

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
    $("#flowBaseInfoAppActionTable tr").last().after(trHTML);
};

/**
 * @description 初始化页面中的关联事件
 */
eCooeModel.model.config.settings.flow.appAction.base.init = function() {
    new EditList({
        "id": "flowBaseInfoAppAction",
        "actions": {
            "checkedAll": {},
            "remove": {
                "after": function(removeId) {
                    eCooeModel.model.config.settings.flow.appAction.base.removeIds.push(removeId);
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