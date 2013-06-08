/*
 * Copyright (c) 2013, Yunnan Yuan Xin technology Co., Ltd.
 *
 * All rights reserved.
 */
/**
 * @fileoverview 流程管理.
 *
 * @author <a href="mailto:LLY219@gmail.com">Liyuan Li</a>
 * @version 1.0.0.8, Jun 3, 2013
 */

if (!eCooeModel) {
    var eCooeModel = {};
}
/**
 * @description 流程管理
 * @static
 */
eCooeModel.manager = {
    dialog: {
        process: new Dialog({
            id: "processDialog",
            saveFnt: function() {
                if ($("#processDialog").data("status") === "new") {
                    if ($("#processName").val() === "") {
                        $("#processName").next().show();
                    }

                    if ($("#processCode").val() === "") {
                        $("#processCode").next().show();
                    }

                    if ($("#processName").val() === "" || $("#processCode").val() === "") {
                        return true;
                    }


                    $.ajax({
                        url: webCfg.servePath + "/eCooeModel/pc/manager/define/new",
                        data: {
                            "name": $("#processName").val(),
                            "code": $("#processCode").val(),
                            "sort": $("#processNum").val(),
                            "remark": $("#processRemark").val()
                        },
                        type: "POST",
                        cache: false,
                        error: function(XMLHttpRequest, textStatus, errorThrown) {
                            alert(textStatus);
                            return true;
                        },
                        success: function(data, textStatus) {
                            if (data.succeed) {
                                window.location.reload();
                            } else {
                                alert(data.msg);
                            }
                        }
                    });
                } else {
                    if ($("#processName").val() === "") {
                        $("#processName").next().show();
                    }

                    if ($("#processCode").val() === "") {
                        $("#processCode").next().show();
                    }

                    if ($("#processName").val() === "" || $("#processCode").val() === "") {
                        return true;
                    }


                    $.ajax({
                        url: webCfg.servePath + "/eCooeModel/pc/manager/define/update",
                        data: {
                            "id": $("#processDialog").data("id"),
                            "name": $("#processName").val(),
                            "code": $("#processCode").val(),
                            "sort": $("#processNum").val(),
                            "remark": $("#processRemark").val()
                        },
                        type: "POST",
                        cache: false,
                        error: function(XMLHttpRequest, textStatus, errorThrown) {
                            alert(textStatus);
                            return true;
                        },
                        success: function(data, textStatus) {
                            $(".manager .level").each(function() {
                                if ($(this).data("id") === $("#processDialog").data("id")) {
                                    $(this).find("font").html($("#processName").val());
                                }
                            });
                        }
                    });
                }
            },
            height: 345
        }),
        version: new Dialog({
            id: "versionDialog",
            saveFnt: function() {
                var version = $("#versionNum").val();
                if ($("#versionDialog").data("status") === "new") {
                    $.ajax({
                        url: webCfg.servePath + "/eCooeModel/pc/manager/version/new",
                        data: {
                            "version": version.substring(2, version.length),
                            "state": $("#versionStatus").val(),
                            "remark": $("#versionRemark").val(),
                            "defineId": $("#versionDialog").data("processid")
                        },
                        type: "POST",
                        cache: false,
                        error: function(XMLHttpRequest, textStatus, errorThrown) {
                            alert(textStatus);
                            return true;
                        },
                        success: function(data, textStatus) {
                            if (data.succeed) {
                                window.location.reload();
                            } else {
                                alert(data.msg);
                            }
                        }
                    });
                } else {
                    $.ajax({
                        url: webCfg.servePath + "/eCooeModel/pc/manager/version/update",
                        data: {
                            "id": $("#versionDialog").data("id"),
                            "version": version.substring(2, version.length),
                            "state": $("#versionStatus").val(),
                            "remark": $("#versionRemark").val(),
                            "defineId": $("#versionDialog").data("processid")
                        },
                        type: "POST",
                        cache: false,
                        error: function(XMLHttpRequest, textStatus, errorThrown) {
                            alert(textStatus);
                            return true;
                        },
                        success: function(data, textStatus) {
                            $(".manager .sub-level").each(function() {
                                if ($(this).data("id") === $("#versionDialog").data("id")) {
                                    var state = "发布";
                                    if ($("#versionStatus").val() === "building") {
                                        state = "建设中";
                                    }
                                    $(this).find("td").get(1).innerHTML = state;
                                }
                            });
                        }
                    });
                }
            },
            height: 345
        })
    },
    /**
     * @description 初始化管理器
     */
    init: function() {
        var that = this;

        // button
        $($(".manager > .button").get(0)).click(function() {
            that.dialog.process.open(function() {
                $("#processDialog").data("status", "new");
                $("#processName").val("");
                $("#processCode").val("").removeProp("readonly");
                $("#processName").next().hide();
                $("#processCode").next().hide();
                $("#processNum").val("1");
                $("#processRemark").val("");
            });
        });

        $($(".manager > .button").get(1)).click(function() {
            var isSelected = false;
            $(".manager > table .level").each(function() {
                if ($(this).hasClass("current")) {
                    isSelected = true;
                }
            });

            if (isSelected) {
                that.dialog.version.open(function() {
                    $("#versionDialog").data("status", "new");
                    $("#versionDialog").data("processid", $(".manager > table .current").data("id"));
                    var version = 0;
                    $.ajax({
                        url: webCfg.servePath + "/eCooeModel/pc/manager/version/list",
                        data: {
                            "defineId": $(".manager > table .current").data("id")
                        },
                        type: "GET",
                        cache: false,
                        error: function(XMLHttpRequest, textStatus, errorThrown) {
                            alert(textStatus);
                        },
                        success: function(data, textStatus) {
                            if (data.succeed) {
                                var item = data.data;

                                if (data.data) {
                                    for (var i = 0; i < item.length; i++) {
                                        if (version < item[i].version.flowVersion) {
                                            version = item[i].version.flowVersion;
                                        }
                                    }
                                }
                            }

                            $("#versionNum").val("版本" + (version + 1));
                            $("#versionStatus").val("building");
                            $("#versionUser").val("从 session 中获取");
                            $("#versionTime").val("");
                            $("#versionLastUser").val("");
                            $("#versionLastTime").val("");
                            $("#versionRemark").val("");
                        }
                    });
                });
            } else {
                alert("请先选择流程");
            }
        });

        $($(".manager > .button").get(2)).click(function() {
            var isSelected = false,
                    isVersion = false;
            $(".manager > table .level, .manager > table .sub-level").each(function() {
                if ($(this).hasClass("current")) {
                    isSelected = true;
                    if ($(this).hasClass("sub-level")) {
                        isVersion = true;
                    }
                }
            });

            if (isSelected) {
                if (isVersion) {
                    that.dialog.version.open(function() {
                        $("#versionDialog").data("status", "update");
                        $("#versionDialog").data("id", $(".manager > table .current").data("id"));
                        $.ajax({
                            url: webCfg.servePath + "/eCooeModel/pc/manager/version/get",
                            data: {
                                "id": $(".manager > table .current").data("id")
                            },
                            type: "GET",
                            cache: false,
                            async: false,
                            error: function(XMLHttpRequest, textStatus, errorThrown) {
                                alert(textStatus);
                            },
                            success: function(data, textStatus) {
                                if (data.succeed) {
                                    $("#versionNum").val("版本" + data.data.flowVersion);
                                    $("#versionStatus").val(data.data.state);
                                    $("#versionUser").val(data.data.createUserName);
                                    $("#versionTime").val(data.createTimeStr);
                                    $("#versionLastUser").val(data.data.updateUserName);
                                    $("#versionLastTime").val(data.updateTimeStr);
                                    $("#versionRemark").val(data.data.remark);
                                }
                            }
                        });
                    });
                } else {
                    that.dialog.process.open(function() {
                        $("#processDialog").data("status", "update");
                        $("#processDialog").data("id", $(".manager > table .current").data("id"));
                        $.ajax({
                            url: webCfg.servePath + "/eCooeModel/pc/manager/define/get",
                            data: {
                                "id": $(".manager > table .current").data("id")
                            },
                            type: "GET",
                            cache: false,
                            async: false,
                            error: function(XMLHttpRequest, textStatus, errorThrown) {
                                alert(textStatus);
                            },
                            success: function(data, textStatus) {
                                if (data.succeed) {
                                    $("#processName").val(data.data.name);
                                    $("#processCode").val(data.data.code).prop("readonly", "readonly");
                                    $("#processName").next().hide();
                                    $("#processCode").next().hide();
                                    $("#processNum").val(data.data.sort);
                                    $("#processRemark").val(data.data.remark);
                                }
                            }
                        });
                    });
                }
            } else {
                alert("先选择需要修改的信息");
            }
        });

        $($(".manager > .button").get(3)).click(function() {
            var isSelected = false,
                    isVersion = false;
            if ($(".manager > table .current").length === 1) {
                isSelected = true;
                if ($(".manager > table .current").hasClass("sub-level")) {
                    isVersion = true;
                }
            }

            var isConfirm = false;
            if (isSelected) {
                if (isVersion) {
                    isConfirm = confirm("是否确认删除？");
                } else {
                    $.ajax({
                        url: webCfg.servePath + "/eCooeModel/pc/manager/version/list",
                        data: {
                            "defineId": $(".manager > table .current").data("id")
                        },
                        type: "GET",
                        cache: false,
                        async: false,
                        error: function(XMLHttpRequest, textStatus, errorThrown) {
                            alert(textStatus);
                        },
                        success: function(data, textStatus) {
                            if (data.succeed) {
                                if (data.data && data.data.length > 0) {
                                    alert("该流程下还有版本，不能删除！");
                                } else {
                                    isConfirm = confirm("是否确认删除？");
                                }
                            } else {
                                alert(data.msg);
                            }
                        }
                    });
                }
            } else {
                alert("先选择需要删除的信息");
            }

            if (isConfirm) {
                var url = "/define/del",
                        removeData = {
                    "defineId": $(".manager > table .current").data("id")
                };

                if (isVersion) {
                    url = "/version/del";
                    removeData = {
                        "versionId": $(".manager > table .current").data("id")
                    };
                }

                $.ajax({
                    url: webCfg.servePath + "/eCooeModel/pc/manager" + url,
                    data: removeData,
                    type: "GET",
                    cache: false,
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        alert(textStatus);
                    },
                    success: function(data, textStatus) {
                        if (data.succeed) {
                            window.location.reload();
                        } else {
                            alert(data.msg);
                        }
                    }
                });
            }
        });

        $($(".manager > .button").get(4)).click(function() {
            var isSelected = false,
                    isVersion = false;
            if ($(".manager > table .current").length === 1) {
                isSelected = true;
                if ($(".manager > table .current").hasClass("sub-level")) {
                    isVersion = true;
                }
            }

            if (isSelected && !isVersion || !isSelected) {
                alert("请先选择流程的某一版本");
            } else {
                window.open(webCfg.servePath + "/pc/test/model?versionId=" +
                        $(".manager > table .current").data("id") + "&name=" +
                        encodeURIComponent($($(".manager > table .current").parents("table")[0])
                        .parent().parent().prev().find("font").text()));
            }
        });

        // select
        $(".manager > table tr.sub-level, .manager > table tr.level").click(function() {
            $(".manager > table tr").removeClass("current");
            $(this).addClass("current");
        });


        // 收展
        $(".plus-ico").click(function() {
            var that = this;
            if (that.className === "add-ico") {
                that.className = "plus-ico";
                if (!$(that).parent().parent().next().hasClass("level")) {
                    $(that).parent().parent().next().remove();
                }
            } else {
                that.className = "add-ico";
                // get sub level
                $.ajax({
                    url: webCfg.servePath + "/eCooeModel/pc/manager/version/list",
                    data: {
                        "defineId": $(that).parent().parent().data("id")
                    },
                    type: "GET",
                    cache: false,
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        alert(textStatus);
                    },
                    success: function(data, textStatus) {
                        if (data.succeed) {
                            var item = data.data,
                                    subLevelHTML = '<tr><td colspan="6">' +
                                    '<table width="100%" cellpadding="0" cellspacing="0">';

                            if (!data.data) {
                                return;
                            }

                            for (var i = 0; i < item.length; i++) {
                                subLevelHTML += '<tr class="sub-level" data-id="' + item[i].version.id + '">' +
                                        '<td style="padding-left: 40px;">版本' +
                                        item[i].version.flowVersion +
                                        '</td>' +
                                        '<td width="150px">' +
                                        (item[i].version.state === "building" ? "建设中" : "发布") +
                                        '</td>' +
                                        '<td width="150px">' + item[i].version.createUserName + '</td>' +
                                        '<td width="200px">' + item[i].createTimeStr + '</td>' +
                                        '<td width="150px">' + item[i].version.updateUserName + '</td>' +
                                        '<td width="200px">' + item[i].updateTimeStr + '</td>' +
                                        '</tr> ';
                            }
                            subLevelHTML += "</table></td></tr>";
                            $(that).parent().parent().after(subLevelHTML);

                            $(".manager > table tr.sub-level, .manager > table tr.level").
                                    unbind("click").click(function() {
                                $(".manager > table tr").removeClass("current");
                                $(this).addClass("current");
                            });
                        }
                    }
                });
            }
        });
    }
};

(function() {
    eCooeModel.manager.init();
    if ($.browser.msie) {
        $("body").html("请使用 Firefox / Chrome");
    }
})();

