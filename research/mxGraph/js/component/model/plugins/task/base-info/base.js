/*
 * Copyright (c) 2013, Yunnan Yuan Xin technology Co., Ltd.
 *
 * All rights reserved.
 */
/**
 * @fileoverview 属性配置.
 *
 * @author <a href="mailto:LLY219@gmail.com">Liyuan Li</a>
 * @version 1.0.0.8, Jun 3, 2013
 */
/**
 * @description 获取数据
 */
eCooeModel.model.config.settings.task.baseInfo.base.getData = function() {
    eCooeModel.model.config.settings.task.data.baseProperty.name = $("#taskBaseInfoName").val();
    eCooeModel.model.config.settings.task.data.baseProperty.desc = $("#taskBaseInfoDesc").val();
    var graphModel = model.graph.getModel();
    graphModel.beginUpdate();
    try {
        graphModel.getCellById(eCooeModel.model.config.settings.task.data.id).
                setValue(eCooeModel.model.config.settings.task.data.baseProperty.name);
        model.graph.refresh(graphModel.getCellById(eCooeModel.model.config.settings.task.data.id));
    } finally {
        // Updates the display
        graphModel.endUpdate();
    }
};

/**
 * @description 根据数据设置界面中的值
 * @param {Obj} cell mxGraph 中的 cell 对象
 */
eCooeModel.model.config.settings.task.baseInfo.base.setData = function(cell) {
    var data = eCooeModel.model.config.data.tasks;
    for (var i = 0; i < data.length; i++) {
        if (cell.id === data[i].id) {
            eCooeModel.model.config.settings.task.data = data[i];
            break;
        }
    }

    $("#taskBaseInfoName").val(eCooeModel.model.config.settings.task.data.baseProperty.name);
    $("#taskBaseInfoDesc").val(eCooeModel.model.config.settings.task.data.baseProperty.desc);
    $("#taskDialog").data("id", cell.id);
};