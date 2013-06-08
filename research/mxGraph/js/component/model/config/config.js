/*
 * Copyright (c) 2013, Yunnan Yuan Xin technology Co., Ltd.
 *
 * All rights reserved.
 */
/**
 * @fileoverview 属性配置.
 *
 * @author <a href="mailto:LLY219@gmail.com">Liyuan Li</a>
 * @version 1.0.2.2, Jun 3, 2013
 */

/**
 * @description 属性配置
 * @static
 */
eCooeModel.model.config = {
    /**
     * @description 设置值
     * @param {String} type 回填值所在的 dialog 类型
     * @param {Obj} [cell] 该节点图形结构
     */
    setData: function(type, cell) {
        var tabs = this.settings[type];
        for (var tabsKey in tabs) {
            if (tabsKey !== "data") {
                var tab = tabs[tabsKey];
                for (var tabKey in tab) {
                    if (tab[tabKey].setData) {
                        tab[tabKey].setData(cell);
                    }
                }
            }
        }
    },
    /**
     * @description 获取值
     * @param {String} type 回填值所在的 dialog 类型
     */
    getData: function(type) {
        var tabs = this.settings[type];
        for (var tabsKey in tabs) {
            if (tabsKey !== "data") {
                var tab = tabs[tabsKey];
                for (var tabKey in tab) {
                    if (tab[tabKey].getData) {
                        tab[tabKey].getData();
                    }
                }
            }
        }
    },
    /**
     * @description 初始化对象
     */
    initObject: function() {
        this.data = eCooeModel.model.data.configData;
        this.settings = eCooeModel.model.data.pluginsStr.plugins;
        this.settings.lane = {};
        this.settings.sequence = {};
    },
    /**
     * @description 初始化 tab
     * @param {String} id 每个 tab 的唯一标识
     */
    initTab: function(id) {
        var $tabsHeader = $("#" + id + " .tab-header li"),
                $tabsContent = $("#" + id + " .tab-content > div");
        $tabsHeader.click(function() {
            if (this.className !== "current") {
                var $it = $(this);
                $tabsHeader.removeClass("current");
                $it.addClass("current");

                $tabsContent.hide();
                $tabsContent.get($it.data("index")).style.display = "block";

                if ($it.data("index") === $tabsHeader.length - 1) {
                    $it.css("border-right", "1px solid #A8AAAC");
                } else {
                    $tabsHeader.last().css("border-right-width", "0");
                }


                // 如果为 task， 切换 tab 为步骤配置时，需同步步骤操作
                if (id === "taskDialog") {
                    if ($it.data("index") === 4) {
                        eCooeModel.model.config.settings.task.commentAction.base.getTarget();
                    }

                    if ($it.data("index") === 5) {
                        eCooeModel.model.config.settings.task.stepConfig.base.getStep();
                    }

                    if ($it.data("index") === 3) {
                        eCooeModel.model.config.settings.task.appAction.base.getTarget();
                    }
                }
            }
        });
    },
    /**
     * @description 展开收拢事件绑定
     */
    initCollapsed: function() {
        $("#sequenceDialog .add-ico, #taskDialog .add-ico, #flowDialog .add-ico").click(function() {
            if (this.className === "add-ico") {
                $(this).parent().find("table").hide();
                this.className = "plus-ico";
            } else {
                $(this).parent().find("table").show();
                this.className = "add-ico";
            }
        });
    },
    /**
     * @description 加载插件初始化脚本
     * @param {String} type 回填值所在的 dialog 类型
     */
    initScript: function(type) {
        var tabs = this.settings[type];
        for (var tabsKey in tabs) {
            if (tabsKey !== "data") {
                var tab = tabs[tabsKey];
                for (var tabKey in tab) {
                    if (tab[tabKey].init) {
                        tab[tabKey].init();
                    }
                }
            }
        }
    },
    /**
     * @description 获取流程脚本
     * @returns {String} 流程脚本 select HTML
     */
    getFlowScriptHTML: function() {
        var selectHTML = "<option value=''>&nbsp;</option>",
                data = eCooeModel.model.config.data.property.flowScriptCfgs;
        if (!eCooeModel.model.config.data.property.flowScriptCfgs) {
            data = [];
        }
        for (var i = 0; i < data.length; i++) {
            selectHTML += "<option value='" + data[i].id + "'>" + data[i].name + "</option>";
        }
        return selectHTML;
    },
    /**
     * @description 生成所有环节
     * @param {String} id 代码所填充 BOM id
     */
    genAllTask: function(id) {
        var taskHTML = "";
        var lanes = model.graph.getChildCells(model.graph.getDefaultParent());
        for (var j = 0; j < lanes.length; j++) {
            var cells = lanes[j].children;
            if (cells) {
                for (var k = 0; k < cells.length; k++) {
                    if (cells[k].bpmn === "userTask") {
                        taskHTML += "<li><input data-id='" +
                                cells[k].id + "' type='checkbox'/><span>" +
                                cells[k].value + "</span></li>";
                    }
                }
            }
        }

        $("#" + id + "Panel > ul").html(taskHTML);

        $("#" + id + "Panel input").click(function() {
            if ($(this).prop("checked")) {
                $(this).parent().addClass("current");
            } else {
                $(this).parent().removeClass("current");
            }
        });

        $("#" + id).click(function() {
            $("#" + id + "Panel").show();
        }).val("");

        $($("#" + id + "Panel button").get(0)).click(function() {
            var values = "",
                    ids = [];
            $("#" + id + "Panel input:checked").each(function() {
                values += $(this).next().text() + "、";
                ids.push($(this).data("id"));
            });
            $("#" + id).val(values.substr(0, values.length - 1)).data("ids", ids);
            $("#" + id + "Panel").hide();
        });

        $($("#" + id + "Panel button").get(1)).click(function() {
            var ids = $("#" + id).data("ids");

            $("#" + id + "Panel input").each(function() {
                $(this).removeProp("checked");
                $(this).parent().removeClass("current");
                for (var i = 0; i < ids.length; i++) {
                    if (ids[i] === $(this).data("id")) {
                        $(this).prop("checked", "checked");
                        $(this).parent().addClass("current");
                    }
                }
            });

            $("#" + id + "Panel").hide();
        });
    }
};


(function() {
    eCooeModel.model.config.initTab("taskDialog");
    eCooeModel.model.config.initTab("flowDialog");
    eCooeModel.model.config.initObject();
    eCooeModel.model.config.initCollapsed();


    /**
     * @description 泳道值设置
     * @param {String} id 泳道唯一标识 id 
     */
    eCooeModel.model.config.settings.lane.setData = function(id) {
        var data = eCooeModel.model.config.data.lanes;
        for (var i = 0; i < data.length; i++) {
            if (id === data[i].id) {
                $("#laneName").val(data[i].name);
                $("#laneDesc").val(data[i].desc);
                break;
            }
        }
        $("#laneDialog").data("id", id);
    };

    /**
     * @description 同步值设置
     */
    eCooeModel.model.config.settings.lane.getData = function() {
        var data = eCooeModel.model.config.data.lanes,
                id = $("#laneDialog").data("id");
        for (var i = 0; i < data.length; i++) {
            if (id === data[i].id) {
                data[i].name = $("#laneName").val();
                data[i].desc = $("#laneDesc").val();
            }
        }

        model.graph.getModel().getCellById(id).value = $("#laneName").val();
        model.graph.refresh(model.graph.getModel().getCellById(id));
    };


    /**
     * @description 连线值设置
     * @param {Obj} edge 线条对象
     */
    eCooeModel.model.config.settings.sequence.setData = function(edge) {
        $("#sequenceDialog").data("id", edge.id);
        var srcCell = model.graph.getModel().getTerminal(edge, true),
                targetCell = model.graph.getModel().getTerminal(edge, false),
                tasks = eCooeModel.model.config.data.tasks,
                data = {
            "name": "送" + model.graph.getModel().getTerminal(edge, false).value,
            "type": "SelSend",
            "filter": "",
            "chooseType": "Single",
            "chooseNode": 'User',
            "showLevel": "",
            "activationMode": {
                "type": "EachTime",
                "id": UUIDjs.create()
            },
            "desc": "",
            "id": UUIDjs.create(),
            "sequenceId": edge.id,
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

        if (targetCell.bpmn.indexOf("Gateway") > -1) {
            data = {
                "name": "新的操作",
                "type": "Gateway",
                "desc": "",
                "id": UUIDjs.create(),
                "sequenceId": edge.id,
                "condition": {
                    "expression": ""
                },
                "appEvents": {
                    "beforeScriptId": "",
                    "afterScriptId": ""
                }
            };
        }

        for (var i = 0; i < tasks.length; i++) {
            if (tasks[i].id === srcCell.id) {
                var flowActions = tasks[i].flowActions;
                for (var j = 0; j < flowActions.length; j++) {
                    if (edge.id === flowActions[j].sequenceId) {
                        data = flowActions[j];
                        break;
                    }
                }
                break;
            }
        }

        // 其余默认值
        $("#sequenceName").val(data.name);
        $("#sequenceDesc").val(data.desc);

        if (targetCell.bpmn === "userTask") {
            // 触发步骤
            var targetId = model.graph.getModel().getTerminal(edge, false).id;
            var tasks = eCooeModel.model.config.data.tasks,
                    targetStepHTML = "";
            for (var i = 0; i < tasks.length; i++) {
                if (tasks[i].id === targetId) {
                    var steps = tasks[i].steps;
                    for (var j = 0; j < steps.length; j++) {
                        targetStepHTML += "<option value='" +
                                steps[j].id + "'>" + steps[j].name +
                                "</option>";
                    }

                    $("#sequenceTargetStep").html(targetStepHTML);
                    $("#sequenceTargetStep").val(data.targetStep);
                    break;
                }
            }

            // 基本配置环节
            eCooeModel.model.config.genAllTask("sequenceTask");

            $('input[name="sequenceType"][value="' + data.type + '"]').prop("checked", "checked");
            if (data.type === "SelSend") {
                $("#sequenceSendRule").val("");
                $("#sequenceFilter").val(data.filter);
                $("#sequenceChooseType").val(data.chooseType);
                $('input[name="sequenceChooseNode"][value="' + data.chooseNode + '"]').
                        prop("checked", "checked");
                $('input[name="sequenceShowLevel"][value="' + data.showLevel + '"]').
                        prop("checked", "checked");
                $('input[name="sequenceType"]').parent().next().next().hide();
                $('input[name="sequenceType"]').parent().next().show();
            } else {
                $("#sequenceSendRule").val(data.filter);
                $("#sequenceFilter").val("");
                $("#sequenceChooseType").val("Single");
                $('input[name="sequenceChooseNode"][value="User"]').prop("checked", "checked");
                $('input[name="sequenceShowLevel"][value=""]').prop("checked", "checked");
                $('input[name="sequenceType"]').parent().next().next().show();
                $('input[name="sequenceType"]').parent().next().hide();
            }

            // 触发模式
            $("#sequenceActivationMode").val(data.activationMode.type);
            if (data.activationMode.type === "Complex") {
                $("#sequenceRange").val(data.activationMode.range);
                $("#sequenceActivationMode").next().show();
                $("#sequenceActivationMode").css("margin-top", "0");

                var tasks = data.activationMode.tasks,
                        values = "";

                $("#sequenceTaskPanel input").each(function() {
                    $(this).removeProp("checked");
                    $(this).parent().removeClass("current");
                    for (var j = 0; j < tasks.length; j++) {
                        if (tasks[j].toString() === $(this).data("id").toString()) {
                            values += $(this).next().text() + "、";
                            $(this).prop("checked", "checked");
                            $(this).parent().addClass("current");
                        }
                    }
                });
                $("#sequenceTask").val(values.substr(0, values.length - 1)).data("ids", tasks);
                $("#sequenceTaskPanel").hide();
            } else {
                $("#sequenceRange").val("Org");
                $("#sequenceActivationMode").next().hide();
                $("#sequenceActivationMode").css("margin-top", "9px");

                $("#sequenceTaskPanel input").each(function() {
                    $(this).removeProp("checked");
                    $(this).parent().removeClass("current");
                });
                $("#sequenceTask").val("").data("ids", []);
                $("#sequenceTaskPanel").hide();
            }



            // 高级配置环节
            eCooeModel.model.config.genAllTask("sequenceAdvanceTask");
            var advanceTasks = data.representation.activityIds,
                    advanecValues = "";
            $("#sequenceAdvanceTaskPanel input").each(function() {
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
            $("#sequenceAdvanceTask").val(advanecValues.substr(0, advanecValues.length - 1)).
                    data("ids", advanceTasks);

            $("#sequenceAdvanceRange").val(data.representation.range);

            $($($("#sequenceDialog table").get(0)).find("tr").get(2)).show();
            $($($("#sequenceDialog table").get(0)).find("tr").get(3)).show();
            $($($("#sequenceDialog table").get(0)).find("tr").get(4)).show();
            $($($("#sequenceDialog table").get(1)).find("tr").get(1)).show();
        } else {
            $($("#sequenceDialog table").get(0)).find("tr").get(2).style.display = "none";
            $($("#sequenceDialog table").get(0)).find("tr").get(3).style.display = "none";
            $($("#sequenceDialog table").get(0)).find("tr").get(4).style.display = "none";
            $($("#sequenceDialog table").get(1)).find("tr").get(1).style.display = "none";
        }
        // 高级配置
        $("#sequenceBefore, #sequenceAfter").html(eCooeModel.model.config.getFlowScriptHTML());
        $("#sequenceCondition").val(data.condition.expression);
        $("#sequenceBefore").val(data.appEvents.beforeScriptId);
        $("#sequenceAfter").val(data.appEvents.afterScriptId);
        $("#sequenceAdvanceTaskPanel").hide();
    };

    /**
     * @description 连线值设置
     */
    eCooeModel.model.config.settings.sequence.getData = function() {
        var cellId = $("#sequenceDialog").data("id");
        var srcCell = model.graph.getModel().
                getTerminal(eCooeModel.model.config.settings.sequence.data[cellId].cell, true),
                targetCell = model.graph.getModel().
                getTerminal(eCooeModel.model.config.settings.sequence.data[cellId].cell, false),
                tasks = eCooeModel.model.config.data.tasks,
                data = {},
                isNew = true,
                flowActions = {},
                taskId = 0;
        for (var i = 0; i < tasks.length; i++) {
            if (tasks[i].id === srcCell.id) {
                taskId = i;
                flowActions = tasks[i].flowActions;
                for (var j = 0; j < flowActions.length; j++) {
                    if (cellId === flowActions[j].sequenceId) {
                        data = flowActions[j];
                        isNew = false;
                        break;
                    }
                }
                break;
            }
        }

        data.name = $("#sequenceName").val();
        data.desc = $("#sequenceDesc").val();
        data.type = "Gateway";

        if (targetCell.bpmn === "userTask") {
            data.targetStep = $("#sequenceTargetStep").val();
            data.type = $('input[name="sequenceType"]:checked').val();
            if (data.type === "SelSend") {
                data.filter = $("#sequenceFilter").val();
                data.chooseType = $("#sequenceChooseType").val();
                data.chooseNode = $('input[name="sequenceChooseNode"]:checked').val();
                data.showLevel = $('input[name="sequenceShowLevel"]:checked').val();
            } else {
                data.filter = $("#sequenceSendRule").val();
            }

            if (isNew) {
                data.activationMode = {
                    "id": UUIDjs.create()
                };
            } else {
                data.activationMode = {
                    id: flowActions[j].activationMode.id
                };
            }

            data.activationMode.type = $("#sequenceActivationMode").val();
            if (data.activationMode.type === "Complex") {
                data.activationMode.range = $("#sequenceRange").val();
                data.activationMode.tasks = $("#sequenceTask").data("ids");
            }

            data.representation = {
                "range": $("#sequenceAdvanceRange").val(),
                "activityIds": $("#sequenceAdvanceTask").data("ids")
            };
        }

        data.condition = {
            "expression": $("#sequenceCondition").val()
        };

        data.appEvents = {
            "beforeScriptId": $("#sequenceBefore").val(),
            "afterScriptId": $("#sequenceAfter").val()
        };

        if (isNew) {
            data.sequenceId = cellId;
            data.id = UUIDjs.create();
            eCooeModel.model.config.data.tasks[taskId].flowActions.push(data);
        }

        eCooeModel.model.config.settings.sequence.data[cellId].cell.value = data.name;
        model.graph.refresh(eCooeModel.model.config.settings.sequence.data[cellId].cell);
    };

    /**
     * @description 连线数据结构存储值
     */
    eCooeModel.model.config.settings.sequence.data = {};

    /**
     * @description 连线初始化
     */
    eCooeModel.model.config.settings.sequence.init = function() {
        $("input[name=sequenceType]").change(function() {
            if (this.value === "SelSend") {
                $(this).parent().next().next().hide();
                $(this).parent().next().show();
            } else {
                $(this).parent().next().next().show();
                $(this).parent().next().hide();
            }
        });

        $("#sequenceActivationMode").change(function() {
            if (this.value === "Complex") {
                $(this).next().show();
                $(this).css("margin-top", "0");
            } else {
                $(this).next().hide();
                $(this).css("margin-top", "9px");
            }
        });
    };

    eCooeModel.plugins.chooseUser.init("participantDialog");
})();

