/*
 * Copyright (c) 2013, Yunnan Yuan Xin technology Co., Ltd.
 *
 * All rights reserved.
 */
/**
 * @fileoverview 属性配置.
 *
 * @author <a href="mailto:LLY219@gmail.com">Liyuan Li</a>
 * @version 1.0.0.5, Jun 3, 2013
 */
/**
 * @description 获取数据
 */
eCooeModel.model.config.settings.flow.comments.base.getData = function() {
    var data = eCooeModel.model.config.data.property.cmtColumCfg.colums = [];
    $("#flowCommentsBaseTable tr:not(:first)").each(function() {
        var obj = {};
        obj.id = $(this).data("id");
        obj.sort = parseInt($(this).find("td").get(1).innerHTML);
        obj.name = $($(this).find("td").get(2)).find("input").val();
        obj.desc = $($(this).find("td").get(3)).find("input").val();
        if ($(this).data("group")) {
            obj.group = $(this).data("group");
        } else {
            obj.group = {
                "grouped": false,
                "topLevel": "OU1",
                "bottomLevel": "OU3",
                "sort": "onCommentTime"
            };
        }

        data.push(obj);
    });
};

/**
 * @description 根据数据设置界面中的值
 */
eCooeModel.model.config.settings.flow.comments.base.setData = function() {
    if (!eCooeModel.model.config.data.property.cmtColumCfg.colums) {
        return;
    }

    var data = eCooeModel.model.config.data.property.cmtColumCfg.colums,
            trHTML = "";
    $("#flowCommentsBaseTable tr:not(:first)").remove();

    for (var i = 0; i < data.length; i++) {
        trHTML += "<tr data-id='" + data[i].id + "'>" +
                "<td><input type='checkbox'/></td>" +
                "<td>" + data[i].sort + "</td>" +
                "<td><input type='text' value='" + data[i].name + "'/></td>" +
                "<td><input type='text' value='" + data[i].desc + "'/></td>" +
                "</tr>";
    }
    $("#flowCommentsBaseTable tr").last().after(trHTML);

    $("#flowCommentsBaseTable tr:not(:first)").each(function(i) {
        $(this).data("group", data[i].group);
    });
};

/**
 * @description 初始化页面中的关联事件
 */
eCooeModel.model.config.settings.flow.comments.base.init = function() {
    if (!eCooeModel.model.config.data.property.cmtColumCfg) {
        eCooeModel.model.config.data.property.cmtColumCfg = {
            id: UUIDjs.create()
        };
    }

    new EditList({
        "id": "flowCommentsBase",
        "actions": {
            "checkedAll": {},
            "remove": {
                "before": function(removeId) {
                    var tasks = eCooeModel.model.config.data.tasks;

                    for (var m = 0; m < tasks.length; m++) {
                        var cmtActions = tasks[m].cmtActions;
                        for (var i = 0; i < cmtActions.length; i++) {
                            if (cmtActions[i].columId === removeId) {
                                alert("所选意见栏已被使用，禁止删除");
                                return false;
                            }
                        }
                    }
                    return true;
                }
            },
            "add": {
                "col": [{
                        "type": "text"
                    }, {
                        "type": "text"
                    }]
            }
        }
    });

    var dialog = new Dialog({
        id: "configGroupDialog",
        height: 170,
        width: 350,
        saveFnt: function() {
            $("#flowCommentsBaseTable tr:not(:first)").each(function() {
                if ($(this).data("id") === $("#configGroupDialog").data("id")) {
                    $(this).data("group", {
                        "grouped": ($('input[name="flowCommentsBaseGrouped"]:checked').val() === 
                                "false" ? false : true),
                        "topLevel": $("#flowCommentsBaseTopLevel").val(),
                        "bottomLevel": $("#flowCommentsBaseBottomLevel").val(),
                        "sort": $("#flowCommentsBaseSort").val()
                    });
                }
            });
        }
    });

    $("#flowCommentsBaseGroup").click(function() {
        var ids = [];
        $("#flowCommentsBaseTable td input[type='checkbox']").each(function() {
            if ($(this).prop("checked")) {
                ids.push($(this).parent().parent());
            }
        });

        if (ids.length === 1) {
            $("#configGroupDialog").data("id", ids[0].data("id"));
            dialog.open(function() {
                var group = ids[0].data("group");
                if (group) {
                    $("#flowCommentsBaseTopLevel").val(group.topLevel);
                    $("#flowCommentsBaseBottomLevel").val(group.bottomLevel);
                    $("#flowCommentsBaseSort").val(group.sort);
                    if (group.grouped) {
                        $('input[name="flowCommentsBaseGrouped"][value="true"]').prop("checked", true);
                        $("#flowCommentsBaseTopLevel").removeProp("disabled");
                        $("#flowCommentsBaseBottomLevel").removeProp("disabled");
                        $("#flowCommentsBaseSort").removeProp("disabled");
                    } else {
                        $('input[name="flowCommentsBaseGrouped"][value="false"]').prop("checked", true);
                        $("#flowCommentsBaseTopLevel").prop("disabled", "disabled");
                        $("#flowCommentsBaseBottomLevel").prop("disabled", "disabled");
                        $("#flowCommentsBaseSort").prop("disabled", "disabled");
                    }
                } else {
                    $('input[name="flowCommentsBaseGrouped"][value="false"]').prop("checked", true);
                    $("#flowCommentsBaseTopLevel").prop("disabled", "disabled").val("OU1");
                    $("#flowCommentsBaseBottomLevel").prop("disabled", "disabled").val("OU1");
                    $("#flowCommentsBaseSort").prop("disabled", "disabled").val("onCommentTime");
                }
            });
        } else {
            alert("请选择一条信息");
        }
    });

    $("input[name='flowCommentsBaseGrouped']").change(function() {
        if (this.value === "true") {
            $("#flowCommentsBaseTopLevel").removeProp("disabled");
            $("#flowCommentsBaseBottomLevel").removeProp("disabled");
            $("#flowCommentsBaseSort").removeProp("disabled");
        } else {
            $("#flowCommentsBaseTopLevel").prop("disabled", "disabled");
            $("#flowCommentsBaseBottomLevel").prop("disabled", "disabled");
            $("#flowCommentsBaseSort").prop("disabled", "disabled");
        }
    });
};