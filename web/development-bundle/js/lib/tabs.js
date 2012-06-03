/*
 * Copyright (C) 2011, Liyuan Li
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
(function ($) {
    $.fn.extend({
        tabs: {
            version: "0.0.1.7",
            author: "lly219@gmail.com"
        }
    });

    var dpuuid = new Date().getTime();
    var PROP_NAME = 'tabs';

    var Tabs = function () {
        this._defaults = {
            "styleClass": {
                "leftSelected": "tabs-left-selected",
                "rightSelected": "tabs-right-selected",
                "left": "tabs-left",
                "right": "tabs-right",
                "leftSelectedRight": "tabs-left-selected-right",
                "leftRight": "tabs-left-right",
                "leftRightSelected": "tabs-left-right-selected",
                "middle": "tabs-middle",
                "middleSelected": "tabs-middle-selected",
                "nav": "tabs-nav",
                "content": "tabs-content",
                "tabsBG": "tabs-tabs-bg",
                "closeIcon": "tabs-close-icon",
                "hover": "tabs-hover"
            }
        }
    };

    $.extend(Tabs.prototype, {
        _attach: function (target, settings) {
            if (!target.id) {
                this.uuid++;
                target.id = 'dp' + this.uuid;
            }
            var inst = this._newInst($(target));

            inst.settings = $.extend({
                length: 0
            }, settings || {});
            $.data(target, PROP_NAME, inst);
            this._init(target);
        },

        /* Create a new instance object. */
        _newInst: function (target) {
            // escape jQuery meta chars
            var id = target[0].id.replace(/([^A-Za-z0-9_])/g, '\\\\$1');
            return {
                id: id
            };
        },

        _getInst: function (target) {
            try {
                return $.data(target, PROP_NAME);
            } catch (err) {
                throw 'Missing instance data for this tabs';
            }
        },

        _init: function (target) {
            var inst = this._getInst(target);
            var id = inst.id,
            settings = inst.settings;
            var styleClass = this._getDefaults(this._defaults, settings, "styleClass"),
            $tabs = undefined;
            target.className = styleClass.tabsBG;

            if (settings.data) {
                // set tabs panel height.
                var heightStyle = settings.height ? " style='height:" + settings.height + "px;'" : "";

                target.innerHTML = "<ul class='" + styleClass.nav
                + "'></ul>";
                $(target).after("<div id='" + id + "Content' class='"
                    + styleClass.content + "'" + heightStyle + "></div>");
                this._buildHTML(target);
                $tabs = $(target).find("li");
            } else {
                $tabs = $(target).find("li");
                settings.data = [];

                // set tabs style.
                $(target).find("ul").addClass(styleClass.nav);

                var $tabsPanels = $("#" + id + "Content div"),
                $tabsContent = $("#" + id + "Content");
                $tabsContent.addClass(styleClass.content);

                // set tabs panel height.
                if (settings.height) {
                    $tabsContent.height(settings.height);
                }

                for (var i = 0; i < $tabs.length; i++) {
                    // set data.
                    settings.data[i] = {};
                    settings.data[i].text = $tabs.get(i).innerHTML;
                    settings.data[i].content = $tabsPanels.get(i).innerHTML;
                    settings.data[i].id = $($tabs.get(i).children[0]).data("index");

                    // build tabs HTML.
                    if (i !== $tabs.length - 1) {
                        $tabs.get(i).innerHTML = "<div></div>" + $tabs.get(i).innerHTML;
                    } else {
                        $tabs.get(i).innerHTML = "<div></div>"
                        + $tabs.get(i).innerHTML + "<div></div>";
                    }
                }
            }

            this._setCurrentTab(target, settings.data[0].id);

            // bind change tab event.
            this._changeTab(target, $tabs);

            // bind close event.
            this._close(target, $tabs);

            // bind user event
            this._bindEvent(target, $tabs);

            if (typeof(settings.load) === "function") {
                settings.load();
            }
        },

        _buildHTML: function (target) {
            var inst = this._getInst(target);
            var settings = inst.settings,
            id = inst.id;
            var data = settings.data,
            tabsHTML = "",
            contentsHTML = "";

            for (var i = 0; i < data.length; i++) {
                var tabContentHTML = {};
                tabContentHTML = this._buildTabPanelHTML(target, data[i]);
                tabsHTML += tabContentHTML.tabHTML;
                contentsHTML += tabContentHTML.contentHTML;
            }
            $(target).find("ul").html(tabsHTML);
            $("#" + id + "Content").html(contentsHTML);
        },

        _buildTabPanelHTML: function (target, data) {
            var inst = this._getInst(target);
            var settings = inst.settings,
            id = inst.id,
            styleClass = this._getDefaults(this._defaults, settings, "styleClass");
            var datas = settings.data;

            var tabHTML = "",
            contentHTML = "",
            lastHTML = "",
            text = data.text;

            var alt = data.alt ? data.alt : data.text ;
            if (data.altCount && data.altCount < text.length && text.indexOf("</") < 0) {
                text = text.substr(0, data.altCount) + "...";
            }
            text += data.button ? "<span id='" + id + "_" + data.id
            + "_button'>" + data.button + "</span>": "";
            // build tab HTML.
            if (datas[datas.length - 1].id === data.id.toString()) {
                lastHTML = "<div></div>";
            }
            if (data.isClose) {
                tabHTML = "<li><div></div><div data-index='" + data.id + "' title='"
                + alt + "'><span class='left'>" + text + "</span><a  href='javascript:void(0);' class='"
                + styleClass.closeIcon + "'></a></div>" + lastHTML + "</li>";
            } else {
                tabHTML = "<li><div></div><div data-index='" + data.id + "' title='"
                + alt + "'>" + text + "</div>" + lastHTML + "</li>";
            }

            // build tab panel HTML.
            var contentId = id + "_" + data.id;
            var content = data.content;
            if (data.url) {
                var iframeHeight = this._calculateIframeHeight(settings.height, id);
                content = "<iframe id='" + contentId + "_iframe' src='" + data.url
                + "' frameborder='0' width='100%' height='"
                + iframeHeight + "' style='height:" + iframeHeight + ";'></iframe>";
            }
            contentHTML = "<div id='" + contentId + "'>" + content + "</div>";

            return {
                "tabHTML": tabHTML,
                "contentHTML": contentHTML
            }
        },

        _changeTab: function (target, $tabs, index) {
            if (index !== undefined) {
                $($tabs.get(index)).bind("click", function () {
                    $.tabs._changeTabFunction(this, target);
                }).mouseover(function () {
                    this.className = "hover";
                }).mouseout(function () {
                    this.className = "";
                });
            } else {
                $tabs.each(function () {
                    $(this).bind("click", function () {
                        $.tabs._changeTabFunction(this, target);
                    });
                }).mouseover(function () {
                    this.className = "hover";
                }).mouseout(function () {
                    this.className = "";
                });
            }
        },

        _changeTabFunction: function (it, target) {
            var inst = this._getInst(target);
            var styleClass = this._getDefaults(this._defaults, inst.settings, "styleClass");
            var $middle = $($(it).find("div")[1]);
            if ($middle.hasClass(styleClass.middleSelected)) {
                return;
            }
            this._setCurrentTab(target, $middle.data("index"));
        },

        _setCurrentTab: function (target, id) {
            var inst = this._getInst(target);
            var settings = inst.settings;
            var data = settings.data,
            styleClass = this._getDefaults(this._defaults, settings, "styleClass"),
            $tabs = $(target).find("li");
            for (var i = 0; i < data.length; i++) {
                var $content = $("#" + target.id + "_" + data[i].id);
                $("#" + inst.id + "_" + data[i].id + "_button").hide();
                if (id.toString() === data[i].id) {
                    if (i === 0) {
                        $tabs.get(i).children[0].className = styleClass.leftSelected;
                        if (data.length === 1) {
                            $tabs.get(i).children[2].className = styleClass.rightSelected;
                        }
                    } else if (i === data.length - 1) {
                        $tabs.get(i).children[0].className = styleClass.leftRightSelected;
                        $tabs.get(i).children[2].className = styleClass.rightSelected;
                    } else {
                        $tabs.get(i).children[0].className = styleClass.leftRightSelected;
                    }
                    $tabs.get(i).children[1].className = styleClass.middleSelected;
                    if (data[i].reload && !data[i].content) {
                        document.getElementById(data[i].id + "Iframe").contentWindow.location.href = data[i].url;
                    }
                    $content.show();

                    $("#" + inst.id + "_" + data[i].id + "_button").show();
                } else {
                    if (i === 0) {
                        $tabs.get(i).children[0].className = styleClass.left;
                    } else {
                        if (id.toString() === data[i - 1].id) {
                            $tabs.get(i).children[0].className = styleClass.leftSelectedRight;
                        } else {
                            $tabs.get(i).children[0].className = styleClass.leftRight;
                        }
                        if (i === data.length - 1) {
                            $tabs.get(i).children[2].className = styleClass.right;
                        }
                    }
                    $tabs.get(i).children[1].className = styleClass.middle;
                    $content.hide();
                }
            }
        },

        _bindEvent: function (target, $tabs, index) {
            var inst = this._getInst(target);
            var settings  = inst.settings;
            var bind = settings.bind,
            data = settings.data;
            if (settings.bind) {
                if (index !== undefined) {
                    for (var l = 0; l < bind.length; l++) {
                        $($tabs.get(index)).bind(bind[l].type, {
                            data: data[index],
                            index: l
                        }, function (event) {
                            bind[event.data.index].action(event, event.data.data);
                        });
                    }
                } else {
                    for (var i = 0; i < data.length; i++) {
                        for (var j = 0; j < bind.length; j++) {
                            $($tabs.get(i)).bind(bind[j].type, {
                                data: data[i],
                                index: j
                            }, function (event) {
                                bind[event.data.index].action(event, event.data.data);
                            });
                        }
                    }
                }
            }
        },

        _close: function (target, $tabs, index) {
            var inst = this._getInst(target);
            var styleClass = this._getDefaults(this._defaults, inst.settings, "styleClass");
            if (index !== undefined) {
                $($tabs[index]).find("." + styleClass.closeIcon).bind("click", function (event) {
                    $.tabs._closeFunction(target,
                        $(event.currentTarget.parentNode).data("index"));
                });
            } else {
                $tabs.find("." + styleClass.closeIcon).bind("click", function (event) {
                    $.tabs._closeFunction(target,
                        $(event.currentTarget.parentNode).data("index"));
                });
            }
        },

        _closeFunction: function (target, currentId) {
            var inst = this._getInst(target);
            var settings = inst.settings;
            var data = settings.data,
            styleClass = this._getDefaults(this._defaults, inst.settings, "styleClass"),
            $tabs = $(target).find("li");

            var index = this._getIndexById(data, currentId.toString());

            // close event
            if (typeof(settings.close) === "function") {
                if (!settings.close(data[index])) {
                    return;
                }
            }

            // remove tab content
            $("#" + target.id + "_" + currentId).remove();

            var $middle = $($($tabs.get(index - 1)).find("div")[1]);
            // if remove last tab, new current tab should be add <div></div>.
            if (index === data.length - 1) {
                if ($middle.hasClass(styleClass.middleSelected)) {
                    $middle.after("<div class='" + styleClass.rightSelected + "'></div>");
                } else {
                    $middle.after("<div class='" + styleClass.right + "'></div>");
                }
            }

            // remove tab is last but one and current tab is the last but two.
            if (index === data.length - 2
                && $middle.hasClass(styleClass.middleSelected)) {
                $tabs.get(index + 1).children[0].className = styleClass.leftSelectedRight;
            }

            // remove tab
            $($tabs.get(index)).remove();

            // sync data
            data.splice(index, 1);

            // set new current tab
            if ($($($tabs.get(index)).find("div")[1]).hasClass(styleClass.middleSelected)) {
                if (index === 0) {
                    index++;
                }
                this._setCurrentTab(target, data[index -1].id);
            }

            // stop bubbling
            if (currentId.currentTarget) {
                currentId.stopPropagation();
            }
        },

        _getDefaults: function (defaults, settings, key) {
            if (key === "styleClass") {
                if (settings.theme === "default" || settings.theme === undefined) {
                    return defaults.styleClass;
                }
                settings.styleClass = {};
                for (var styleName in defaults[key]) {
                    settings.styleClass[styleName] =  defaults.styleClass[styleName] + "-" + settings.theme;
                }
            } else if ((key === "height" && settings[key] !== "auto") || key === "width") {
                if (settings[key] === null || settings[key] === undefined) {
                    return defaults[key] + "px";
                } else {
                    return settings[key] + "px";
                }
            } else {
                if (settings[key] === null || settings[key] === undefined) {
                    return defaults[key];
                }
            }
            return settings[key];
        },

        _calculateIframeHeight: function (height, id) {
            var $tabContent = $("#" + id + "Content");
            var paddingTop = $tabContent.css("padding-top"),
            paddingBottom = $tabContent.css("padding-bottom");
            //borderTop = $tabContent.css("border-top-width"),
            //borderBottom = $tabContent.css("border-bottom-width");
            return height - parseInt(paddingTop) - parseInt(paddingBottom) + "px";
        },

        _getIndexById: function (data, tabId) {
            for (var i in data) {
                if (data[i].id === tabId) {
                    return parseInt(i);
                }
            }
        },

        _addTabs: function (target, addData) {
            var inst = this._getInst(target);
            var settings = inst.settings;
            var data = settings.data;
            addData.id = addData.id.replace(/(^\s*)|(\s*$)/g,"").toString();
            var index = data.length;
            // trigger custom callback
            if (typeof(settings.add) === "function") {
                // TODO: arguments
                var isAdd = settings.add(addData);
                if (!isAdd) {
                    return;
                }
            }

            // tab 数目限制
            if (settings.size){
                if (data.length >= settings.size) {
                    alert("对不起，只能打开" + settings.size + "个窗口");
                    return;
                }
            }

            // 当添加 id 重复的 tab 时，设置此 id 的 tab 为 current tab.
            for (var i = 0; i < data.length; i++) {
                if (data[i].id === addData.id) {
                    this._setCurrentTab(target, addData.id);
                    return;
                }
            }

            settings._count++;

            // sync data.
            data.splice(index, 0, addData);
            if (addData.id) {
                data[index].id = addData.id;
            } else {
                data[index].id = inst.id + "Content" + settings._count;
            }

            // append HTML.
            var tabContentHTMl = this._buildTabPanelHTML(target, data[index]);

            // only last li like this: <ul><li><div></div><a></a><div></div></li></ul>. So before add, remove last div.
            if (data.length - 1 === index) {
                $(target).find("ul li div").last().remove();
            }
            if (index === 0) {
                $($(target).find("li").get(index)).before(tabContentHTMl.tabHTML);
            } else {
                $($(target).find("li").get(index - 1)).after(tabContentHTMl.tabHTML);
            }

            $("#" + inst.id + "Content").append(tabContentHTMl.contentHTML);

            var $tabs = $(target).find("li");

            this._setCurrentTab(target, data[index].id);

            // bind change tab event
            this._changeTab(target, $tabs, index);

            // bind close event.
            this._close(target, $tabs, index);

            // bind user event.
            this._bindEvent(target, $tabs, index);
        },

        _lengthTabs: function (target) {
            var inst = this._getInst(target);
            return inst.settings.data.length;
        },

        _selectTabs: function (target, id) {
            this._setCurrentTab(target, id);
        },

        _removeTabs: function (target, currentId) {
            var inst = this._getInst(target);
            var settings = inst.settings,
            styleClass = this._getDefaults(this._defaults, settings, "styleClass");
            var $tabs = $(target).find("li");
            if (settings.closeSyn) {
                $tabs.find("#" + currentId + " ." + styleClass.closeIcon).click();
            } else {
                this._closeFunction(target, currentId);
            }
        },

        _getTabTabs: function (target, tabId, tag) {
            var inst = this._getInst(target);
            var settings = inst.settings;
            var data = settings.data,
            styleClass = this._getDefaults(this._defaults, settings, "styleClass"),
            currentData = {},
            index = 0;
            if (tabId) {
                index = this._getIndexById(data, tabId);
                currentData = data[index];
            } else {
                $(target).find("li").each(function (k) {
                    var $it = $(this);
                    if ($($it.find("div")[1]).hasClass(styleClass.middleSelected)) {
                        currentData = data[k];
                        index = k;
                    }
                });
            }
            if (tag) {
                index = parseInt(index);
                switch (tag) {
                    case "next":
                        if (index < data.length - 1) {
                            currentData = data[index + 1];
                        }
                        break;
                    case "pre":
                        if (index > 0) {
                            currentData = data[index - 1];
                        }
                        break;
                    default:
                        alert("get tab error, has no type!");
                        break;
                }
            }
            return currentData;
        },

        _destroyTabs: function (target) {
            var $target = $(target);
            var inst = this._getInst(target);
            var settings = inst.settings,
            styleClass = this._getDefaults(this._defaults, settings, "styleClass");
            $.removeData(target, PROP_NAME);
            $target.removeClass(styleClass.tabsBG).empty();
            $("#" + inst.id + "Content").remove();
        },

        _updateTabs: function (target, updateData, tabId) {
            var inst = this._getInst(target);
            var settings = inst.settings,
            $tabs = $(target).find("li");
            var data = settings.data;
            // update settings
            if (tabId === undefined) {
                // update height
                $.extend(settings, updateData);
                $("#" + target.id + "Content").height(updateData.height);
                var dataTemp = settings.data;
                for (var j = 0; j < dataTemp.length; j++) {
                    var $iframe = $("#" + inst.id + "_" + dataTemp[j].id + "_iframe");
                    if (dataTemp[j].url && $iframe.length === 1) {
                        $iframe.height(updateData.height);
                        $iframe.attr("height", updateData.height);
                    }
                }
                return ;
            }

            // update tab
            var index = this._getIndexById(data, tabId);

            var  count = updateData.altCount ? updateData.altCount : data[index].altCount,
            url = updateData.url ? updateData.url : data[index].url,
            text = updateData.text ? updateData.text : data[index].text,
            alt = text,
            $tabPanel = $("#" + inst.id + "_" + data[index].id);
            if (count < text.length && text.indexOf("</") < 0) {
                text = text.substr(0, count) + "...";
            }

            if (data[index].isClose) {
                $($($tabs[index]).find("span")[0]).html(text).attr("title", alt);
            } else {
                $($($tabs.get(index)).find("div")[1]).html(text).attr("title", alt);
            }

            if (updateData.content) {
                $tabPanel.html(updateData.content);
            } 
            if (updateData.url) {
                // TODO: resize window and then update, IE cann't parse iframe 100%.
                $("#" + inst.id + "_" + data[index].id + "_iframe").attr("src", url).width($tabPanel.width());
                setTimeout(function () {
                    $("#" + inst.id + "_" + data[index].id + "_iframe").width("100%");
                }, 500);
            }
            $.extend(data[index], updateData);
        },

        _bindTabs: function (target, bindData, tabId) {
            var inst = this._getInst(target);
            var data = inst.settings.data,
            index = this._getIndexById(data, tabId);
            data[index].bind = bindData;
            var $tab = $($(target).find("li").get(index));
            for (var i = 0; i < bindData.length; i++) {
                $tab.bind(bindData[i].type, {
                    data: data[index]
                }, bindData[i].action);
            }
        },

        _unbindTabs: function (target, type, tabId) {
            var inst = this._getInst(target);
            var index = this._getIndexById(inst.settings.data, tabId),
            bindData = inst.settings.data[index].bind;
            for (var i in bindData) {
                if (bindData[i].type === type) {
                    $($(target).find("li").get(index)).unbind(type, bindData[i].action);
                }
            }
        }
    });

    $.fn.tabs = function (options) {
        var otherArgs = Array.prototype.slice.call(arguments);

        if (typeof options === 'string') {
            otherArgs.shift();
            return $.tabs['_' + options + 'Tabs'].apply($.tabs, [this[0]].concat(otherArgs));
        }
        return this.each(function () {
            $.tabs._attach(this, options);
        });
    };

    $.tabs = new Tabs();

    // Add another global to avoid noConflict issues with inline event handlers
    window['DP_jQuery_' + dpuuid] = $;
})(jQuery);