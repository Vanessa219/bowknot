/*
 * Copyright (c) 2013, Yunnan Yuan Xin technology Co., Ltd.
 *
 * All rights reserved.
 */
/**
 * @fileoverview 属性配置.
 *
 * @author <a href="mailto:LLY219@gmail.com">Liyuan Li</a>
 * @version 1.0.1.6, Jun 3, 2013
 */
/**
 * @description 获取数据
 */
eCooeModel.model.config.settings.task.commentAction.base.getData = function() {
    var data = eCooeModel.model.config.settings.task.commentAction.base.tempData;

    // 记录原值
    var currentId = $("#taskCommentActionList li.current").data("id");
    for (var i = 0; i < data.length; i++) {
        if (data[i].id === currentId) {
            data[i].showName = $("#taskCommentActionName").val();
            data[i].desc = $("#taskCommentActionDesc").val();
            data[i].columId = $("#taskCommentActionColumId").val();
            data[i].targetStep = $("#taskCommentActionStep").val();
            eCooeModel.model.config.settings.task.commentAction.advance.getForm(data[i]);
            if (eCooeModel.model.config.settings.task.commentAction.extend
                    && eCooeModel.model.config.settings.task.commentAction.extend.getForm) {
                eCooeModel.model.config.settings.task.commentAction.extend.getForm(data[i]);
            }
            break;
        }
    }
    eCooeModel.model.config.settings.task.data.cmtActions =
            eCooeModel.model.config.settings.task.commentAction.base.tempData;
};

/**
 * @description 根据数据设置界面中的值
 */
eCooeModel.model.config.settings.task.commentAction.base.setData = function() {
    if (!eCooeModel.model.config.data.property.cmtColumCfg.colums) {
        eCooeModel.model.config.data.property.cmtColumCfg.colums = [];
    }

    var colums = eCooeModel.model.config.data.property.cmtColumCfg.colums,
            columsHTML = "";
    for (var i = 0; i < colums.length; i++) {
        columsHTML += "<option value='" + colums[i].id + "'>" + colums[i].name + "</option>";
    }
    $("#taskCommentActionColumId").html(columsHTML);

    eCooeModel.model.config.settings.task.commentAction.base.tempData = [];
    $.extend(true, eCooeModel.model.config.settings.task.commentAction.base.tempData,
            eCooeModel.model.config.settings.task.data.cmtActions);

    $("#taskCommentActionName").val("");
    $("#taskCommentActionDesc").val("");
    var data = eCooeModel.model.config.settings.task.commentAction.base.tempData;
    if (data.length === 0) {
        $("#taskCommentActionPanel").hide();
        $("#taskCommentActionAdvancePanel").hide();
        $("#taskCommentActionList").html("");
        return;
    }

    $("#taskCommentActionPanel").show();
    $("#taskCommentActionAdvancePanel").show();

    var liHTML = "";
    for (var i = 0; i < data.length; i++) {
        var className = "class='fn-pointer' ";
        if (i === 0) {
            $("#taskCommentActionName").val(data[i].showName);
            $("#taskCommentActionDesc").val(data[i].desc);
            $("#taskCommentActionColumId").val(data[i].columId);
            $("#taskCommentActionStep").val(data[i].targetStep);
            eCooeModel.model.config.settings.task.commentAction.advance.setForm(data[i]);
            if (eCooeModel.model.config.settings.task.commentAction.extend &&
                    eCooeModel.model.config.settings.task.commentAction.extend.setForm) {
                eCooeModel.model.config.settings.task.commentAction.extend.setForm(data[i]);
            }
            className = "class='current first fn-pointer' ";
        }
        liHTML += "<li " + className +
                "onclick='eCooeModel.model.config.settings.task.commentAction.base.changeForm(\"" +
                data[i].id + "\", this)' data-id='" + data[i].id + "'>" + data[i].showName + "</li>";
    }
    $("#taskCommentActionList").html(liHTML);
};

/**
 * @description 获取目标步骤
 */
eCooeModel.model.config.settings.task.commentAction.base.getTarget = function() {
    var targetHTML = "<option value=''></option>";
    $("#taskStepConfigList li").each(function() {
        targetHTML += "<option value='" + $(this).data("id") + "'>" + $(this).text() + "</option>";
    });
    $("#taskCommentActionStep").html(targetHTML);

    var data = eCooeModel.model.config.settings.task.commentAction.base.tempData;
    for (var i = 0; i < data.length; i++) {
        var currentId = $("#taskCommentActionList li.current").data("id");
        if (currentId === data[i].id) {
            $("#taskCommentActionStep").val(data[i].targetStep);
        }
    }
};

/**
 * @description 初始化页面中的关联事件
 */
eCooeModel.model.config.settings.task.commentAction.base.init = function() {
    eCooeModel.model.config.settings.task.commentAction.base.tempData = [];

    $("#taskCommentActionAdd").click(function() {
        // 添加
        var columId = "";
        if ($("#taskCommentActionColumId option").length > 0) {
            columId = $("#taskCommentActionColumId option").get(0).value;
        }
        var newObj = {
            "id": UUIDjs.create(),
            "columId": columId,
            "showName": "新增操作",
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
        };
        eCooeModel.model.config.settings.task.commentAction.base.tempData.push(newObj);

        // 记录原值
        if (eCooeModel.model.config.settings.task.commentAction.base.tempData.length > 1) {
            var lastId = $("#taskCommentActionList li.current").data("id");
            for (var i = 0; i < eCooeModel.model.config.settings.task.commentAction.base.tempData.length; i++) {
                var temp = eCooeModel.model.config.settings.task.commentAction.base.tempData[i];
                if (temp.id === lastId) {
                    temp.showName = $("#taskCommentActionName").val();
                    temp.desc = $("#taskCommentActionDesc").val();
                    temp.columId = $("#taskCommentActionColumId").val();
                    temp.targetStep = $("#taskCommentActionStep").val();
                    eCooeModel.model.config.settings.task.commentAction.advance.getForm(temp);
                    if (eCooeModel.model.config.settings.task.commentAction.extend
                            && eCooeModel.model.config.settings.task.commentAction.extend.getForm) {
                        eCooeModel.model.config.settings.task.commentAction.extend.getForm(temp);
                    }
                    break;
                }
            }

            // 修改侧边值
            $("#taskCommentActionList li.current").text($("#taskCommentActionName").val());
        }

        // 设置默认
        $("#taskCommentActionName").val(newObj.showName);
        $("#taskCommentActionDesc").val("");
        $("#taskCommentActionStep").val("");
        $($("#taskCommentActionColumId option").get(0)).prop("selected", true);
        $("#taskCommentActionPanel").show();
        $("#taskCommentActionAdvancePanel").show();
        eCooeModel.model.config.settings.task.commentAction.advance.setForm(newObj);
        if (eCooeModel.model.config.settings.task.commentAction.extend
                && eCooeModel.model.config.settings.task.commentAction.extend.setForm) {
            eCooeModel.model.config.settings.task.commentAction.extend.setForm(newObj);
        }

        // 添加侧边栏
        if (eCooeModel.model.config.settings.task.commentAction.base.tempData.length === 1) {
            $("#taskCommentActionList").html("<li " +
                    "onclick='eCooeModel.model.config.settings.task.commentAction.base.changeForm(\"" +
                    newObj.id + "\", this)' class='first current fn-pointer' data-id='" + newObj.id + "'>" +
                    newObj.showName + "</li>");
        } else {
            $("#taskCommentActionList li").removeClass("current");
            $("#taskCommentActionList li:last").after("<li " +
                    "onclick='eCooeModel.model.config.settings.task.commentAction.base.changeForm(\"" +
                    newObj.id + "\", this)' class='current fn-pointer' data-id='" + newObj.id + "'>" +
                    newObj.showName + "</li>");
        }
    });

    $("#taskCommentActionRemove").click(function() {
        var currentId = $("#taskCommentActionList li.current").data("id");
        var data = eCooeModel.model.config.settings.task.commentAction.base.tempData;

        for (var i = 0; i < data.length; i++) {
            if (currentId === data[i].id) {
                data.splice(i, 1);
                $("#taskCommentActionList li.current").remove();
            }
        }

        if (data.length === 0) {
            $("#taskCommentActionPanel").hide();
        } else {
            data[0].isDefault = true;
            $("#taskCommentActionList li:first").click().addClass("first");
        }
    });

    $("#taskCommentActionTop").click(function() {
        if ($("#taskCommentActionList li.current").length < 1 ||
                $("#taskCommentActionList li.current").hasClass("first") ||
                $("#taskCommentActionList li").length < 2) {
            return;
        }

        var currentId = $("#taskCommentActionList li.current").data("id");
        var data = eCooeModel.model.config.settings.task.commentAction.base.tempData;

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

        $("#taskCommentActionList li.current").prev().before($("#taskCommentActionList li.current"));

        $("#taskCommentActionList li").removeClass("first");
        $("#taskCommentActionList li:first").addClass("first");
    });

    $("#taskCommentActionDown").click(function() {
        if ($("#taskCommentActionList li.current").length < 1 ||
                $("#taskCommentActionList li:last").hasClass("current") ||
                $("#taskCommentActionList li").length < 2) {
            return;
        }

        var currentId = $("#taskCommentActionList li.current").data("id");
        var data = eCooeModel.model.config.settings.task.commentAction.base.tempData;

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

        $("#taskCommentActionList li.current").next().after($("#taskCommentActionList li.current"));

        $("#taskCommentActionList li").removeClass("first");
        $("#taskCommentActionList li:first").addClass("first");
    });
};

/**
 * @description 点击侧边栏触发的事件
 * @param {String} id 意见操作唯一标识
 * @param {BOM} it 事件源
 */
eCooeModel.model.config.settings.task.commentAction.base.changeForm = function(id, it) {
    if ($(it).hasClass("current")) {
        return;
    }

    // 修改侧边值
    $("#taskCommentActionList li.current").text($("#taskCommentActionName").val());

    var data = eCooeModel.model.config.settings.task.commentAction.base.tempData;

    // 记录原值
    var lastId = $("#taskCommentActionList li.current").data("id");
    for (var i = 0; i < data.length; i++) {
        if (data[i].id === lastId) {
            data[i].showName = $("#taskCommentActionName").val();
            data[i].desc = $("#taskCommentActionDesc").val();
            data[i].columId = $("#taskCommentActionColumId").val();
            data[i].targetStep = $("#taskCommentActionStep").val();

            eCooeModel.model.config.settings.task.commentAction.advance.getForm(data[i]);
            if (eCooeModel.model.config.settings.task.commentAction.extend
                    && eCooeModel.model.config.settings.task.commentAction.extend.getForm) {
                eCooeModel.model.config.settings.task.commentAction.extend.getForm(data[i]);
            }
            break;
        }
    }
    $("#taskCommentActionList li").removeClass("current");

    // 设置
    $(it).addClass("current");
    for (var i = 0; i < data.length; i++) {
        if (id === data[i].id) {
            $("#taskCommentActionName").val(data[i].showName);
            $("#taskCommentActionDesc").val(data[i].desc);
            $("#taskCommentActionColumId").val(data[i].columId);
            $("#taskCommentActionStep").val(data[i].targetStep);

            eCooeModel.model.config.settings.task.commentAction.advance.setForm(data[i]);
            if (eCooeModel.model.config.settings.task.commentAction.extend
                    && eCooeModel.model.config.settings.task.commentAction.extend.setForm) {
                eCooeModel.model.config.settings.task.commentAction.extend.setForm(data[i]);
            }
            break;
        }
    }
};