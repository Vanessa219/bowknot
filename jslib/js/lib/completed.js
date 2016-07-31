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

/*
 * @fileoverview auto completed.
 *
 * @author <a href="mailto:LLY219@gmail.com">Liyuan Li</a>
 * @version 1.0.1.3, Oct 29, 2011
 */
(function ($) {
    var j = new Date().getTime();
    var k = 'completed';
    var l = function () {
        this._defaults = {
            "styleClass": {
                "panelClass": "completed-panel",
                "inputClass": "completed-input",
                "ckClass": "completed-ck"
            },
            "separator": ","
        }, this._settingsDataFormat = {}
    };

    $.extend(l.prototype, {
        _attach: function (a, b) {
            if (!a.id) {
                this.uuid++;
                a.id = 'dp' + this.uuid
            }
            var c = this._newInst($(a));
            c.settings = $.extend({
                "buttonText": "\u9009\u62e9"
            }, b || {});
            $.data(a, k, c);
            this._init(a);
        },
        _newInst: function (a) {
            var b = a[0].id.replace(/([^A-Za-z0-9_])/g, '\\\\$1');
            return {
                "id": b
            };
        },
        _getInst: function (a) {
            try {
                return $.data(a, k)
            } catch (err) {
                throw 'Missing instance data for this completed';
            }
        },
        _destroyCompleted: function () {
        },
        /*
         * @description 初始化对象及相关界面
         * @param {bom} target 初始化对象
         */
        _init: function (target) {
            var inst = this._getInst(target);
            var id = inst.id,
                    settings = inst.settings;

            this._buildHTML(id, settings);

            $(document).click(function (event) {
                if (event.target.id !== id) {
                    $("#" + id + "SelectedPanel").hide();
                }
            });

            if (!settings.onlySelect) {
                this._buildCheckboxPanel(id, settings.data);
            }
        },
        /*
         * @description 初始化相关界面
         * @param {string} id 输入框 id
         * @param {obj} settings 相关配置信息
         */
        _buildHTML: function (id, settings) {
            var height = settings.height + "px",
                    classStyle = this._getDefaults($.completed._defaults, settings, "styleClass");
            var $it = $("#" + id);
            var panelHTML = '';

            if (!settings.onlySelect) {
                panelHTML += "<button onclick=\"$('#" + id +
                        "CheckboxPanel').toggle()\">" + settings.buttonText + "</button>";
            }
            panelHTML += "<div id='" + id +
                    "SelectedPanel' class='" + classStyle.panelClass + "' style='height:" +
                    height + ";'></div><div class='none " +
                    classStyle.ckClass + "' id='" + id + "CheckboxPanel'><div>";
            if (typeof (settings.data) === 'object') {
                settings.data.sort();
            }

            $it.after(panelHTML).bind("keyup", {
                settings: settings
            }, this._keyupAction).bind("keydown", function (event) {
                settings.chinese = event.keyCode;
            }).addClass(classStyle.inputClass).width($it.width() - 78);
            settings.tipNum = 0;
        },
        /*
         * @description 监听放开按钮时间
         * @param {event} evnt
         */
        _keyupAction: function (event) {
            var settings = event.data.settings,
                    currentWordObj = $.completed._getCurrentWord(this, settings);
            // 当前词组为空或者使用 Esc / Shift / Backspace 键后提示消失
            if (currentWordObj.currentWord === "" || event.keyCode === 27 ||
                    event.keyCode === 16 || event.keyCode === 16) {
                $("#" + this.id + "SelectedPanel").hide();
                settings.tipNum = 0;
                settings.afterKeyup ? settings.afterKeyup(event) : '';
                return;
            }

            var matchDatas = $.completed._getMatchData(settings.data, this.value, currentWordObj.currentWord);

            if (event.keyCode === 38) {
                // up
                if (settings.tipNum > 0) {
                    settings.tipNum--;
                } else {
                    settings.tipNum = matchDatas.length - 1;
                }
            }

            if (event.keyCode === 40) {
                // down
                if (settings.tipNum < matchDatas.length - 1) {
                    settings.tipNum++;
                } else {
                    settings.tipNum = 0;
                }
            }
            $.completed._buildSelectedPanel(this.id, matchDatas, settings, currentWordObj.currentWord);

            if (event.keyCode === 13 && matchDatas[settings.tipNum] && settings.chinese !== 229) {
                // enter                
                var temp = this.value;
                this.value = temp.substring(0, currentWordObj.startPos)
                        + matchDatas[settings.tipNum]
                        + temp.substring(currentWordObj.endPos, temp.length);
                $("#" + this.id + "SelectedPanel").hide();
                settings.chinese = undefined;
            }

            if (event.keyCode !== 38 && event.keyCode !== 40) {
                settings.tipNum = 0;
            }
            settings.afterKeyup ? settings.afterKeyup(event) : '';
        },
        /*
         * @description 获取当前光标所在位置的词语
         * @param {bom} it 输入框对象
         * @param {obj} settings 配置信息
         */
        _getCurrentWord: function (it, settings) {
            var words = $(it).val(),
                    tag = true,
                    endPos = 0,
                    startPos = 0,
                    separator = $.completed._defaults.separator;
            if (words === "") {
                return {
                    currentWord: "",
                    startPos: startPos,
                    endPos: endPos
                };
            }

            // get current cursor position
            if (document.selection) { // IE
                try {
                    var cuRange = document.selection.createRange();
                    var tbRange = it.createTextRange();
                    tbRange.collapse(true);
                    tbRange.select();
                    var headRange = document.selection.createRange();
                    headRange.setEndPoint("EndToEnd", cuRange);
                    settings.curPos = headRange.text.length;
                    cuRange.select();
                } catch (e) {
                    delete e;
                }
            } else {
                settings.curPos = it.selectionStart
            }

            var curPos = settings.curPos;

            for (var i = 0; i < words.length; i++) {
                if (words.charAt(i) === separator) {
                    if (i >= curPos && tag) {
                        endPos = i;
                        tag = false;
                    }
                }
            }

            if (tag === true) {
                tag = false;
                endPos = words.length;
            }

            for (var j = endPos; j > -1; j--) {
                if (words.charAt(j) === separator) {
                    if (j < curPos && !tag) {
                        startPos = j + 1;
                        tag = true;
                    }
                }
            }
            return {
                currentWord: words.substring(startPos, endPos),
                startPos: startPos,
                endPos: endPos
            };
        },
        /*
         * @description 根据输入框中的内容 currentWords 和当前的字符 currentWord 获取匹配的元素
         * @param {array} datas 所有的提示数据
         * @param {string} currentWords 输入框中根据英文逗号分隔的词组
         * @param {string} currentWord 当前光标位置中的单词
         */
        _getMatchData: function (datas, currentWords, currentWord) {
            var currentDatas = currentWords.split($.completed._defaults.separator);
            var matchDatas = [];
            // 构造当前单词匹配的词组
            for (var i = 0; i < datas.length; i++) {
                if (typeof datas[i] === "number") {
                    datas[i] = datas[i].toString()
                }
                // 过滤出与当前单词匹配
                if (datas[i].toLowerCase().indexOf(currentWord.toLowerCase()) > -1) {
                    var tag = true;
                    for (var k = 0; k < currentDatas.length; k++) {
                        // 过滤出输入框中已有的单词
                        if (datas[i] === currentDatas[k].toString() &&
                                datas[i].toLowerCase() !== currentWord.toLowerCase()) {
                            tag = false;
                        }
                    }
                    if (tag) {
                        matchDatas.push(datas[i]);
                    }
                }
            }
            return matchDatas;
        },
        /*
         * @description 鼠标移动到选择列表上，记录当前选中 tag
         * @param {bom} it 鼠标移动之下的对象
         * @param {num} i 当前被选择的顺序
         * @param {string} id 输入框 id
         */
        _mousemoveSelectPanel: function (it, i, id) {
            $(it).parent().find("a").removeClass("selected");
            it.className = 'selected';
            var inst = $.completed._getInst(document.getElementById(id));
            inst.settings.tipNum = i;
        },
        /*
         * @description 构建提示列表
         * @param {string} id 当前输入框 id
         * @param {array} matchDatas 与 currentWord 模糊匹配的词语
         * @param {obj} settings 配置信息
         * @param {string} currentWord 当前光标位置的词语
         */
        _buildSelectedPanel: function (id, matchDatas, settings, currentWord) {
            var $panel = $("#" + id + "SelectedPanel");
            if (matchDatas.length === 0) {
                $panel.html("").hide();
                return;
            }
            if (settings.tipNum >= matchDatas.length) {
                settings.tipNum = 0;
            }
            var panelItemsHTML = "";
            for (var i = 0; i < matchDatas.length; i++) {
                var attrClass = "",
                        highlightHTML = matchDatas[i].replace(currentWord, "<b>" + currentWord + "</b>");
                if (settings.tipNum === i) {
                    attrClass = "class='selected'";
                }

                panelItemsHTML += "<a href='javascript:void(0);' \
                                        onmousemove=\"$.completed._mousemoveSelectPanel(this, " + i + ", '" + id + "');\"\
                                        " + attrClass + ">" + highlightHTML + "</a>";
            }
            $panel.html(panelItemsHTML).show();
            var $selectedItem = $("#" + id + "SelectedPanel a.selected");
            if ($selectedItem.position().top + $panel.scrollTop() > 50 - $selectedItem.height()) {
                $panel.scrollTop($selectedItem.position().top + $panel.scrollTop() + $selectedItem.height() - 50)
            }
            if ($selectedItem.position().top < 0) {
                $panel.scrollTop($panel.scrollTop - $selectedItem.height())
            }

            // click for completed
            $("#" + id + "SelectedPanel a").click(function () {
                var target = document.getElementById(id);
                var currentWordObj = $.completed._getCurrentWord(document.getElementById(id), settings);
                var matchDatas = $.completed._getMatchData(settings.data, target.value, currentWordObj.currentWord);
                var temp = target.value;
                target.value = temp.substring(0, currentWordObj.startPos)
                        + matchDatas[settings.tipNum]
                        + temp.substring(currentWordObj.endPos, temp.length);
                settings.tipNum = 0;
                $(target).focus();
                settings.afterSelected ? settings.afterSelected($(this)) : '';
            });
        },
        /*
         * @description 构建选择区域
         * @param {string} id 当前输入框 id
         * @param {array} data 作为提示的数据
         */
        _buildCheckboxPanel: function (id, data) {
            var ckHTML = "",
                    $input = $("#" + id);
            for (var i = 0; i < data.length; i++) {
                ckHTML += "<span>" + data[i] + "</span>";
            }
            $("#" + id + "CheckboxPanel").html(ckHTML + "<div class='clear'></div>");

            $("#" + id + "CheckboxPanel" + " span").click(function () {
                var inputVal = $input.val(),
                        currentVal = this.innerHTML;
                if (this.className === "selected") {
                    this.className = "";

                    var last = inputVal.substr(inputVal.indexOf(currentVal) + currentVal.length, 1);
                    if (currentVal === inputVal || last !== ",") {
                        $input.val(inputVal.replace(currentVal, ""));
                    } else {
                        $input.val(inputVal.replace(currentVal + ",", ""));
                    }
                } else {
                    this.className = "selected";
                    if (inputVal.replace(/\s/g, "") === "" || inputVal.substr(inputVal.length - 1, 1) === ",") {
                        $input.val(inputVal + currentVal);
                    } else {
                        $input.val(inputVal + "," + currentVal);
                    }
                }
            });

            this._matchChecked(id);

            $input.blur(function () {
                $.completed._matchChecked(id);
            });
        },
        /*
         * @description 根据输入框中的内容，设置匹配的 checkbox 为被中状态。
         * @param {string} id 输入框 id
         */
        _matchChecked: function (id) {
            var currentValList = $("#" + id).val().split(",");

            $("#" + id + "CheckboxPanel span").removeClass().each(function () {
                for (var i = 0; i < currentValList.length; i++) {
                    if (this.innerHTML === currentValList[i]) {
                        this.className = "selected";
                    }
                }
            });
        },
        _updateDataCompleted: function (target, action, data) {
            var inst = this._getInst(target);
            var id = inst.id,
                    settings = inst.settings;
            settings.data = data;
            $.completed._buildSelectedPanel(id, data, settings, $('#' + id).val());
        },
        _getDefaults: function (defaults, settings, key) {
            if (key === "styleClass") {
                if (settings.theme === "default" || settings.theme === undefined) {
                    return defaults.styleClass;
                }
                settings.styleClass = {};
                for (var styleName in defaults[key]) {
                    settings.styleClass[styleName] = settings.theme + "-" + defaults.styleClass[styleName];
                }
            } else if (key === "height" || key === "width") {
                if (settings[key] === null || settings[key] === undefined) {
                    return "auto";
                } else {
                    return settings[key] + "px";
                }
            } else {
                if (settings[key] === null || settings[key] === undefined) {
                    return defaults[key];
                }
            }
            return settings[key];
        }
    });

    $.fn.completed = function (a) {
        var b = Array.prototype.slice.call(arguments);
        return this.each(function () {
            typeof a == 'string' ? $.completed['_' + a + 'Completed'].apply($.completed, [this].concat(b)) :
                    $.completed._attach(this, a)
        })
    };

    $.completed = new l();
    window['DP_jQuery_' + j] = $
})(jQuery);