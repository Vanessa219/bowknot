/*
 * Copyright (c) 2013, Yunnan Yuan Xin technology Co., Ltd.
 *
 * All rights reserved.
 */
/**
 * @fileoverview 可编辑列表.
 *
 * @author <a href="mailto:LLY219@gmail.com">Liyuan Li</a>
 * @version 1.0.1.5, Jun 3, 2013
 */
/**
 * @description 编辑列表
 * @param {Obj} obj 对象参数
 */
var EditList = function(obj) {
    this.id = obj.id;
    this.actions = obj.actions;
    this._init();
};
$.extend(EditList.prototype, {
    /**
     * @description 初始化
     */
    _init: function() {
        this._bindEvent();
        this._checkAction();
    },
    /**
     * @description 多选框事件
     */
    _checkAction: function() {
        var id = this.id;
        $("#" + id + "Table").click(function(event) {
            if ($(event.target).attr("type") === "checkbox" && !$(event.target).attr("id")) {
                var checkedNum = $("#" + id + "Table tr:not(:first) input[type='checkbox']:checked").
                        length;
                if (checkedNum === 0) {
                    $("#" + id + "Allchecked").removeProp("checked");
                } else if (checkedNum === $("#" + id + "Table tr:not(:first)").length) {
                    $("#" + id + "Allchecked").prop("checked", true);
                }
            }
        });
    },
    /**
     * @description 绑定事件
     */
    _bindEvent: function() {
        for (var key in this.actions) {
            if (key === "remove") {
                this[key](this.actions[key].after, this.actions[key].before);
            } else {
                this[key]();
            }
        }
    },
    /**
     * @description 添加行
     */
    add: function() {
        var that = this;
        var id = that.id;
        var addData = that.actions.add.col;
        $("#" + id + "Add").click(function() {
            var trHTML = "<tr data-id='" + UUIDjs.create() + "'>"
                    + "<td><input type='checkbox'/></td>"
                    + "<td>" + $("#" + that.id + "Table tr").length + "</td>";
            for (var q = 0; q < addData.length; q++) {
                if (addData[q].type === "text") {
                    trHTML += "<td><input type='" + addData[q].type + "'/></td>";
                } else if (addData[q].type === "select") {
                    var selectData = addData[q].data;
                    trHTML += "<td><select>";
                    for (var i = 0; i < selectData.length; i++) {
                        trHTML += "<option value='" + selectData[i].value + "'>" +
                                selectData[i].text + "</option>";
                    }
                    trHTML += "</select></td>";
                }
            }
            trHTML += "</tr>";
            $("#" + id + "Table tr").last().after(trHTML);
        });
    },
    /**
     * @description 全选
     */
    checkedAll: function() {
        var id = this.id;
        $("#" + id + "Allchecked").click(function() {
            if (this.checked) {
                $("#" + id + "Table td input[type='checkbox']").each(function() {
                    $(this).prop("checked", true);
                });
            } else {
                $("#" + id + "Table td input[type='checkbox']").each(function() {
                    $(this).prop("checked", false);
                });
            }
        });
    },
    /**
     * @description 删除行
     * @param {Function} afterFun 删除完成回调事件
     * @param {Function} beforeFun 删除前回调事件
     */
    remove: function(afterFun, beforeFun) {
        var id = this.id;
        $("#" + id + "Remove").click(function() {
            var ids = [];
            $("#" + id + "Table td input[type='checkbox']").each(function() {
                if ($(this).prop("checked")) {
                    ids.push($(this).parent().parent());
                }
            });
            if (ids.length > 0) {
                if (confirm("是否删除选中的信息")) {
                    for (var i = 0; i < ids.length; i++) {
                        if (beforeFun) {
                            if (!beforeFun($(ids[i]).data("id"))) {
                                return;
                            }
                        }

                        ids[i].remove();


                        if (afterFun) {
                            afterFun($(ids[i]).data("id"));
                        }
                    }

                    // update sort
                    $("#" + id + "Table tr:not(:first)").each(function(i) {
                        $(this).find("td").get(1).innerHTML = i + 1;
                    });
                }
            } else {
                alert("请选择至少一条信息");
            }
        });
    },
    /**
     * @description 向上移动
     */
    up: function() {
        var id = this.id;
        $("#" + id + "Up").click(function() {
            var ids = [];
            $("#" + id + "Table td input[type='checkbox']").each(function() {
                if ($(this).prop("checked")) {
                    ids.push($(this).parent().parent());
                }
            });

            if (ids.length !== 1) {
                alert("请选择一条信息");
                return;
            }

            if (parseInt($(ids[0]).find("td").get(1).innerHTML) === 1) {
                return;
            }

            var currentIndex = parseInt($(ids[0]).find("td").get(1).innerHTML);
            $(ids[0]).find("td").get(1).innerHTML = currentIndex - 1;
            $(ids[0]).prev().find("td").get(1).innerHTML = currentIndex;
            $($("#" + id + "Table tr").get(currentIndex)).after($($("#" + id + "Table tr").
                    get(currentIndex - 1)));
        });
    },
    /**
     * @description 向下移动
     */
    down: function() {
        var id = this.id;
        $("#" + id + "Down").click(function() {
            var ids = [];
            $("#" + id + "Table td input[type='checkbox']").each(function() {
                if ($(this).prop("checked")) {
                    ids.push($(this).parent().parent());
                }
            });

            if (ids.length !== 1) {
                alert("请选择一条信息");
                return;
            }

            if (parseInt($(ids[0]).find("td").get(1).innerHTML) >= $("#" + id + "Table tr").length - 1) {
                return;
            }

            var currentIndex = parseInt($(ids[0]).find("td").get(1).innerHTML);
            $(ids[0]).find("td").get(1).innerHTML = currentIndex + 1;
            $(ids[0]).next().find("td").get(1).innerHTML = currentIndex;
            $($("#" + id + "Table tr").get(currentIndex + 1)).after($($("#" + id + "Table tr").
                    get(currentIndex)));
        });
    }
});