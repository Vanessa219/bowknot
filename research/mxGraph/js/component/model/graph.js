/*
 * Copyright (c) 2013, Yunnan Yuan Xin technology Co., Ltd.
 *
 * All rights reserved.
 */
/**
 * @fileoverview mxGraph 覆写.
 *
 * @author <a href="mailto:LLY219@gmail.com">Liyuan Li</a>
 * @version 1.0.1.4, Jun 3, 2013
 */
/**
 * @description mxGraph 覆写
 * NOTE: 该代码大部分来自 mxGraph，请忽略所有检测
 */
/**
 * Function: dragOver
 * 
 * Implements autoscroll, updates the <currentPoint>, highlights any drop
 * targets and updates the preview.
 */
mxDragSource.prototype.dragOver = function(graph, evt) {
    var offset = mxUtils.getOffset(graph.container);
    var origin = mxUtils.getScrollOrigin(graph.container);
    var x = mxEvent.getClientX(evt) - offset.x + origin.x;
    var y = mxEvent.getClientY(evt) - offset.y + origin.y;

    if (graph.autoScroll && (this.autoscroll == null || this.autoscroll)) {
        graph.scrollPointToVisible(x, y, graph.autoExtend);
    }

    // Highlights the drop target under the mouse
    if (this.currentHighlight != null && graph.isDropEnabled()) {
        this.currentDropTarget = this.getDropTarget(graph, x, y);
        // NOTE: add condition
        if (this.currentDropTarget && this.currentDropTarget.bpmn === "Lane") {
            var state = graph.getView().getState(this.currentDropTarget);
            this.currentHighlight.highlight(state);
        }
    }

    // Updates the location of the preview
    if (this.previewElement != null) {
        if (this.previewElement.parentNode == null) {
            graph.container.appendChild(this.previewElement);

            this.previewElement.style.zIndex = '3';
            this.previewElement.style.position = 'absolute';
        }

        var gridEnabled = this.isGridEnabled() && graph.isGridEnabledEvent(evt);
        var hideGuide = true;

        // Grid and guides
        if (this.currentGuide != null && this.currentGuide.isEnabledForEvent(evt)) {
            // LATER: HTML preview appears smaller than SVG preview
            var w = parseInt(this.previewElement.style.width);
            var h = parseInt(this.previewElement.style.height);
            var bounds = new mxRectangle(0, 0, w, h);
            var delta = new mxPoint(x, y);
            delta = this.currentGuide.move(bounds, delta, gridEnabled);
            hideGuide = false;
            x = delta.x;
            y = delta.y;
        }
        else if (gridEnabled) {
            var scale = graph.view.scale;
            var tr = graph.view.translate;
            var off = graph.gridSize / 2;
            x = (graph.snap(x / scale - tr.x - off) + tr.x) * scale;
            y = (graph.snap(y / scale - tr.y - off) + tr.y) * scale;
        }

        if (this.currentGuide != null && hideGuide) {
            this.currentGuide.hide();
        }

        if (this.previewOffset != null) {
            x += this.previewOffset.x;
            y += this.previewOffset.y;
        }

        this.previewElement.style.left = Math.round(x) + 'px';
        this.previewElement.style.top = Math.round(y) + 'px';
        this.previewElement.style.visibility = 'visible';
    }

    this.currentPoint = new mxPoint(x, y);
};

// Defines an icon for creating new connections in the connection handler.
// This will automatically disable the highlighting of the source vertex.
mxConnectionHandler.prototype.connectImage = new mxImage(eCooeModel.staticServePath + 
        '../images/component/model/connector.gif', 16, 16);

// Enables crisp rendering of swimlanes in SVG
mxSwimlane.prototype.crisp = true;

/**
 * Function: layout
 * 
 * Lays out the parallel edges in the given array.
 */
mxParallelEdgeLayout.prototype.layout = function(parallels) {
    var edge = parallels[0];
    var model = this.graph.getModel();

    var src = model.getGeometry(model.getTerminal(edge, true));
    var trg = model.getGeometry(model.getTerminal(edge, false));
    var srcX = 0;//model.getTerminal(edge, true).getParent().getGeometry().x;
    var srcY = 0;//model.getTerminal(edge, true).getParent().getGeometry().y;
    var trgX = 0;//model.getTerminal(edge, false).getParent().getGeometry().x;
    var trgY = 0;//model.getTerminal(edge, false).getParent().getGeometry().y;

    // Routes multiple loops
    if (src == trg) {
        var x0 = src.x + srcX + src.width + this.spacing;
        var y0 = src.y + srcY + src.height / 2;

        for (var i = 0; i < parallels.length; i++) {
            this.route(parallels[i], x0, y0);
            x0 += this.spacing;
        }
    } else if (src != null && trg != null) {
        // Routes parallel edges
        var scx = src.x + srcX + src.width / 2;
        var scy = src.y + srcY + src.height / 2;

        var tcx = trg.x + trgX + trg.width / 2;
        var tcy = trg.y + trgY + trg.height / 2;

        var dx = tcx - scx;
        var dy = tcy - scy;

        var len = Math.sqrt(dx * dx + dy * dy);

        var x0 = scx + dx / 2;
        var y0 = scy + dy / 2;

        var nx = dy * this.spacing / len;
        var ny = dx * this.spacing / len;

        x0 += nx * (parallels.length - 1) / 2;
        y0 -= ny * (parallels.length - 1) / 2;

        for (var i = 0; i < parallels.length; i++) {
            if (!parallels[i].geometry.points || (parallels[i].geometry.points.length > 0
                    && Math.abs(parallels[i].geometry.points[0].x - x0) < this.spacing)) {
                this.route(parallels[i], x0, y0);
                x0 -= nx;
                y0 += ny;
            }
        }
    }
};

/**
 * Function: insertEdge
 * 
 * Creates, inserts and returns the new edge for the given parameters. This
 * implementation does only use <createEdge> if <factoryMethod> is defined,
 * otherwise <mxGraph.insertEdge> will be used.
 */
mxConnectionHandler.prototype.insertEdge = function(parent, id, value, source, target, style) {
    var edge = {},
            edgeId = UUIDjs.create();

    if (this.factoryMethod == null) {
        edge = this.graph.insertEdge(parent, edgeId, value, source, target, style);
    } else {
        edge = this.createEdge(value, source, target, style);
        edge = this.graph.addEdge(edge, parent, source, target);
    }

    model.isInsertEdge = true;
    eCooeModel.model.config.settings.sequence.data[edgeId] = {
        sourceTaskId: source.id,
        targetTaskId: target.id,
        cell: edge
    };

    if (model.graph.getModel().getTerminal(edge, false).bpmn === "endEvent") {
        edge.value = "结束";
        var tasks = eCooeModel.model.config.data.tasks;
        for (var i = 0; i < tasks.length; i++) {
            if (tasks[i].id === source.id) {
                eCooeModel.model.config.data.tasks[i].flowActions.push({
                    "id": UUIDjs.create(),
                    "sequenceId": edgeId,
                    "name": "结束",
                    "type": "End",
                    "desc": ""
                });
            }
        }
    }

    if (model.graph.getModel().getTerminal(edge, true).bpmn !== "startEvent"
            && model.graph.getModel().getTerminal(edge, false).bpmn !== "endEvent") {
        if (model.graph.getModel().getTerminal(edge, false).bpmn.indexOf("Gateway") > -1
                && model.graph.getModel().getTerminal(edge, true).bpmn.indexOf("Gateway") > -1) {
            edge.value = "";
            var tasks = eCooeModel.model.config.data.tasks;
            for (var i = 0; i < tasks.length; i++) {
                if (tasks[i].id === source.id) {
                    eCooeModel.model.config.data.tasks[i].flowActions.push({
                        "id": UUIDjs.create(),
                        "sequenceId": edgeId,
                        "type": "Gateway"
                    });
                }
            }
        } else {
            model.dialog.sequence.open(function(id) {
                $($("#" + id + " .dialog-footer > button").get(1)).unbind("click").
                        bind("click", function() {
                    model.cancelAddSequence(edge.id);
                });

                $("#" + id + " .dialog-header > .close-ico").unbind("click").bind("click", function() {
                    model.cancelAddSequence(edge.id);
                });

                eCooeModel.model.config.settings.sequence.setData(edge, true);
            });
        }
    }
    return edge;
};

/**
 * Function: getCell
 *
 * Returns the <mxCell> for the specified Id or null if no cell can be
 * found for the given Id.
 *
 * Parameters:
 * 
 * id - A string representing the Id of the cell.
 */
mxGraphModel.prototype.getCellById = function(id) {
    if (this.cells != null) {
        for (var key in this.cells) {
            if (this.cells[key].id === id) {
                return this.cells[key];
            }
        }
    } else {
        return null;
    }
};

/**
 * Function: click
 *
 * Processes a singleclick on an optional cell and fires a <click> event.
 * The click event is fired initially. If the graph is enabled and the
 * event has not been consumed, then the cell is selected using
 * <selectCellForEvent> or the selection is cleared using
 * <clearSelection>. The events consumed state is set to true if the
 * corresponding <mxMouseEvent> has been consumed.
 *
 * Parameters:
 *
 * me - <mxMouseEvent> that represents the single click.
 */
mxGraph.prototype.click = function(me) {
    var evt = me.getEvent();
    var cell = me.getCell();
    var mxe = new mxEventObject(mxEvent.CLICK, 'event', evt, 'cell', cell);
    if (me.isConsumed()) {
        mxe.consume();
    }

    // Handles the event if it has not been consumed
    if (this.isEnabled() && !mxEvent.isConsumed(evt) && !mxe.isConsumed()) {
        if (cell != null) {
            this.selectCellForEvent(cell, evt);
        } else {
            var swimlane = null;
            if (this.isSwimlaneSelectionEnabled()) {
                // Gets the swimlane at the location (includes
                // content area of swimlanes)
                swimlane = this.getSwimlaneAt(me.getGraphX(), me.getGraphY());
            }
            // Selects the swimlane and consumes the event
            if (swimlane != null) {
                this.selectCellForEvent(swimlane, evt);
            }
            // Ignores the event if the control key is pressed
            else if (!this.isToggleEvent(evt)) {
                this.clearSelection();
            }
        }
    }
    this.fireEvent(mxe);
};

/**
 * Function: mouseUp
 * 
 * Handles the event to applying the previewed changes on the edge by
 * using <moveLabel>, <connect> or <changePoints>.
 */
mxEdgeHandler.prototype.mouseUp = function(sender, me) {
    if (this.index != null && this.marker != null) {
        var edge = this.state.cell;

        // Ignores event if mouse has not been moved
        if (me.getX() != this.startX || me.getY() != this.startY) {
            // Displays the reason for not carriying out the change
            // if there is an error message with non-zero length
            if (this.error != null) {
                if (this.error.length > 0) {
                    this.graph.validationAlert(this.error);
                }
            }
            else if (this.isLabel) {
                this.moveLabel(this.state, this.label.x, this.label.y);
            }
            else if (this.isSource || this.isTarget) {
                var terminal = null;

                if (this.constraintHandler.currentConstraint != null &&
                        this.constraintHandler.currentFocus != null) {
                    terminal = this.constraintHandler.currentFocus.cell;
                }

                if (terminal == null && this.marker.hasValidState()) {
                    terminal = this.marker.validState.cell;
                }

                if (terminal != null) {
                    // 移动线条起始位置时，同步修改属性配置数据
                    var reSourceId = edge.source.id,
                            reTargetId = edge.target.id;
                    edge = this.connect(edge, terminal, this.isSource,
                            this.graph.isCloneEvent(me.getEvent()) && this.cloneEnabled &&
                            this.graph.isCellsCloneable(), me);

                    var sourceId = edge.source.id,
                            targetId = edge.target.id;

                    if (reSourceId !== sourceId) {
                        eCooeModel.model.config.settings.sequence.data[edge.id].sourceTaskId = targetId;

                        var tasksData = eCooeModel.model.config.data.tasks,
                                flowData = {};
                        for (var i = 0; i < tasksData.length; i++) {
                            if (tasksData[i].id === reSourceId) {
                                var flowActionsData = tasksData[i].flowActions;
                                for (var j = 0; j < flowActionsData.length; j++) {
                                    if (edge.id === flowActionsData[j].sequenceId) {
                                        flowData = flowActionsData.splice(j, 1);
                                    }
                                }
                            }
                        }


                        for (var i = 0; i < tasksData.length; i++) {
                            if (flowData[0] && tasksData[i].id === sourceId) {
                                tasksData[i].flowActions.push(flowData[0]);
                            }
                        }
                    }

                    if (reTargetId !== targetId) {
                        eCooeModel.model.config.settings.sequence.data[edge.id].targetTaskId = targetId;
                    }
                }
                else if (this.graph.isAllowDanglingEdges()) {
                    var pt = this.abspoints[(this.isSource) ? 0 : this.abspoints.length - 1];
                    pt.x = pt.x / this.graph.view.scale - this.graph.view.translate.x;
                    pt.y = pt.y / this.graph.view.scale - this.graph.view.translate.y;

                    var pstate = this.graph.getView().getState(
                            this.graph.getModel().getParent(edge));

                    if (pstate != null) {
                        pt.x -= pstate.origin.x;
                        pt.y -= pstate.origin.y;
                    }

                    pt.x -= this.graph.panDx / this.graph.view.scale;
                    pt.y -= this.graph.panDy / this.graph.view.scale;

                    // Destroys and rectreates this handler
                    this.changeTerminalPoint(edge, pt, this.isSource);
                }
            }
            else if (this.active) {
                this.changePoints(edge, this.points);
            } else {
                this.graph.getView().invalidate(this.state.cell);
                this.graph.getView().revalidate(this.state.cell);
            }
        }

        // Resets the preview color the state of the handler if this
        // handler has not been recreated
        if (this.marker != null) {
            this.reset();

            // Updates the selection if the edge has been cloned
            if (edge != this.state.cell) {
                this.graph.setSelectionCell(edge);
            }
        }

        me.consume();
    }
};


/**
 * Function: stopEditing
 *
 * Stops the current editing.
 *
 * Parameters:
 *
 * cancel - Boolean that specifies if the current editing value
 * should be stored.
 */
mxGraph.prototype.stopEditing = function(cancel) {
    if (!this.cellEditor) {
        return;
    }
    this.cellEditor.stopEditing(cancel);
};
