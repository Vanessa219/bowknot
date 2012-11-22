/**
 * @fileoverview 待办列表相关处理.
 *
 * @author <a href="mailto:LLY219@gmail.com">Liyuan Li</a>
 * @version 1.0.1.0, Nov 21, 2012
 */

/**
 * @description 待办列表 
 * @static
 */
var ToDoList = {
    _data: {},
    /**
     * @description 生成顶部统计按钮
     * @param {Array} data 统计数据
     */
    _genCount: function (data) {
        if (!data) {
            return;
        }
        
        var countHTML = "";
        for (var i = 0; i < data.length; i++) {
            var currentClass = "";
            if (i === 0) {
                currentClass = " current";
            }
            
            if (data[i].count !== "0") {
                countHTML += "<span class='btn" + currentClass + "'><span class='m'><span class='ico-" 
                + data[i].id + "'></span>" 
                + data[i].text + "</span><span class='r'></span></span>";
            }
            
            if (i === 1 && (data[0].count !== "0" || data[1].count !== "0")) {
                countHTML += '<span class="ico-split2"></span>';
            }
        }
        $("#countBtns").html(countHTML);
        
        // 顶部筛选按钮事件绑定
        var $countBtns = $("#countBtns > span");
        $countBtns.click(function () {
            $countBtns.removeClass("current");
            $(this).addClass("current");
        });
    },
    
    /**
     * @description 生成列表 
     * @param {Array} data 列表数据
     */
    _genList: function (data) {
        var treeHTML = "";
        for (var i = 0; i < data.length; i++) {
            var childData = data[i].map;
            
            if (childData[0].map) {
                // 三级
                var expandedAll = false,
                secondHTML = "";
                for (var j = 0; j < childData.length; j++) {
                    secondHTML += "<div class='second-level'><span onclick='ToDoList.toggleSecond(this, \"node-" 
                    + i + "-" + j + "\");ToDoList.setToggleStatus(" + i + "," + childData.length + ");' ><span id='toggle-" 
                    + i + "-" + j + "' class='ico-" + (childData[j].expanded ? "open" : "close") + "'></span>"
                    + childData[j].text + "</span></div>";
                    secondHTML += this._genNodeItem(childData[j].map, childData[j].expanded, i, j);
                    
                    if (childData[j].expanded) {
                        expandedAll = true;
                    }
                }
                treeHTML += "<div class='first-level fn-clear'><span onclick='ToDoList.toggleThird(this," 
                + i + "," + childData.length + ")'><span id='toggle-" 
                + i + "' class='ico-" + (expandedAll ? "open" : "close") + "'></span>" 
                + data[i].text + "</span></div>" + secondHTML;
            } else {
                // 两级
                treeHTML += "<div class='second-level'><span onclick='ToDoList.toggleSecond(this, \"node-" 
                + i + "\")' ><span  id='toggle-" 
                + i + "' class='ico-" + (data[i].expanded ? "open" : "close") + "'></span>" + data[i].text + "</span></div>";
                treeHTML += this._genNodeItem(data[i].map, data[i].expanded, i);
            }
        }
        
        if (treeHTML === "") {
            treeHTML = '<div class="no-list">您当前没有待办</div>';
        }
        
        $("#list").html(treeHTML);
    },
    
    /**
     * @description 生成子节点数据
     * @param {Object} data 子节点数据
     * @param {Boolean} expanded 当前层级的展开状况
     * @param {Int} firstId 二级时第一层的唯一标识
     * @param {Int} [secondId] 三级时第二层的唯一标识
     */
    _genNodeItem: function (data, expanded, firstId, secondId) {
        var display = expanded ? "" : " style='display:none'";
        
        var nodeHTML = "<table" + display + " class='list-node' id='node-" + firstId
        + (typeof(secondId) !== "undefined" ? "-" + secondId : "") + "' cellspacing='0' cellpadding='0'>";
        for (var i= 0; i < data.length; i++) {
            var readedStyle = "";
            if (data[i].visitedStatus === "0") {
                readedStyle = " style='font-weight:bold'";
            }
            nodeHTML += "<tr><td><div" + readedStyle + " id='item-" 
            + firstId + (typeof(secondId) !== "undefined" ? "-" + secondId : "") + "-" + i 
            + "' onclick='ToDoList.open(this)' class='title'>"
            + data[i].titleHTML + "</div></td>"
            + "<td" + (i === 0 ? " width='96'" : "") + ">"
            + data[i].senderName + "<img id='zaixian_" + data[i].id + "' "
            + "onfocusout='IMNHideOOUI()' onfocusin='IMNShowOOUIKyb()' " 
            + "onmouseout='IMNHideOOUI()' onmouseover='IMNShowOOUIMouse()' " 
            + "src='" + oaweb.staticURL + "/js/lib/images/LyncImg/imnoff.gif' onload='IMNRC(\"" + data[i].lyncId + "\",this)'></td>"
            + "<td" + (i === 0 ? " width='96'" : "") + ">" + data[i].createdTimeStr + "</span>"
            + "</td></tr>";
        }
        nodeHTML += "</table>";
        
        return nodeHTML;
    },
    
    /**
     * @description 页面初始化
     */
    init: function () {
        var it = this;
        it._buildListAndBtns("/oaweb/shouye/newui/newtodolist.GetTodolist", {});
        
        // 刷新按钮
        $("#refreshBtn").click(function () {
            ToDoList.refresh();
        });
        
        // 分组面板
        var $groupTip = $("#groupTip"),
        $groupBtn = $("#groupBtn");
        // 分钟面板初始化
        if (todoGroupType === 1) {
            $groupBtn.find("span.m").width(64).html('<span class="ico-arrow"></span>时间分组');
            $groupTip.css("right", "3px");
            $groupTip.find("li").find("span").css("background-image", "none");
            $($groupTip.find("li").find("span").get(1)).css("background-image", "url(" + oaweb.staticURL + "/themes/layout4/images/new-todo-list.png)");
        }
        // 分组面板事件
        $(window).click(function () {
            $groupTip.hide();
            $groupBtn.removeClass("current");
        })
        $groupBtn.click(function (event) {
            $groupTip.show();
            $groupBtn.addClass("current");
            event.stopPropagation();
        });
        $groupTip.find("li").click(function () {
            var $it = $(this);
            if ($it.data("type") === "time") {
                $groupBtn.find("span.m").width(64).html('<span class="ico-arrow"></span>时间分组');
                todoGroupType = 1;
                $groupTip.css("right", "3px");
            } else {
                $groupBtn.find("span.m").width(90).html('<span class="ico-arrow"></span>类型状态分组');
                todoGroupType = 0;
                $groupTip.css("right", "28px");
            }
            $groupTip.find("li").find("span").css("background-image", "none");
            $(this).find("span").css("background-image", "url(" + oaweb.staticURL + "/themes/layout4/images/new-todo-list.png)");
             
            it._buildListAndBtns("/oaweb/shouye/newui/newtodolist.GetTodolist", {
                "op": "reload",
                "serverCtrl": todoListDate,
                "data": {
                    "groupType": todoGroupType
                }
            });
        });
    },
    
    /**
     * @description 文件类型+状态和时间的展开、收拢事件
     * @param {Bom} it 事件源元素 
     * @param {String} id 收展控制的元素 Id
     */
    toggleSecond: function (it, id) {
        var btn = $(it).find("span").get(0),
        expanded = true;
        if (btn.className === "ico-open") {
            btn.className = "ico-close";
            $("#" + id).hide();
            expanded = false;
        } else {
            $("#" + id).show();
            btn.className = "ico-open";
            expanded = true;
        }
        
        var data = this._data.list;
        
        var levels = id.split("-");
        if (levels.length === 2) {
            // 两级
            data[levels[1]].expanded = expanded;
        } else {
            // 三级
            data[levels[1]].map[levels[2]].expanded = expanded;
        }
    },
    
    /**
     * @description 阅办分组的展开、收拢事件
     * @param {Bom} it 事件源元素 
     * @param {Int} currentLevel 当前层级的序号
     * @param {Int} nextLevelCount 下层的层级数
     */
    toggleThird: function (it, currentLevel, nextLevelCount) {
        var btn = $(it).find("span").get(0),
        data = this._data.list;
        if (btn.className === "ico-open") {
            for (var i = 0; i < nextLevelCount; i++) {
                $("#node-" + currentLevel + "-" + i).hide();
                $("#toggle-" + currentLevel + "-" + i).get(0).className = "ico-close";
                data[currentLevel].map[i].expanded = false;
            }
            btn.className = "ico-close";
        } else {
            for (var i = 0; i < nextLevelCount; i++) {
                $("#node-" + currentLevel + "-" + i).show();
                $("#toggle-" + currentLevel + "-" + i).get(0).className = "ico-open";
                data[currentLevel].map[i].expanded = true;
            }
            btn.className = "ico-open";
        }
    }, 
    
    /**
     * @description 全展全收事件
     * @param {String} type 展或收的判断。open, 展开; close, 收起。 
     */
    toggleAll: function (type) {
        var data = this._data.list;
        
        for (var i = 0; i < data.length; i++) {
            var childData = data[i].map;
            
            if (childData[0].map) {
                // 三级
                if ("close" === type) {
                    $("#toggle-" + i).get(0).className = "ico-close";
                    for (var j = 0; j < childData.length; j++) {
                        $("#node-" + i + "-" + j).hide();
                        $("#toggle-" + i + "-" + j).get(0).className = "ico-close";
                        childData[j].expanded = false;
                    }
                } else {
                    $("#toggle-" + i).get(0).className = "ico-open";
                    for (var j = 0; j < childData.length; j++) {
                        $("#node-" + i + "-" + j).show();
                        $("#toggle-" + i + "-" + j).get(0).className = "ico-open";
                        childData[j].expanded = true;
                    }
                }
            } else {
                // 两级
                if ("close" === type) {
                    $("#node-" + i).hide();
                    $("#toggle-" + i).get(0).className = "ico-close";
                    data[i].expanded = false;
                } else {
                    $("#node-" + i).show();
                    $("#toggle-" + i).get(0).className = "ico-open";
                    data[i].expanded = true;
                }
            }
        }
    },
    
    /**
     * @description 单挑待办选中事件
     * @param {Bom} it 事件源元素 
     * @param {Event} evt 事件源的事件 
     */
    check: function (evt, it) {
        var $it = $(it);
        if (it.className === "ico-check") {
            it.className = "ico-checked";
            $it.parent().parent().parent().addClass("checked");
        } else {
            it.className = "ico-check";
            $it.parent().parent().parent().removeClass("checked").removeClass("opened");
        }
        
        if (window.event) {  
            event.cancelBubble = true;  
        }else if (evt){  
            evt.stopPropagation();  
        }  
    },
    
    /**
     * @description 打开待办
     * @param {Bom} it 事件源元素 
     */
    open: function (it) {
        $(".list-node tr").removeClass("opened");
        $(it).parent().parent().addClass("opened");
    },
    
    /**
     * @description 存在三级时，二级鼠标事件对三级收展状态产生联动的处理
     * @param {Int} currentLevel 当前层级的序号
     * @param {Int} nextLevelCount 下层的层级数
     */
    setToggleStatus: function (currentLevel, nextLevelCount) {
        var isOpen = false;
        for (var i = 0; i < nextLevelCount; i++) {
            if ($("#toggle-" + currentLevel + "-" + i).hasClass("ico-open")) {
                isOpen = true;
                break;
            }
        }
        
        if (isOpen) {
            $("#toggle-" + currentLevel).get(0).className = "ico-open";
        } else {
            $("#toggle-" + currentLevel).get(0).className = "ico-close";
        }
    },
    
    /**
     * @description 刷新按钮操作
     */
    refresh: function () {
        // 按钮状态修改
        $("#refresh").unbind("click").removeClass("btn")
        .addClass("btn-refreshing")
        .html('<img class="ico-waiting" src="'
            + oaweb.staticURL + '/themes/layout4/images/waiting.gif"/>正在刷新</span>');
        
        // 加载完成后重置按钮和状态栏
        this._buildListAndBtns("/oaweb/shouye/newui/newtodolist.PartialRefrash", {
            "op": "reload",
            "serverCtrl": todoListDate,
            "data": {
                "groupType": todoGroupType,
                "expandedNodes": this._getExpandedIds()
            }
        }, function () {
            $("#refresh").click(function () {
                ToDoList.refresh(this);
            }).addClass("btn").removeClass("btn-refreshing")
            .html('<span class="m"><span class="ico-refresh"></span>刷新</span><span class="r"></span>');
        });
    },
    
    /**
     * @description 获取选中数据
     * @returns {Array} 选中数据
     */
    getCheckedData: function () {
        var $checked = $("#list .ico-checked"),
        data = this._data.list,
        returns = [];
        
        if ($checked.length === 0) {
            alert("请先在标题前勾选，再进行批量办理。");
            return returns;
        }
        
        for (var k = 0; k < $checked.length; k++) {
            var levels = $($checked[k]).parent().attr("id").split("-");
            if (levels.length === 4) {
                // 三级
                returns.push(data[levels[1]].map[levels[2]].map[levels[3]]);
            } else {
                // 两级
                returns.push(data[levels[1]].map[levels[2]]);
            }
        }
        return returns;
    },
    
    /**
     * @description 获取数据及初始化列表和筛选按钮
     * @param {String} url 请求地址
     * @param {Object} postData 请求数据
     * @param {Function} callback 获取数据后的回调方法
     */
    _buildListAndBtns: function (url, postData, callback) {
        var it = this;
        $.ajax({
            type: "POST",
            url: url,
            data: postData,
            dataType: "json",
            cache: false,
            beforeSend: function (XHR) {
                $("#refreshStatus")
                .html('<img src="' 
                    + oaweb.staticURL + '/themes/layout4/images/wait.gif"/>正在加载待办工作<span class="ico-turnoff"></span')
                .show();
            },
            success : function(data, textStatus, jqXHR) {
                if (data.status) {
                    var datas = {};
                    for (var i = 0; i < data.data.length; i++) {
                        switch (data.data[i].action) {
                            case "updateBtn":
                                datas.count = data.data[i].data;
                                break;
                            case "trees":
                                datas.list = data.data[i].data;
                                break;
                            case "addToDoCount":
                                datas.addToDoCount = data.data[i].data;
                                break;
                        }
                    }
                    
                    if (datas.addToDoCount === 0) {
                        $("#refreshStatus")
                        .html('<span class="tip"><span class="ico-finished"></span>刷新完毕</span><span class="ico-turnoff"></span')
                        .show();
                        setTimeout(function () {
                            $("#refreshStatus").hide();
                        }, 5000);
                    } else {
                        $("#refreshStatus").html('<span class="tip"><span class="ico-finished"></span>加载完毕，您有' 
                            + datas.addToDoCount + '条新待办</span><span class="ico-turnoff"></span>').show();
                    }
                    
                    it.data = datas;
                    it._genCount(datas.count);
                    it._genList(datas.list);
                    todoListDate = data.serverCtrl;
                    
                    if (typeof(callback) === "function") {
                        callback();
                    }
                } else {
                    alert("待办列表数据加载失败");
                }               
            }
        });
    },
    
    /**
     * @description 获取展开节点的 Id
     * @returns {Array} 展开节点的 Id 列表
     */
    _getExpandedIds: function () {
        var data  = this.data.listm,
        ids = [];
        
        for (var i = 0; i < data.length; i++) {
            var childData = data[i].map;
            
            if (childData[0].map) {
                // 三级
                for (var j = 0; j < childData.length; j++) {
                    if (childData[j].expanded) {
                        ids.push(escape(childData[j].id));
                    }
                }
            } else {
                // 两级
                if (data[i].expanded) {
                    ids.push(escape(data[i].id));
                }
            }
        }
        return ids;
    }
};