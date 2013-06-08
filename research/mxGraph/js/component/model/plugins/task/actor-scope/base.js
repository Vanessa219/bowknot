/*
 * Copyright (c) 2013, Yunnan Yuan Xin technology Co., Ltd.
 *
 * All rights reserved.
 */
/**
 * @fileoverview 属性配置.
 *
 * @author <a href="mailto:LLY219@gmail.com">Liyuan Li</a>
 * @version 1.0.1.2, Jun 3, 2013
 */
/**
 * @description 获取数据
 */
eCooeModel.model.config.settings.task.actorScope.base.getData = function() {

    var data = {
        "type": $('input[name="taskActorScpoeBase"]:checked').val(),
        "include": [],
        "exclude": []
    };

    if (data.type === "2") {
        $(".actor-scope-box ul").each(function(i) {
            if (i === 0) {
                $(this).find("li").each(function() {
                    data.include.push($(this).data("string"));
                });
            } else {
                $(this).find("li").each(function() {
                    data.exclude.push($(this).data("string"));
                });
            }
        });
    } else {
        $(".actor-scope-box li").remove();
    }

    eCooeModel.model.config.settings.task.data.participantRange = data;
};

/**
 * @description 根据数据设置界面中的值
 */
eCooeModel.model.config.settings.task.actorScope.base.setData = function() {
    eCooeModel.model.config.settings.task.actorScope.base.tempData = {};
    $.extend(true, eCooeModel.model.config.settings.task.actorScope.base.tempData, 
    eCooeModel.model.config.settings.task.data.participantRange);

    var data = eCooeModel.model.config.settings.task.actorScope.base.tempData;

    $('input[name="taskActorScpoeBase"][value="' + data.type + '"]').prop("checked", true);

    var getStrings = function(item) {
        var string = "<li data-string='" + JSON.stringify(item) + "'>";
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
        } else {
            var users = item.users;
            if (users && users.length > 0) {
                string += "人员（";
                for (var k = 0; k < users.length; k++) {
                    string += users[k].name + "、";
                }
            }
        }

        return string.substr(0, string.length - 1) + "）</li>";
    };

    if (data.type === "2") {
        var includeHTML = "";
        if (data.include) {
            for (var i = 0; i < data.include.length; i++) {
                includeHTML += getStrings(data.include[i]);
            }
        }

        var excludeHTML = "";
        if (data.exclude) {
            for (var j = 0; j < data.exclude.length; j++) {
                excludeHTML += getStrings(data.exclude[j]);
            }
        }

        $(".actor-scope-box ul").get(0).innerHTML = includeHTML;
        $(".actor-scope-box ul").get(1).innerHTML = excludeHTML;

        if (excludeHTML === "" && includeHTML === "") {
            $("#taskActorScpoeBaseTip").show();
        } else {
            $("#taskActorScpoeBaseTip").hide();
        }
        $("#taskActorScpoeBaseChoose").removeProp("disabled");
        $("#taskActorScpoeBaseClear").removeProp("disabled");
    } else {
        $("#taskActorScpoeBaseChoose").prop("disabled", true);
        $("#taskActorScpoeBaseClear").prop("disabled", true);

        $(".actor-scope-box ul").get(0).innerHTML = "";
        $(".actor-scope-box ul").get(1).innerHTML = "";
    }

};

/**
 * @description 初始化页面中的关联事件
 */
eCooeModel.model.config.settings.task.actorScope.base.init = function() {
    $('input[name="taskActorScpoeBase"]').click(function() {
        if (this.value === "2" && $(".actor-scope-box li").length === 0) {
            $("#taskActorScpoeBaseTip").show();
        } else {
            $("#taskActorScpoeBaseTip").hide();
        }


        if (this.value === "1") {
            $("#taskActorScpoeBaseChoose").prop("disabled", true);
            $("#taskActorScpoeBaseClear").prop("disabled", true);
        } else {
            $("#taskActorScpoeBaseChoose").removeProp("disabled");
            $("#taskActorScpoeBaseClear").removeProp("disabled");
        }
    });

    var dialog = new Dialog({
        id: "participantDialog",
        height: 360,
        width: 660,
        saveFnt: function() {
            var participantRange = eCooeModel.plugins.chooseUser.getData("participantDialog");
            eCooeModel.model.config.settings.task.actorScope.base.tempData.include = participantRange.include;
            eCooeModel.model.config.settings.task.actorScope.base.tempData.exclude = participantRange.exclude;
            var data = eCooeModel.model.config.settings.task.actorScope.base.tempData;

            var getStrings = function(item) {
                var string = "<li data-string='" + JSON.stringify(item) + "'>";
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
                } else {
                    var users = item.users;
                    if (users && users.length > 0) {
                        string += "人员（";
                        for (var k = 0; k < users.length; k++) {
                            string += users[k].name + "、";
                        }
                    }
                }

                return string.substr(0, string.length - 1) + "）</li>";
            };

            var includeHTML = "";
            if (data.include) {
                for (var i = 0; i < data.include.length; i++) {
                    includeHTML += getStrings(data.include[i]);
                }
            }

            var excludeHTML = "";
            if (data.exclude) {
                for (var j = 0; j < data.exclude.length; j++) {
                    excludeHTML += getStrings(data.exclude[j]);
                }
            }

            $(".actor-scope-box ul").get(0).innerHTML = includeHTML;
            $(".actor-scope-box ul").get(1).innerHTML = excludeHTML;


            if (includeHTML !== "" || excludeHTML !== "") {
                $("#taskActorScpoeBaseTip").hide();
            } else {
                $("#taskActorScpoeBaseTip").show();
            }
        }
    });

    $("#taskActorScpoeBaseChoose").click(function() {
        dialog.open(function() {
            var data = eCooeModel.model.config.settings.task.actorScope.base.tempData;
            eCooeModel.plugins.chooseUser.setData("participantDialog", data);
        });
    });

    $("#taskActorScpoeBaseClear").click(function() {
        $(".actor-scope-box li").remove();
        $("#taskActorScpoeBaseTip").show();
        eCooeModel.model.config.settings.task.actorScope.base.tempData.include = [];
        eCooeModel.model.config.settings.task.actorScope.base.tempData.exclude = [];
    });
};