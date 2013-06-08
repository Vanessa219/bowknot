/*
 * Copyright (c) 2013, Yunnan Yuan Xin technology Co., Ltd.
 *
 * All rights reserved.
 */
/**
 * @fileoverview 工具栏.
 *
 * @author <a href="mailto:LLY219@gmail.com">Liyuan Li</a>
 * @version 1.0.1.5, Jun 3, 2013
 */
/**
 * @description 工具栏方法
 * @param {Obj} graph mxGraph 图形对象
 */
eCooeModel.model.toolbar = function(graph) {
    this.graph = graph;
    this.undoManager = new mxUndoManager();
    this._initUndo();
    this._setAlign();
    this._bindEvent();
    $("#toolbarAlign button").prop("disabled", "disabled");
    $("#toolbarUndo").prop("disabled", "disabled");
    $("#toolbarRedo").prop("disabled", "disabled");
};

$.extend(eCooeModel.model.toolbar.prototype, {
    /**
     * @description undo & redo 状态设置
     * @param {Obj} undoManager 撤销管理对象
     */
    _setUndo: function(undoManager) {
        if (undoManager.canUndo()) {
            $("#toolbarUndo").removeProp("disabled");
            $("#toolbarUndo")[0].className = "undo-ico";
        } else {
            $("#toolbarUndo").prop("disabled", "disabled");
            $("#toolbarUndo")[0].className = "undo-disabled-ico";
        }

        if (undoManager.canRedo()) {
            $("#toolbarRedo").removeProp("disabled");
            $("#toolbarRedo")[0].className = "redo-ico";
        } else {
            $("#toolbarRedo").prop("disabled", "disabled");
            $("#toolbarRedo")[0].className = "redo-disabled-ico";
        }
    },
    /**
     * @description 初始化 undo & redo
     */
    _initUndo: function() {
        var graph = this.graph,
                undoManager = this.undoManager,
                that = this;
        var listener = function(sender, evt) {
            undoManager.undoableEditHappened(evt.getProperty('edit'));
            //that._setUndo(undoManager);
        };
        graph.getModel().addListener(mxEvent.UNDO, listener);
        graph.getView().addListener(mxEvent.UNDO, listener);
    },
    /**
     * @description 设置位置按钮是否可用
     */
    _setAlign: function() {
        var graph = this.graph;
        graph.addListener(mxEvent.CLICK, function(sender, evt) {
            var cell = evt.getProperty('cell'); // cell may be null
            var cells = graph.getSelectionCells(),
                    cellsCount = 0,
                    hasLane = false;
            for (var i = 0; i < cells.length; i++) {
                if (cells[i].bpmn === "Lane") {
                    hasLane = true;
                    break;
                }

                if (cells[i].bpmn === "userTask" ||
                        cells[i].bpmn === "startEvent" ||
                        cells[i].bpmn === "endEvent") {
                    cellsCount += 1;
                }

            }

            if (!hasLane && cellsCount > 1) {
                $("#toolbarAlign >  button").removeProp("disabled");
                $("#toolbarAlign >  button").each(function() {
                    this.className = this.className.replace("-disabled-ico", "-ico");
                });
            } else {
                $("#toolbarAlign >  button").prop("disabled", "disabled");
                $("#toolbarAlign >  button").each(function() {
                    if (this.className.indexOf("-disabled-ico") === -1) {
                        this.className = this.className.replace("-ico", "-disabled-ico");
                    }
                });
            }

            if (cell !== null) {
                evt.consume();
            }
        });
    },
    /**
     * @description 绑定工具栏事件
     */
    _bindEvent: function() {
        var undoManager = this.undoManager,
                that = this,
                graph = this.graph;
        /* NOTE: 该功能暂时屏蔽
         * $("#toolbarUndo").click(function() {
         undoManager.undo();
         that._setUndo(undoManager);
         });
         
         $("#toolbarRedo").click(function() {
         undoManager.redo();
         that._setUndo(undoManager);
         });*/

        $("#toolbarLeftAlign").click(function() {
            graph.alignCells(mxConstants.ALIGN_LEFT);
        });
        $("#toolbarCenter").click(function() {
            graph.alignCells(mxConstants.ALIGN_CENTER);
        });
        $("#toolbarRightAlign").click(function() {
            graph.alignCells(mxConstants.ALIGN_RIGHT);
        });
        $("#toolbarTopAlign").click(function() {
            graph.alignCells(mxConstants.ALIGN_TOP);
        });
        $("#toolbarMiddle").click(function() {
            graph.alignCells(mxConstants.ALIGN_MIDDLE);
        });
        $("#toolbarBottomAlign").click(function() {
            graph.alignCells(mxConstants.ALIGN_BOTTOM);
        });

        $("#toolbarSave").click(function() {
            // 从图形中提取所需数据 sequences
            var sequence = eCooeModel.model.config.settings.sequence.data,
                    sequencesData = [];
            for (var key in sequence) {
                sequencesData.push({
                    "id": key,
                    "sourceTaskId": sequence[key].sourceTaskId,
                    "targetTaskId": sequence[key].targetTaskId
                });

                // 重置结束线条数据
                if (eCooeModel.model.config.data.endEvents) {
                    var endEventsData = eCooeModel.model.config.data.endEvents;
                    for (var n = 0; n < endEventsData.length; n++) {
                        if (sequence[key].targetTaskId === endEventsData[n].id) {
                            var tasksData = eCooeModel.model.config.data.tasks;
                            for (var m = 0; m < tasksData.length; m++) {
                                if (tasksData[m].id === sequence[key].sourceTaskId) {
                                    var flowActionsData = tasksData[m].flowActions,
                                            isExist = false;
                                    for (var p = 0; p < flowActionsData.length; p++) {
                                        if (flowActionsData[p].sequenceId === key) {
                                            isExist = true;
                                            flowActionsData[p].type = "End";
                                        }

                                    }

                                    if (!isExist) {
                                        tasksData[m].flowActions.push({
                                            "id": UUIDjs.create(),
                                            "name": sequence[key].cell.value,
                                            "type": "End",
                                            "sequenceId": key
                                        });
                                    }
                                }

                            }
                        }
                    }
                }
            }
            eCooeModel.model.config.data.sequences = sequencesData;

            // 从图形中提取所需数据中 task 的 laneId
            var lanes = model.graph.getChildCells(model.graph.getDefaultParent()),
                    tasks = eCooeModel.model.config.data.tasks;
            for (var j = 0; j < lanes.length; j++) {
                var cells = lanes[j].children;
                if (cells) {
                    for (var k = 0; k < cells.length; k++) {
                        if (cells[k].bpmn === "userTask") {
                            for (var i = 0; i < tasks.length; i++) {
                                if (cells[k].id === tasks[i].id) {
                                    tasks[i].laneId = lanes[j].id;
                                }
                            }
                        }
                    }
                }
            }

            // 为 task 添加 appActionPluginId、cmtActionPluginId、flowActionPluginId
            for (var q = 0; q < tasks.length; q++) {
                if (!tasks[q].appActionPluginId) {
                    tasks[q].appActionPluginId = UUIDjs.create();
                }
                if (!tasks[q].cmtActionPluginId) {
                    tasks[q].cmtActionPluginId = UUIDjs.create();
                }
                if (!tasks[q].flowActionPluginId) {
                    tasks[q].flowActionPluginId = UUIDjs.create();
                }
            }
            var enc = new mxCodec();
            var node = enc.encode(graph.getModel());
            var configGraph = mxUtils.getXml(node);
            if (configGraph.indexOf("<mxGraphModel>") !== 0) {
                configGraph = "<mxGraphModel>" + configGraph + "</mxGraphModel>";
            }

            console.log({
                "versionId": location.search.split("=")[1].split("&")[0],
                "configGraph": configGraph,
                "configData": eCooeModel.model.config.data
            });

            $("#modelTip").show().text("保存中...");

            $.ajax({
                url: eCooeModel.servePath + "/eCooeModel/pc/model/save",
                data: {
                    "versionId": location.search.split("=")[1].split("&")[0],
                    "configGraph": configGraph,
                    "configData": JSON.stringify(eCooeModel.model.config.data)
                },
                type: "POST",
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    $("#modelTip").show().text("保存失败:" + textStatus);
                    setTimeout(function () {
                        $("#modelTip").hide();
                    }, 3000);
                },
                success: function(data, textStatus) {
                    if (data.succeed) {
                        $("#modelTip").show().text("保存成功");
                    } else {
                        $("#modelTip").show().text("保存失败:" + data.msg);
                    }
                    
                    setTimeout(function () {
                        $("#modelTip").hide();
                    }, 3000);
                }
            });
        });
    }
});