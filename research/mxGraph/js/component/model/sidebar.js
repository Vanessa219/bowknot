/*
 * Copyright (c) 2013, Yunnan Yuan Xin technology Co., Ltd.
 *
 * All rights reserved.
 */
/**
 * @fileoverview 侧边栏.
 *
 * @author <a href="mailto:LLY219@gmail.com">Liyuan Li</a>
 * @version 1.0.1.5, Jun 3, 2013
 */
/**
 * @description 侧边栏方法
 * @param {Obj} graph mxGraph 图形对象
 */
eCooeModel.model.sidebar = function(graph) {
    $(".side dt").click(function() {
        var $it = $(this);
        if ($it.find("span").hasClass("arrow-down-ico")) {
            $it.next().slideUp();
            $it.find("span")[0].className = "arrow-up-ico";
        } else {
            $it.next().slideDown();
            $it.find("span")[0].className = "arrow-down-ico";
        }

    });
    this.graph = graph;
    this.shap = {
        lane: {
            cell: {},
            height: 150,
            width: 650
        },
        userTask: {
            cell: {},
            height: 47,
            width: 132
        },
        startEvent: {
            cell: {},
            height: 42,
            width: 42
        },
        endEvent: {
            cell: {},
            height: 46,
            width: 46
        },
        exclusiveGateway: {
            cell: {},
            height: 60,
            width: 60
        },
        parallelGateway: {
            cell: {},
            height: 60,
            width: 60
        },
        inclusiveGateway: {
            cell: {},
            height: 60,
            width: 60
        }
    };
    this._defineElement();
    this._bindEvent();
};

$.extend(eCooeModel.model.sidebar.prototype, {
    /**
     * @description 元素定义
     */
    _defineElement: function() {
        var lane = new mxCell('泳道',
                new mxGeometry(0, 0, this.shap.lane.width, this.shap.lane.height),
                'resizable=1;shape=swimlane;horizontal=0;strokeColor=#BEBEBE;fillColor=#F5F5F5');
        lane.vertex = true;
        lane.connectable = false;
        lane.bpmn = "Lane";
        this.shap.lane.cell = lane;

        var userTask = new mxCell('用户任务',
                new mxGeometry(0, 0, this.shap.userTask.width, this.shap.userTask.height),
                "shape=label;imageWidth=132;imageHeight=47;image=" +
                eCooeModel.staticServePath +
                "../images/component/model/elements/user-task.png;");
        userTask.vertex = true;
        userTask.bpmn = "userTask";
        this.shap.userTask.cell = userTask;

        var startEvent = new mxCell('',
                new mxGeometry(0, 0, this.shap.startEvent.width, this.shap.startEvent.height),
                "shape=label;imageWidth=42;imageHeight=42;image=" +
                eCooeModel.staticServePath +
                "../images/component/model/elements/start-event.png;");
        startEvent.vertex = true;
        startEvent.bpmn = "startEvent";
        this.shap.startEvent.cell = startEvent;

        var endEvent = new mxCell('',
                new mxGeometry(0, 0, this.shap.endEvent.width, this.shap.endEvent.height),
                "shape=label;imageWidth=46;imageHeight=46;image=" +
                eCooeModel.staticServePath +
                "../images/component/model/elements/end-event.png;");
        endEvent.vertex = true;
        endEvent.bpmn = "endEvent";
        this.shap.endEvent.cell = endEvent;

        var exclusiveGateway = new mxCell('',
                new mxGeometry(0, 0, this.shap.exclusiveGateway.width, this.shap.exclusiveGateway.height),
                "shape=label;imageWidth=60;imageHeight=60;image=" +
                eCooeModel.staticServePath +
                "../images/component/model/elements/exclusive-gateway.png;");
        exclusiveGateway.vertex = true;
        exclusiveGateway.bpmn = "exclusiveGateway";
        this.shap.exclusiveGateway.cell = exclusiveGateway;

        var parallelGateway = new mxCell('',
                new mxGeometry(0, 0, this.shap.parallelGateway.width, this.shap.parallelGateway.height),
                "shape=label;imageWidth=60;imageHeight=60;image=" +
                eCooeModel.staticServePath +
                "../images/component/model/elements/parallel-gateway.png;");
        parallelGateway.vertex = true;
        parallelGateway.bpmn = "parallelGateway";
        this.shap.parallelGateway.cell = parallelGateway;

        var inclusiveGateway = new mxCell('',
                new mxGeometry(0, 0, this.shap.inclusiveGateway.width, this.shap.inclusiveGateway.height),
                "shape=label;imageWidth=60;imageHeight=60;image=" +
                eCooeModel.staticServePath +
                "../images/component/model/elements/inclusive-gateway.png;");
        inclusiveGateway.vertex = true;
        inclusiveGateway.bpmn = "inclusiveGateway";
        this.shap.inclusiveGateway.cell = inclusiveGateway;
    },
    /**
     * 事件绑定
     */
    _bindEvent: function() {
        var that = this;
        $("#sideSwimlane").click(function() {
            that._addSwimlane();
        });

        this._addClickHandler("sideStartEvent", this.shap.startEvent);
        this._addClickHandler("sideEndEvent", this.shap.endEvent);
        this._addClickHandler("sideUserTask", this.shap.userTask);
        this._addClickHandler("sideExclusiveGateway", this.shap.exclusiveGateway);
        this._addClickHandler("sideParallelGateway", this.shap.parallelGateway);
        this._addClickHandler("sideInclusiveGateway", this.shap.inclusiveGateway);
    },
    /**
     * @description 拖拽事件绑定
     * @param {String} id 拖拽源 id
     * @param {Obj} shap 拖拽后需添加到编辑器中的元素
     */
    _addClickHandler: function(id, shap) {
        var graph = this.graph;
        var cells = [shap.cell];
        var elt = document.getElementById(id);
        var preview = document.createElement('div');
        preview.style.border = '1px dashed black';
        preview.style.width = shap.width + 'px';
        preview.style.height = shap.height + 'px';
        var ds = mxUtils.makeDraggable(elt, graph, this._createDropHandler(cells, true),
                preview, 0, 0, graph.autoscroll, true, true);
        var first = null;

        var md = (mxClient.IS_TOUCH) ? 'touchstart' : 'mousedown';
        mxEvent.addListener(elt, md, function(evt) {
            first = new mxPoint(mxEvent.getClientX(evt), mxEvent.getClientY(evt));
        });

        var oldMouseUp = ds.mouseUp;
        ds.mouseUp = function(evt) {
            // NOTE: 该判断使用第三方的 mxGraph，请忽略等号检测
            if (!mxEvent.isPopupTrigger(evt) && this.currentGraph == null && first != null) {
                var tol = graph.tolerance;

                if (Math.abs(first.x - mxEvent.getClientX(evt)) <= tol &&
                        Math.abs(first.y - mxEvent.getClientY(evt)) <= tol) {
                    var gs = graph.getGridSize();
                    ds.drop(graph, evt, null, gs, gs);
                }
            }

            oldMouseUp.apply(this, arguments);
            first = null;
        };
    },
    /**
     * @description Creates a drop handler for inserting the given cells.
     * @param {Obj} cells mxGraph 中的 cell 对象
     * @param {Boolean} allowSplit 连线上是否允许节点拖拽其上进行添加
     */
    _createDropHandler: function(cells, allowSplit) {
        return function(graph, evt, target, x, y) {
            cells = graph.getImportableCells(cells);

            if (cells.length > 0 && target) {
                if (cells[0].bpmn === "startEvent" && eCooeModel.model.config.data.startEvent) {
                    return;
                }

                // NOTE: 该判断使用第三方的 mxGraph，请忽略等号检测
                var validDropTarget = (target != null) ?
                        graph.isValidDropTarget(target, cells, evt) : false;
                var select = null;

                if (target !== null && !validDropTarget) {
                    if (target.bpmn === "userTask" || target.bpmn === "startEvent" ||
                            target.bpmn === "endEvent") {
                        target = target.parent;
                    } else {
                        target = null;
                    }
                }

                // Splits the target edge or inserts into target group
                if (allowSplit && graph.isSplitEnabled() && graph.isSplitTarget(target, cells, evt)) {
                    graph.splitEdge(target, cells, null, x, y);
                    select = cells;
                } else if (cells.length > 0) {
                    select = graph.importCells(cells, x, y, target);
                }

                // NOTE: 该判断使用第三方的 mxGraph，请忽略等号检测
                if (select != null && select.length > 0) {
                    graph.scrollCellToVisible(select[0]);
                    graph.setSelectionCells(select);
                }


                // 同步数据结构 eCooeModel.model.config.data
                select[0].id = UUIDjs.create();
                if (select[0].bpmn === "startEvent") {
                    eCooeModel.model.config.data.startEvent = {
                        "id": select[0].id
                    };
                } else if (select[0].bpmn === "endEvent") {
                    if (eCooeModel.model.config.data.endEvents) {
                        eCooeModel.model.config.data.endEvents.push({
                            "id": select[0].id
                        });
                    } else {
                        eCooeModel.model.config.data.endEvents = [{
                                "id": select[0].id
                            }];
                    }
                } else if (select[0].bpmn === "userTask") {
                    eCooeModel.model.config.data.tasks.push({
                        "id": select[0].id,
                        "baseProperty": {
                            "name": "用户任务",
                            "desc": ""
                        },
                        "type": "TASK",
                        "participantRange": {
                            "type": "1"
                        },
                        "flowActions": [],
                        "appActions": [],
                        "cmtActions": [],
                        "laneId": target.id,
                        "steps": []
                    });
                } else if (select[0].bpmn.indexOf("Gateway") > -1) {
                    var type = "XOR";
                    if (select[0].bpmn === "parallelGateway") {
                        type = "AND";
                    } else if (select[0].bpmn === "inclusiveGateway") {
                        type = "OR";
                    }

                    eCooeModel.model.config.data.tasks.push({
                        "id": select[0].id,
                        "type": type,
                        "flowActions": [],
                        "laneId": target.id
                    });
                }
            }
        };
    },
    /**
     * @description 添加泳道
     */
    _addSwimlane: function() {
        var graph = this.graph,
                parent = graph.getDefaultParent(),
                model = graph.getModel();
        model.beginUpdate();
        try {
            var lane = graph.importCells([this.shap.lane.cell], 0, 0, parent);
            lane[0].id = UUIDjs.create();
            eCooeModel.model.config.data.lanes.push({
                "id": lane[0].id,
                "name": "泳道",
                "desc": ""
            });
        } finally {
            // Updates the display
            model.endUpdate();
        }
    }
});