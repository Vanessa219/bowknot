/*
 * Copyright (c) 2013, Yunnan Yuan Xin technology Co., Ltd.
 *
 * All rights reserved.
 */
/**
 * @fileoverview 属性配置.
 *
 * @author <a href="mailto:LLY219@gmail.com">Liyuan Li</a>
 * @version 1.0.0.4, Jun 3, 2013
 */
/**
 * @description 获取数据
 */
eCooeModel.model.config.settings.flow.flowVariable.base.getData = function() {
    var data = eCooeModel.model.config.data.property.variables = [];
    $("#flowFlowVariableTable tr:not(:first)").each(function(i) {
        var obj = {};
        obj.varName = $($(this).find("td").get(2)).find("input").val();
        obj.varId = $($(this).find("td").get(3)).find("input").val();

        obj.kind = $($(this).find("td").get(4)).find("select").val();

        if (obj.kind === "0") {
            obj.type = $($(this).find("td").get(5)).find("select").val();

            if (obj.type === "boolean") {
                obj.defaultValue = $($(this).find("td").get(6)).find("select").val();
            } else {
                obj.defaultValue = $($(this).find("td").get(6)).find("input").val();
            }
        } else {
            obj.type = "ou";
            obj.defaultValue = $($(this).find("td").get(6)).find("input").val();
        }


        obj.desc = $($(this).find("td").get(7)).find("input").val();

        data.push(obj);
    });
};

/**
 * @description 根据数据设置界面中的值
 */
eCooeModel.model.config.settings.flow.flowVariable.base.setData = function() {
    if (!eCooeModel.model.config.data.property.variables) {
        eCooeModel.model.config.data.property.variables = [];
    }

    var data = eCooeModel.model.config.data.property.variables,
            trHTML = "";
    $("#flowFlowVariableTable tr:not(:first)").remove();

    for (var i = 0; i < data.length; i++) {
        trHTML += "<tr>" +
                "<td><input type='checkbox'/></td>" +
                "<td>" + (i + 1) + "</td>" +
                "<td><input type='text' value='" + data[i].varName + "'/></td>" +
                "<td><input type='text' value='" + data[i].varId + "'/></td>";

        if (data[i].kind === "0") {
            trHTML += "<td><select><option selected='selected' value='0'>常规变量</option>" +
                    "<option value='1'>机构变量</option></select></td>";
            if (data[i].type === "boolean") {
                trHTML += "<td><select><option selected='selected' value='boolean'>布尔型</option>" +
                        "<option value='string'>字符型</option><option value='text'>长文本</option>" +
                        "</select></td>";

                if (data[i].defaultValue === "true") {
                    trHTML += "<td><select><option selected='selected' value='true'>true</option>" +
                            "<option value='false'>false</option></select></td>";
                } else {
                    trHTML += "<td><select><option value='true'>true</option>" +
                            "<option selected='selected' value='false'>false</option></select></td>";
                }
            } else {
                if (data[i].type === "string") {
                    trHTML += "<td><select><option value='boolean'>布尔型</option>" +
                            "<option selected='selected' value='string'>字符型</option>" +
                            "<option value='text'>长文本</option></select></td>";
                } else if (data[i].type === "text") {
                    trHTML += "<td><select><option value='boolean'>布尔型</option>" +
                            "<option value='string'>字符型</option>" +
                            "<option selected='selected' value='text'>长文本</option></select></td>";
                }
                trHTML += "<td><input type='text' value='" + data[i].defaultValue + "'/></td>";
            }
        } else {
            trHTML += "<td><select><option value='0'>常规变量</option>" +
                    "<option selected='selected' value='1'>机构变量</option></select></td>"
                    + "<td>---</td>"
                    + "<td><input type='text' value='" + data[i].defaultValue + "'/></td>";
        }

        trHTML += "<td><input type='text' value='" + data[i].desc + "'/></td>"
                + "</tr>";
    }
    $("#flowFlowVariableTable tr").last().after(trHTML);
};

/**
 * @description 初始化页面中的关联事件
 */
eCooeModel.model.config.settings.flow.flowVariable.base.init = function() {
    new EditList({
        "id": "flowFlowVariable",
        "actions": {
            "checkedAll": {},
            "remove": {},
            "up": {},
            "down": {},
            "add": {
                "col": [{
                        "type": "text"
                    }, {
                        "type": "text"
                    }, {
                        "type": "select",
                        "data": [{
                                "text": "常规变量",
                                "value": "0"
                            }, {
                                "text": "机构变量",
                                "value": "1"
                            }
                        ]
                    }, {
                        "type": "select",
                        "data": [{
                                "text": "布尔型",
                                "value": "boolean"
                            }, {
                                "text": "字符型",
                                "value": "string"
                            }, {
                                "text": "长文本",
                                "value": "text"
                            }
                        ]
                    }, {
                        "type": "select",
                        "data": [{
                                "text": "true",
                                "value": "true"
                            }, {
                                "text": "false",
                                "value": "false"
                            }
                        ]
                    }, {
                        "type": "text"
                    }]
            }
        }
    });


    $("#flowFlowVariableTable").click(function(event) {
        if (event.target.tagName.toLowerCase() === "select") {
            var $target = $(event.target);
            $target.unbind("change").change(function() {
                var $it = $(this);
                if ($it.val() === "0" || $it.val() === "1") {
                    if ($it.val() === "0") {
                        $it.parent().next().html("<select>" +
                                "<option selected='selected' value='boolean'>布尔型</option>" +
                                "<option value='string'>字符型</option><option value='text'>长文本</option>" +
                                "</select>");
                        $it.parent().next().next().html("<select>" +
                                "<option selected='selected' value='true'>true</option>" +
                                "<option value='false'>false</option></select>");
                    } else {
                        $it.parent().next().html("---");
                        $it.parent().next().next().html("<input type='text'/>");
                    }
                }

                if ($it.val() === "boolean" || $it.val() === "text" || $it.val() === "string") {
                    if ($it.val() === "boolean") {
                        $it.parent().next().html("<select>" +
                                "<option selected='selected' value='true'>true</option>" +
                                "<option value='false'>false</option></select>");
                    } else {
                        $it.parent().next().html("<input type='text'/>");
                    }

                }
            });
        }
    });
};