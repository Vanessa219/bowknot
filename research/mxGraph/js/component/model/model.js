/*
 * Copyright (c) 2013, Yunnan Yuan Xin technology Co., Ltd.
 *
 * All rights reserved.
 */
/**
 * @fileoverview 建模工具
 *
 * @author <a href="mailto:LLY219@gmail.com">Liyuan Li</a>
 * @version 1.0.3.2, Jun 3, 2013
 */
/**
 * @description 建模工具方法
 */
eCooeModel.model.model = function() {
    $(window).resize(function() {
        model._initFrame();
    });
    this.isInsertEdge = false;
    this._initFrame();

    var graph = new mxGraph(document.getElementById("mxGraph"));
    this.graph = graph;
    this.sidebar = new eCooeModel.model.sidebar(graph);
    this._initGraph(graph);

    this._bindKeyEvent(graph);

    this.dialog = {
        lane: new Dialog({
            id: "laneDialog",
            height: 290,
            saveFnt: function() {
                eCooeModel.model.config.settings.lane.getData();
            }
        }),
        sequence: new Dialog({
            id: "sequenceDialog",
            saveFnt: function(id) {
                $($("#" + id + " .dialog-footer > button").get(1)).unbind("click").
                        bind("click", function() {
                    model.dialog.sequence.close();
                });

                $("#" + id + " .dialog-header > .close-ico").unbind("click").bind("click", function() {
                    model.dialog.sequence.close();
                });

                eCooeModel.model.config.settings.sequence.getData();
            },
            init: function() {
                eCooeModel.model.config.settings.sequence.init();
            }
        }),
        task: new Dialog({
            id: "taskDialog",
            saveFnt: function() {
                eCooeModel.model.config.getData("task");
            },
            init: function() {
                eCooeModel.model.config.initScript("task");
            }
        }),
        flow: new Dialog({
            id: "flowDialog",
            saveFnt: function() {
                eCooeModel.model.config.getData("flow");
            },
            init: function() {
                eCooeModel.model.config.initScript("flow");
            }
        }),
        gateway: new Dialog({
            id: "gatewayDialog",
            saveFnt: function() {
                eCooeModel.model.config.getData("gateway");
            },
            init: function() {
                eCooeModel.model.config.initScript("gateway");
            }
        })
    };
    this._bindDialogEvent(graph);

    this.toolbar = new eCooeModel.model.toolbar(graph);

    this._removeSync(graph);
};

$.extend(eCooeModel.model.model.prototype, {
    /**
     * @description 同步 startEvent, endEvent, userTask, sequence
     * @param {Obj} cell 被删除元素对象
     */
    _removeSyncData: function(cell) {
        if (cell.bpmn === "startEvent") {
            delete eCooeModel.model.config.data.startEvent;
        } else if (cell.bpmn === "endEvent") {
            var endEvents = eCooeModel.model.config.data.endEvents;
            for (var l = 0; l < endEvents.length; l++) {
                if (endEvents[l].id === cell.id) {
                    endEvents.splice(l, 1);
                }
            }
        } else if (cell.edge) {
            // remove sequence
            var sequence = eCooeModel.model.config.settings.sequence.data;
            delete sequence[cell.id];

            // remove flow action in the tasks setting
            var tasks = eCooeModel.model.config.data.tasks,
                    srcCell = model.graph.getModel().getTerminal(cell, true);
            for (var i = 0; i < tasks.length; i++) {
                if (tasks[i].id === srcCell.id) {
                    var flowActions = tasks[i].flowActions;
                    for (var j = 0; j < flowActions.length; j++) {
                        if (cell.id === flowActions[j].sequenceId) {
                            tasks[i].flowActions.splice(j, 1);
                            break;
                        }
                    }
                    break;
                }
            }
        } else if (cell.bpmn === "userTask" || cell.bpmn.indexOf("Gateway") > -1) {
            var tasks = eCooeModel.model.config.data.tasks;
            for (var m = 0; m < tasks.length; m++) {
                if (cell.bpmn === "userTask") {
                    // 如果当前环节被选择时，则移除
                    var flowActions = tasks[m].flowActions;
                    for (var n = 0; n < flowActions.length; n++) {
                        if (flowActions[n].activationMode) {
                            for (var a = 0; a < flowActions[n].activationMode.tasks.length; a++) {
                                if (cell.id === flowActions[n].activationMode.tasks[a]) {
                                    flowActions[n].activationMode.tasks.splice(a, 1);
                                }
                            }
                        }

                        if (flowActions[n].representation) {
                            for (var a = 0; a < flowActions[n].representation.activityIds.length; a++) {
                                if (cell.id === flowActions[n].representation.activityIds[a]) {
                                    flowActions[n].representation.activityIds.splice(a, 1);
                                }
                            }
                        }
                    }

                    var appActions = tasks[m].appActions;
                    for (var n = 0; n < appActions.length; n++) {
                        if (appActions[n].representation) {
                            for (var a = 0; a < appActions[n].representation.activityIds.length; a++) {
                                if (cell.id === appActions[n].representation.activityIds[a]) {
                                    appActions[n].representation.activityIds.splice(a, 1);
                                }
                            }
                        }
                    }

                    var cmtActions = tasks[m].cmtActions;
                    for (var n = 0; n < cmtActions.length; n++) {
                        if (cmtActions[n].representation) {
                            for (var a = 0; a < cmtActions[n].representation.activityIds.length; a++) {
                                if (cell.id === cmtActions[n].representation.activityIds[a]) {
                                    cmtActions[n].representation.activityIds.splice(a, 1);
                                }
                            }
                        }
                    }
                }

                if (tasks[m].id === cell.id) {
                    tasks.splice(m, 1);
                }

            }

        }
    },
    /**
     * @description 删除图形时，同步删除数据
     * @param {Obj} graph mxGraph 图形对象
     */
    _removeSync: function(graph) {
        graph.addListener(mxEvent.REMOVE_CELLS, function(graph, event) {
            var cells = event.properties.cells;
            for (var i = 0; i < cells.length; i++) {
                if (cells[i].bpmn === "Lane") {
                    var data = eCooeModel.model.config.data.lanes;
                    for (var k = 0; k < data.length; k++) {
                        if (data[i].id === cells[i].id) {
                            data.splice(k, 1);
                        }
                    }

                    if (cells[i].children) {
                        var children = cells[i].children;
                        for (var j = 0; j < children.length; j++) {
                            model._removeSyncData(children[j]);
                        }
                    }
                } else {
                    model._removeSyncData(cells[i]);
                }
            }
        });
    },
    /**
     * @description 添加线条时弹出属性对话框，当点取消时，撤销该线条的添加
     * @param {String} edgeId 撤销线条的 id
     */
    cancelAddSequence: function(edgeId) {
        var that = this;
        that.dialog.sequence.close(function(id) {
            that.toolbar.undoManager.undo();
            delete eCooeModel.model.config.settings.sequence.data[edgeId];

            $($("#" + id + " .dialog-footer > button").get(1)).unbind("click").bind("click", function() {
                that.dialog.sequence.close();
            });

            $("#" + id + " .dialog-header > .close-ico").unbind("click").bind("click", function() {
                that.dialog.sequence.close();
            });
        });
    },
    /**
     * @description 绑定 dialog 事件
     * @param {Obj} graph 编辑器图形对象
     */
    _bindDialogEvent: function(graph) {
        var that = this;
        graph.dblClick = function(evt, cell) {
            if (evt.stopPropagation) {
                evt.stopPropagation();
            } else {
                evt.cancelBubble = true;
            }

            if (!cell) {
                that.dialog.flow.open(function() {
                    eCooeModel.model.config.setData("flow");
                    $("#flowDialog .tab-header .first").click();
                });
                return;
            }

            // open dialog
            if (cell.bpmn === "Lane") {
                that.dialog.lane.open();
                eCooeModel.model.config.settings.lane.setData(cell.id);
                return;
            }

            if (cell.edge) {
                if (this.getModel().getTerminal(cell, false).bpmn.indexOf("Gateway") > -1 &&
                        this.getModel().getTerminal(cell, true).bpmn.indexOf("Gateway") > -1 ||
                        this.getModel().getTerminal(cell, true).bpmn === "startEvent" ||
                        this.getModel().getTerminal(cell, false).bpmn === "endEvent") {
                } else {
                    that.dialog.sequence.open();
                    eCooeModel.model.config.settings.sequence.setData(cell, false);
                }
                return;
            }

            if (cell.bpmn === "userTask") {
                that.dialog.task.open(function() {
                    eCooeModel.model.config.setData("task", cell);
                    $("#taskDialog .tab-header .first").click();
                });
                return;
            }

            if (cell.bpmn.indexOf("Gateway") > -1) {
                that.dialog.gateway.open(function() {
                    eCooeModel.model.config.setData("gateway", cell);
                });
                return;
            }
        };
    },
    /**
     * @description 绑定键盘
     * @param {Obj} graph 编辑器图形对象
     */
    _bindKeyEvent: function(graph) {
        var keyHandler = new mxKeyHandler(graph),
                nudge = function nudge(keyCode) {
            if (!graph.isSelectionEmpty()) {
                var dx = 0;
                var dy = 0;

                if (keyCode === 37) {
                    dx = -1;
                } else if (keyCode === 38) {
                    dy = -1;
                } else if (keyCode === 39) {
                    dx = 1;
                } else if (keyCode === 40) {
                    dy = 1;
                }

                graph.moveCells(graph.getSelectionCells(), dx, dy);
                graph.scrollCellToVisible(graph.getSelectionCell());
            }
        };
        keyHandler.bindKey(37, function() {
            nudge(37);
        }); // Left arrow
        keyHandler.bindKey(38, function() {
            nudge(38);
        }); // Up arrow
        keyHandler.bindKey(39, function() {
            nudge(39);
        }); // Right arrow
        keyHandler.bindKey(40, function() {
            nudge(40);
        }); // Down arrow
        keyHandler.bindKey(46, function() {
            graph.removeCells();
        });// delete

    },
    /**
     * @description 页面框架自适应
     */
    _initFrame: function() {
        var barW = 16,
                TBHeight = $(".header").height() + $(".footer").height();
        var $window = $(window),
                $side = $(".side");
        var contentH = $window.height() - TBHeight,
                panelWrapW = $window.width() - $side.width(),
                panelWrapH = contentH;

        if (contentH <= $side.height()) {
            panelWrapW -= barW;
            panelWrapH = $side.height();
        }

        $(".content").height(contentH);
        $(".panel-wrap").width(panelWrapW).height(panelWrapH);
    },
    /**
     * @description 初始化默认泳道和 start event
     * @param {Obj} graph 编辑器图形对象
     */
    _initGraph: function(graph) {
        var model = graph.getModel(),
                targetCell = {};

        // Auto-resizes the container
        graph.border = 4;
        graph.getView().translate = new mxPoint(graph.border, graph.border);
        graph.setResizeContainer(true);
        graph.graphHandler.setRemoveCellsFromParent(false);

        // Installs double click on middle control point and
        // changes style of edges between empty and this value
        var style = graph.getStylesheet().getDefaultVertexStyle();
        style[mxConstants.STYLE_FONTCOLOR] = 'black';
        style[mxConstants.STYLE_STROKECOLOR] = 'transparent';
        style[mxConstants.STYLE_FILLCOLOR] = 'transparent';
        style[mxConstants.STYLE_FONTSIZE] = 12;
        style[mxConstants.DEFAULT_STARTSIZE] = 200;
        style[mxConstants.STYLE_RESIZABLE] = 0;
        style[mxConstants.STYLE_IMAGE_ALIGN] = "center";
        style[mxConstants.STYLE_FONTFAMILY] = '微软雅黑';

        style = graph.getStylesheet().getDefaultEdgeStyle();
        style[mxConstants.STYLE_EDGE] = mxEdgeStyle.ElbowConnector;
        style[mxConstants.STYLE_ENDARROW] = mxConstants.ARROW_BLOCK;
        style[mxConstants.STYLE_ROUNDED] = true;
        style[mxConstants.STYLE_FONTCOLOR] = 'black';
        style[mxConstants.STYLE_STROKECOLOR] = '#999';
        style[mxConstants.STYLE_STROKEWIDTH] = 3;
        style[mxConstants.STYLE_FONTSIZE] = 12;
        style[mxConstants.STYLE_FONTFAMILY] = '微软雅黑';

        graph.alternateEdgeStyle = 'elbow=vertical';

        if (graph.isEnabled()) {
            // Allows new connections but no dangling edges
            graph.setConnectable(true);
            graph.setAllowDanglingEdges(false);

            // End-states are no valid sources
            var previousIsValidSource = graph.isValidSource;

            graph.isValidSource = function(cell) {
                targetCell = cell;
                if (previousIsValidSource.apply(this, arguments)) {
                    // NOTE: 该判断使用第三方的 mxGraph，请忽略等号检测
                    return cell.bpmn == null || !(cell.bpmn === 'endEvent');
                }

                return false;
            };

            // Start-states are no valid targets, we do not
            // perform a call to the superclass function because
            // this would call isValidSource
            // Note: All states are start states in
            // the example below, so we use the state
            // style below
            graph.isValidTarget = function(cell) {
                if (!this.getModel().isEdge(cell)
                        && !this.isSwimlane(cell)) {
                    // 开始节点不能连接到网关
                    if (cell.bpmn.indexOf("Gateway") > -1 
                            && targetCell.bpmn === "startEvent") {
                        return false;
                    }
                    
                    // 网关不能到 endEvent
                    if (cell.bpmn === "endEvent" && targetCell.bpmn.indexOf("Gateway") > -1) {
                        return false;
                    }

                    // 连线到网关，如 targetCell 已有一条来自网关的入线则不能连接
                    if (cell.bpmn.indexOf("Gateway") > -1) {
                        var targetEdges = this.getEdges(cell);
                        for (var j = 0; j < targetEdges.length; j++) {
                            if (targetEdges[j].target.id === cell.id &&
                                    targetEdges[j].target.bpmn.indexOf("Gateway") > -1 &&
                                    targetEdges[j].source.bpmn.indexOf("Gateway") > -1) {
                                return false;
                            }
                        }
                    }

                    // 当连线为网关和网关之间，需进行判断
                    if (cell.bpmn.indexOf("Gateway") > -1) {
                        var edges = this.getEdges(cell);
                        for (var i = 0; i < edges.length; i++) {
                            if (edges[i].source.bpmn.indexOf("Gateway") > -1 &&
                                    edges[i].target.id === cell.id &&
                                    targetCell.id === edges[i].source.id) {
                                return false;
                            }

                            if (edges[i].target.bpmn.indexOf("Gateway") > -1
                                    && edges[i].source.id === cell.id
                                    && targetCell.id === edges[i].target.id) {
                                return false;
                            }
                        }
                    }
                    // NOTE: 该判断使用第三方的 mxGraph，请忽略等号检测
                    return (cell.bpmn == null || !(cell.bpmn === 'startEvent'));
                } else {
                    return false;
                }
            };

            // Allows dropping cells into new lanes and
            // lanes into new pools, but disallows dropping
            // cells on edges to split edges
            graph.setDropEnabled(true);
            graph.setSplitEnabled(false);

            // Returns true for valid drop operations
            graph.isValidDropTarget = function(target, cells, evt) {
                if (this.isSplitEnabled() &&
                        this.isSplitTarget(target, cells, evt)) {
                    return true;
                }

                var resourceIsLane = true;
                for (var i = 0; i < cells.length; i++) {
                    if (cells[i].bpmn === "Lane") {
                        resourceIsLane = false;
                    }
                }

                return resourceIsLane && target.bpmn === "Lane";
            };
            // Keeps widths on collapse/expand					
            var foldingHandler = function(sender, evt) {
                var cells = evt.getProperty('cells');

                for (var i = 0; i < cells.length; i++) {
                    var geo = graph.model.getGeometry(cells[i]);

                    if (geo.alternateBounds !== null)
                    {
                        geo.width = geo.alternateBounds.width;
                    }
                }
            };

            graph.addListener(mxEvent.FOLD_CELLS, foldingHandler);
        }

        new mxSwimlaneManager(graph);
        // Creates a stack depending on the orientation of the swimlane
        var layout = new mxStackLayout(graph, false);

        // Makes sure all children fit into the parent swimlane
        layout.resizeParent = true;

        // Applies the size to children if parent size changes
        layout.fill = true;

        // Only update the size of swimlanes
        layout.isVertexIgnored = function(vertex) {
            return !(vertex.bpmn === "Lane");
            //return !graph.isSwimlane(vertex);
        };

        var layoutParallelEdge = new mxParallelEdgeLayout(graph);
        // Keeps the lanes and pools stacked
        var layoutMgr = new mxLayoutManager(graph),
                that = this;

        layoutMgr.getLayout = function(cell) {
            if (!that.isInsertEdge && !model.isEdge(cell) &&
                    graph.getModel().getChildCount(cell) > 0 &&
                    model.getParent(cell) == model.getRoot()) {
                // NOTE: 该判断使用第三方的 mxGraph，请忽略等号检测
                return layout;
            } else if (that.isInsertEdge && cell.getChildCount() > 0) {
                that.isInsertEdge = false;
                return layoutParallelEdge;
            }

            return null;
        };

        if (eCooeModel.model.data.configGraph === "") {
            var parent = graph.getDefaultParent();
            // Adds cells to the model in a single step
            model.beginUpdate();
            try {
                eCooeModel.model.config.data.lanes = [];
                var laneA = graph.importCells([this.sidebar.shap.lane.cell], 0, 0, parent);
                laneA[0].id = UUIDjs.create();
                eCooeModel.model.config.data.lanes.push({
                    "id": laneA[0].id,
                    "name": "泳道",
                    "desc": ""
                });
                var startEvent = graph.importCells([this.sidebar.shap.startEvent.cell], 480, 40, laneA[0]);
                startEvent[0].id = UUIDjs.create();
                eCooeModel.model.config.data.startEvent = {
                    "id": startEvent[0].id
                };

                var laneB = graph.importCells([this.sidebar.shap.lane.cell], 0, 0, parent);
                laneB[0].id = UUIDjs.create();
                eCooeModel.model.config.data.lanes.push({
                    "id": laneB[0].id,
                    "name": "泳道",
                    "desc": ""
                });

                var laneC = graph.importCells([this.sidebar.shap.lane.cell], 0, 0, parent);
                laneC[0].id = UUIDjs.create();
                eCooeModel.model.config.data.lanes.push({
                    "id": laneC[0].id,
                    "name": "泳道",
                    "desc": ""
                });
            } finally {
                // Updates the display
                model.endUpdate();
            }
        } else {
            var doc = mxUtils.parseXml(eCooeModel.model.data.configGraph);
            var codec = new mxCodec(doc);
            codec.decode(doc.documentElement, model);

            graph.getView().translate = new mxPoint(graph.border, graph.border);
            graph.refresh(parent);


            var sequencesData = eCooeModel.model.config.data.sequences;
            for (var i = 0; i < sequencesData.length; i++) {
                eCooeModel.model.config.settings.sequence.data[sequencesData[i].id] = {
                    sourceTaskId: sequencesData[i].sourceTaskId,
                    targetTaskId: sequencesData[i].targetTaskId,
                    cell: model.getCellById(sequencesData[i].id)
                };
            }
        }
    }
});

var model = {};
$(document).ready(function() {
    if ($.browser.msie) {
        $("body").html("请使用 Firefox / Chrome");
        return;
    }
    model = new eCooeModel.model.model();
    $("#modelTip").hide();
});