/*
 * Copyright (c) 2013, Yunnan Yuan Xin technology Co., Ltd.
 *
 * All rights reserved.
 */
/**
 * @fileoverview 属性配置.
 *
 * @author <a href="mailto:LLY219@gmail.com">Liyuan Li</a>
 * @version 1.0.0.4, May 15, 2013
 */
/**
 * @description 获取数据
 */
eCooeModel.model.config.settings.flow.baseInfo.base.getData = function() {
    var data = eCooeModel.model.config.data.property.baseProperty;
    data.name = $("#flowBaseInfoName").val();
    data.desc = $("#flowBaseInfoDesc").val();
};

/**
 * @description 根据数据设置界面中的值
 */
eCooeModel.model.config.settings.flow.baseInfo.base.setData = function() {
    var data = eCooeModel.model.config.data.property.baseProperty;
    $("#flowBaseInfoName").val(data.name);
    $("#flowBaseInfoDesc").val(data.desc);
};