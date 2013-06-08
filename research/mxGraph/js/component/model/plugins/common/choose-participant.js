/*
 * Copyright (c) 2013, Yunnan Yuan Xin technology Co., Ltd.
 *
 * All rights reserved.
 */
/**
 * @fileoverview 选人发送.
 *
 * @author <a href="mailto:LLY219@gmail.com">Liyuan Li</a>
 * @version 1.0.0.9, Jun 3, 2013
 */

/**
 * @description 选人发送
 * @static
 */
eCooeModel.plugins = {
    "chooseUser": {
        /**
         * @description 初始化
         * @param {String} id 该组件的唯一标识
         */
        "init": function(id) {
            // 类型选择
            $("#" + id + " input[type=radio]").change(function() {
                if (this.value === "1") {
                    $("#" + id + " .user-tree").hide();
                    $("#" + id + " .org-panel").show();
                } else {
                    $("#" + id + " .user-tree").show();
                    $("#" + id + " .org-panel").hide();
                }
            });

            // 选择角色
            $("#" + id + " .select-ico").click(function() {
                $("#" + id + " .role-tree").slideToggle();
            });

            $("#" + id + " .role-tree .add-ico").click(function() {
                if (this.className === "add-ico") {
                    $(this).parent().find("ul").hide();
                    this.className = "plus-ico";
                } else {
                    $(this).parent().find("ul").show();
                    this.className = "add-ico";
                }
            });

            // 选择角色面板
            $("#" + id + " .role-tree li").click(function() {
                var $it = $(this);
                $("#" + id + " .role-tree").hide();
                $("#" + id + " .commonChooseUserRole").val($it.text()).data("code", $it.data("code"));
            });

            // 清空角色
            $("#" + id + " .commonChooseUserClearRole").click(function() {
                $("#" + id + " .commonChooseUserRole").val("").removeData("code");
            });

            // 选择机构
            $("#" + id + " .org-tree input, #" + id + " .user-tree input").click(function() {
                if (this.checked) {
                    $(this).parent().addClass("current");
                } else {
                    $(this).parent().removeClass("current");
                }
            });

            $("#" + id + " .org-tree .add-ico, #" + id + " .org-tree .plus-ico, #" + id +
                    " .user-tree .add-ico, #" + id + " .user-tree .plus-ico").click(function() {
                if (this.className === "add-ico") {
                    this.className = "plus-ico";
                    $(this).parent().next().hide();
                } else {
                    this.className = "add-ico";
                    $(this).parent().next().show();
                }
            });


            // 授权 & 排除
            var getData = function(type) {
                var obj = undefined,
                        string = "";
                if ($("#" + id + " input[type=radio]:checked").val() === "1") {
                    var roleName = $("#" + id + " .commonChooseUserRole").val();
                    obj = {
                        "orgRoles": {
                            "role": {
                                "code": $("#" + id + " .commonChooseUserRole").data("code"),
                                "name": roleName
                            },
                            "orgs": []
                        }
                    };

                    $("#" + id + " .org-tree input:checked").each(function() {
                        obj.orgRoles.orgs.push({
                            "code": $(this).parent().data("code"),
                            "name": $(this).next().text(),
                            "type": "1"
                        });
                    });

                    if (roleName !== "") {
                        string += "角色（" + roleName + "）";
                    }

                    if (obj.orgRoles.orgs.length > 0) {
                        string += "机构（";
                        for (var i = 0; i < obj.orgRoles.orgs.length; i++) {
                            string += obj.orgRoles.orgs[i].name + "、";
                        }

                        string = string.substr(0, string.length - 1) + "）";
                    }
                } else {
                    obj = {
                        "users": []
                    };

                    $("#" + id + " .user-tree input:checked").each(function() {
                        obj.users.push({
                            "code": $(this).parent().data("code"),
                            "name": $(this).next().text()
                        });
                    });

                    for (var i = 0; i < obj.users.length; i++) {
                        string += obj.users[i].name + "、";
                    }

                    string = string.substr(0, string.length - 1);
                }

                if (string === "") {
                    alert("请选择");
                } else {
                    var $bom = $("<li><span class='" + type + "-ico'></span>" + string + "</li>");
                    $bom.data("obj", obj);
                    $("#" + id + " .right-panel ul").append($bom);
                }
            };


            $($("#" + id + " .middle-panel > button").get(0)).click(function() {
                getData("include");
            });

            $($("#" + id + " .middle-panel > button").get(1)).click(function() {
                getData("exclude");
            });

            // 删除
            $($("#" + id + " .middle-panel > button").get(2)).click(function() {
                var $current = $("#" + id + " .right-panel li.current");
                if ($current.length === 1) {
                    $current.remove();
                } else {
                    alert("请选择");
                }
            });

            // 选择列表
            $("#" + id + " .right-panel ul").click(function(event) {
                if (event.target.nodeName.toLowerCase() === "li") {
                    if (event.target.className === "current") {
                        return;
                    }
                    $("#" + id + " .right-panel li").removeClass("current");
                    event.target.className = "current";
                }
            });

            eCooeModel.plugins.chooseUser.setData(id);
        },
        /**
         * @description 获取值
         * @param {String} id 该组件的唯一标识
         * @returns {Obj} 选择的最后结果
         */
        getData: function(id) {
            var data = {
                "include": [],
                "exclude": []
            };
            $("#" + id + " .right-panel li").each(function() {
                if ($(this).find("span").hasClass("include-ico")) {
                    data.include.push($(this).data("obj"));
                } else {
                    data.exclude.push($(this).data("obj"));
                }
            });

            return data;
        },
        /**
         * @description 设置默认值
         * @param {String} id 该组件的唯一标识
         * @param {Obj} data 已选数据
         */
        setData: function(id, data) {
            $('input[name="commonChooseUserType"][value="1"]').prop("checked", "checked");
            $("#" + id + " .user-tree").hide();
            $("#" + id + " .org-panel").show();

            $("#" + id + " .commonChooseUserRole").val("").data("code", "");

            $("#" + id + " .org-tree input, #" + id + " .user-tree input").each(function() {
                $(this).removeProp("checked");
                $(this).parent().removeClass("current");
            });

            $("#" + id + " .right-panel li").remove();

            if (data) {

                var getStrings = function(item, type) {
                    var string = "<li data-obj='" + JSON.stringify(item) + "'><span class='" +
                            type + "-ico'></span>";
                    if (item.orgRoles) {
                        if (item.orgRoles.role && item.orgRoles.role.name !== "") {
                            string += "角色（" + item.orgRoles.role.name + "）";
                        }
                        if (item.orgRoles.orgs && item.orgRoles.orgs.length > 0) {
                            string += " 机构（";
                            var orgs = item.orgRoles.orgs;
                            for (var j = 0; j < orgs.length; j++) {
                                string += orgs[j].name + "、";
                            }
                        }
                        return string.substr(0, string.length - 1) + "）</li>";
                    } else {
                        var users = item.users;
                        if (users && users.length > 0) {
                            for (var k = 0; k < users.length; k++) {
                                string += users[k].name + "、";
                            }
                        }
                        return string.substr(0, string.length - 1) + "</li>";
                    }
                };

                if (data.include) {
                    for (var i = 0; i < data.include.length; i++) {
                        $("#" + id + " .right-panel ul").append(getStrings(data.include[i], "include"));
                    }
                }

                if (data.exclude) {
                    for (var j = 0; j < data.exclude.length; j++) {
                        $("#" + id + " .right-panel ul").append(getStrings(data.exclude[j], "exclude"));
                    }
                }
            }
        }
    }
};
