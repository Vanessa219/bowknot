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
// version: 0.0.7.5:忽略key的width，scroll 的计算
// version: 0.0.7.7: sub data IE 6 bug
// version: 0.0.7.8: 移除 bowknot.util.js, bindEvent: 如果该列设置了 inputType,则绑定到 input 上。
// version: 0.0.7.9: 添加 getCells 和获取 option 的方法，functionName 使用 function 替代 name，避免全局变量
(function ($) {
    $.fn.extend({
        table: {
            version: "0.0.8.0",
            author: "lly219@gmail.com"
        }
    });

    var dpuuid = new Date().getTime();
    var PROP_NAME = "table",
    SCROLLBAR_WIDTH = 17;

    // Table value.
    var Table = function () {
        // If these attributes undefined in new, should be use those default value.
        this._defaults = {
            "height": "auto",
            // TODO: can not support, default value is ture.
            "resizable": false,
            // TODO: no implement.
            "caption": "Table mock data",
            // At one document, need two or more table style, should defined
            // this attribute, reference this._default.styleClass.
            // At one document, just use one style and plan change style,
            // please use switchStylestyle() this method, cann't defined
            // this attribute.
            "styleClass": {
                "highlightClass": "table-heiglight",
                "mainClass": "table-main",
                "bodyClass": "table-body",
                "headerClass": "table-header",
                "verticalLineClass": "table-verticalLine",
                "lineHoverClass": "table-lineHover",
                "sortClass": "table-sort",
                "sortASCClass": "table-sortASC",
                "sortDESCClass": "table-sortDESC",
                "sortUnASCClass": "table-sortUnactiveASC",
                "sortUnDESCClass": "table-sortUnactiveDESC",
                "floatLayerIconClass": "table-floatLayerIcon",
                "oddRowClass": "table-oddRow",
                "evenRowClass": "table-evenRow",
                "subTitleClass": "table-subTitle",
                "subTitleShowClass": "table-subTitleShow",
                "subTitleHideClass": "table-subTitleHide"
            },
            // default value is default, can use black.
            theme: "default",
            bindColumnEvent: [{
                "eventName": "",
                "functionName": ""
            }],
            // for resize
            currentIndex: ""
        },

        this._settingsDataFormat = {
            // The key should be same as model[i].index.
            "data": [],
            // TODO: now, the order should be same as data.
            "colModel": [{
                name: "",    // every column title
                index: "",    // every column uid
                width: 90,
                // resizable, at less one column cann't defiend width, so use minWidth.
                minWidth: 50,
                // can use center, left and right, default is left.
                textAlign: "left",
                // Note: if has this attribute, do not use inputType.
                sortType: "string",
                // first arg: event, e.g: mouseover, click...
                // second arg: function name.
                // can bind one or more event.
                bindEvent:[{
                    "evenName": "",
                    "funcitonName": ""
                }],
                // Bind this column. When mouseover,
                // the tag of id should be show in position of td tag that mouse point,
                // when mouseout, the tag of id should be hidden.
                // Of course, when mouse at the tag of id, it should be show.
                // If needs bind event and want to use hiddenData, can use
                // $("#" + id).data(id) get hiddenData.
                floatLayer: "id",
                // All row in this column should display this type input tag.
                // Type include button, checkbox, file, image, password, radio, text.
                // If needs bind event and want to use hiddenData, can use $("#"
                // + id + "_" + /* this column index */).data(id)
                // get hiddenData.
                // Note: 1. when typs is checkbox, data just can use false or true.
                //       2. if has this attribute, do not use sortType
                // TODO: now just support checkbox.
                inputType: "",
                // If inputType is "checkbox" and you need select all function,
                // set it ture.
                allSelected: false,
                visible: true,
                style: "",
                sortEvent: ""
            }]
        }
    };

    $.extend(Table.prototype, {
        _attach: function (target, settings) {
            if (!target.id) {
                this.uuid++;
                target.id = "dp" + this.uuid;
            }
            var inst = this._newInst($(target));

            inst.settings = $.extend({}, settings || {});
            $.data(target, PROP_NAME, inst);
            this._init(target);
        },

        /* Create a new instance object. */
        _newInst: function (target) {
            // escape jQuery meta chars
            var id = target[0].id.replace(/([^A-Za-z0-9_])/g, "\\\\$1");
            return {
                id: id
            };
        },

        _getInst: function (target) {
            try {
                return $.data(target, PROP_NAME);
            } catch (err) {
                throw "Missing instance data for this table";
            }
        },

        _destroyTable: function () {

        },

        _updateTable: function (target, updateSettings) {
            var inst = this._getInst(target),
            settings = inst.settings;

            for (var element in updateSettings) {
                if (typeof(updateSettings[element]) === "string" || typeof(updateSettings[element]) === "number"
                    || element === "data") {
                    settings[element] = updateSettings[element];
                } else {
                    settings[element] = $.extend(settings[element], updateSettings[element]);
                }
            }

            this._build(target);
        },

        _init: function (target) {
            var inst = this._getInst(target),
            settings = inst.settings;

            $(target).append("<div class='" + $.table._getDefaults($.table._defaults, settings, "styleClass").mainClass
                + "' id='" + inst.id + "Table'></div>");

            this._build(target);
        },

        _build: function (target) {
            var inst = this._getInst(target),
            settings = inst.settings;

            var resizable = $.table._getDefaults($.table._defaults, settings, "resizable"),
            styleClass = $.table._getDefaults($.table._defaults, settings, "styleClass"),
            height = $.table._getDefaults($.table._defaults, settings,"height"),
            tableWidth = this._getTableWidth(settings.colModel);

            var verticalLineHTML = resizable ? "<div class='"
            + styleClass.verticalLineClass + "' id='"
            + inst.id + "VerticalLine'></div>" : "";

            var tableHTML = verticalLineHTML + "<div id='"
            + inst.id + "TableHeader' class='" + styleClass.headerClass
            + "'></div>" + "<div id='" + inst.id + "TableMain' class='" + styleClass.bodyClass
            + "'></div>";

            $("#" + inst.id + "Table").html(tableHTML).css("position", "relative");

            this._buildHeader(target);
            if (settings.data || settings.subData) {
                this._buildBody(target, $.table._strToInt(height));
                this._bindEvent(target);
                this._bindRowEvent(target);
            // TODO: copy to stor method
            }

            // when has scrollbar
            if (tableWidth.width === "100%") {
                $("#" + inst.id + "TableMain").css({
                    "min-width":tableWidth.minWidth
                });
                $("#" + inst.id + "TableHeader").css({
                    "min-width":tableWidth.minWidth
                });
                if ($("#" + inst.id + "TableMain").attr("offsetHeight")
                    > $.table._strToInt(height) && $.browser.version !== "7.0") {
                    $("#" + inst.id + "TableHeader").css("padding-right", SCROLLBAR_WIDTH - 1);
                }
            } else {
                if ($("#" + inst.id + "TableMain").attr("offsetHeight")
                    > $.table._strToInt(height)) {
                    document.getElementById(inst.id + "TableMain").style.width = (tableWidth.width + SCROLLBAR_WIDTH) + "px";
                    document.getElementById(inst.id + "TableHeader").style.width = tableWidth.width + "px";
                } else {
                    document.getElementById(inst.id + "TableMain").style.width = tableWidth.width + "px";
                    document.getElementById(inst.id + "TableHeader").style.width = tableWidth.width + "px";
                }
            }
            if (parseInt(height) >= 0) {
                document.getElementById(inst.id + "TableMain").style.height = height;
            }
            // resizable
            if (resizable && tableWidth.width !== "100%") {
                $("#" + inst.id + "VerticalLine").height($("#" + inst.id + "TableHeader").height()
                    + (settings.height ? settings.height: $("#" + inst.id + "TableMain").height()));

                $("#" + inst.id + "Table").bind("mousemove", {
                    "target": target
                }, this._mousemoveTabel).bind("mousedown", {
                    "target":target
                }, this._mousedownVerticalLine);
            }
        },

        _buildHeader: function (target) {
            var settings = this._getInst(target).settings;
            var colModel = settings.colModel,
            id = this._getInst(target).id,
            styleClass = $.table._getDefaults($.table._defaults, settings, "styleClass"),
            tableWidth = this._getTableWidth(colModel),
            headerHTML = "<table cellpadding='0' cellspacing='0'><tr>";

            var sortHTML = '<div class="' + styleClass.sortASCClass + ' '
            + styleClass.sortUnASCClass + '">' + '</div><div class="'
            + styleClass.sortDESCClass + ' ' + styleClass.sortUnDESCClass + '"></div>';

            if (tableWidth.width === "100%") {
                headerHTML = "<table cellpadding='0' cellspacing='0' style='width:100%'><tr>"
            }

            for (var i = 0; i < colModel.length; i++) {
                if (colModel[i].visible === undefined) {
                    var checkboxId = id + "_" + colModel[i].index;
                    if (colModel[i].minWidth) {
                        headerHTML += "<th style='min-width:" + colModel[i].minWidth + "px;'>";
                    } else {
                        headerHTML += "<th style='width:" + colModel[i].width + "px;'>";
                    }

                    if (colModel[i].sortType || colModel[i].sortEvent) {
                        // this cloumn needs sort
                        headerHTML += "<span id='" + checkboxId + "'>" + colModel[i].name
                        + '</span><span class="' + styleClass.sortClass
                        + '" id="' + checkboxId + 'TableSort">'
                        + sortHTML + "</span></th>";
                    } else if (colModel[i].inputType === "checkbox" && colModel[i].allSelected) {
                        // this column has inputType and has select all checkbox.
                        headerHTML += "<input id='" + checkboxId
                        + "' onclick=\"DP_jQuery_" + dpuuid + ".table._selectHeaderCheckbox(this,'"
                        + styleClass.highlightClass + "');\" type='" + colModel[i].inputType + "'/></th>";
                    } else {
                        headerHTML += "<span id='" + checkboxId + "'>" + colModel[i].name + "</span></th>";
                    }
                }
            }

            $("#" + id + "TableHeader").html(headerHTML + "</tr></table>");

            // bind sort event
            for (var j = 0; j < colModel.length; j++) {
                if (colModel[j].sortType || colModel[j].sortEvent) {
                    $("#" + id + "_" + colModel[j].index + "TableSort").bind("click", {
                        "index": colModel[j].index,
                        "target": target
                    },$.table._sort);
                }
            }
        },

        _buildBody: function (target, height) {
            var id = this._getInst(target).id,
            settings = this._getInst(target).settings;
            var subData = settings.subData,
            styleClass = $.table._getDefaults($.table._defaults, settings, "styleClass"),
            resultObj ={},
            bodyHTML = "",
            subTitleId = "",
            data = [];

            if (subData) {
                for (var i = 0; i < subData.length; i++) {
                    resultObj = this._buildTableBody(target, i);
                    subTitleId = id + "subTitle";
                    bodyHTML += "<div class='" + styleClass.subTitleClass
                    + "'><div id='" + subTitleId + i + "' class='bowknot-left " + styleClass.subTitleHideClass
                    + "'></div><div class='bowknot-left'>" + subData[i].title
                    + "</div><div class='bowknot-clear'></div></div>" + resultObj.bodyHTML;
                }
            } else {
                resultObj = this._buildTableBody(target, -1);
                bodyHTML = resultObj.bodyHTML;
            }

            if (settings.data) {
                data = settings.data
            } else {
                data = $.table._buildSubData(settings.subData);
            }
            $("#" + id + "TableMain").html(bodyHTML);
            var oHeight = $("#" + id + "TableMain").attr("offsetHeight");
            if (subData) {
                for (var j = 0; j < subData.length; j++) {
                    $("#" + subTitleId + j).click(function (){
                        var num = this.id.split("subTitle")[1];
                        if ($(this).hasClass(styleClass.subTitleHideClass)) {
                            $("#" + id + "subTable" + num).hide();
                            if (oHeight - $("#" + id + "subTable" + num).height() <= height) {
                                $("#" + id + "TableHeader").css("padding-right", 0);
                            }
                            this.className = "bowknot-left " + styleClass.subTitleShowClass;
                        } else {
                            $("#" + id + "subTable" + num).show();
                            if (oHeight > height) {
                                $("#" + id + "TableHeader").css("padding-right", SCROLLBAR_WIDTH - 1);
                            }
                            this.className = "bowknot-left " + styleClass.subTitleHideClass;
                        }
                    });
                }
            }
            // save default selected data at checkbox.
            if (resultObj.checkAllId !== "") {
                var invisibleDatas = $.table._getInvisibleData(settings.colModel, data, resultObj.checkedArray);
                for (var element in invisibleDatas) {
                    $("#" + resultObj.checkAllId).data(element, invisibleDatas[element]);
                }
            }
        },

        _buildTableBody: function (target, num) {
            var id = this._getInst(target).id,
            settings = this._getInst(target).settings;
            var colModel = settings.colModel,
            checkAllId = "",
            checkedArray = [],
            styleClass = $.table._getDefaults($.table._defaults, settings, "styleClass");
            var tableWidth = $.table._getTableWidth(colModel),
            bodyHTML = "<table id='" + id + "subTable" + num + "' cellpadding='0' cellspacing='0'>",
            data = [],
            currentDataNum = 0;

            if (num !== -1) {
                data = settings.subData[num].data;
            } else {
                data = settings.data;
            }

            for (var currentData = 0; currentData < num; currentData++) {
                currentDataNum += settings.subData[currentData].data.length;
            }

            if (tableWidth.width === "100%") {
                if ($.browser.version === "6.0") {
                    bodyHTML = "<table id='" + id + "subTable" + num + "' style='width:auto;' cellpadding='0' cellspacing='0'>";
                } else {
                    bodyHTML = "<table id='" + id + "subTable" + num + "' style='width:100%;' cellpadding='0' cellspacing='0'>";
                }
            }

            for (var i = 0; i < data.length; i++) {
                var elements = data[i],
                j = 0,
                trHTML = "",
                tdHTML = "",
                rowClass = styleClass.oddRowClass;

                if (i%2 === 1) {
                    rowClass = styleClass.evenRowClass;
                }

                // Binds style for mouseover, mouseout and click on each row.
                trHTML += '<tr class="$CLASS" '
                + ' onmouseover="DP_jQuery_' + dpuuid + '.table._mouseoverRow(this, \''
                + styleClass.lineHoverClass + '\', \'' + styleClass.highlightClass + '\');"'
                + ' onmouseout="DP_jQuery_' + dpuuid + '.table._mouseoutRow(this, \''
                + styleClass.lineHoverClass + '\');">';

                for (var tempIndex in elements) {
                    var colModelIndex = colModel[j].index;

                    for (var index in elements) {
                        if(colModelIndex === index && colModel[j].visible === undefined) {
                            var dataElement = elements[index],
                            textAlignHTML = colModel[j].textAlign ? "text-align:"
                            + colModel[j].textAlign + ";" : "";

                            if (i === 0) {    // For first row, give it width.
                                if (colModel[j].minWidth) {
                                    tdHTML += "<td style='"
                                    + "min-width:" + colModel[j].minWidth + "px;"
                                    + textAlignHTML + "'>";
                                } else {
                                    tdHTML += "<td style='"
                                    + "width:" + colModel[j].width + "px;"
                                    + textAlignHTML + "'>";
                                }
                            } else {
                                tdHTML += "<td style='" + textAlignHTML + "'>";
                            }

                            // When this column has input type, change data to HTML input element
                            // and type is for inputType.
                            // TODO: now, just suport checkbox.
                            if (colModel[j].inputType === "checkbox") {
                                var checkboxHTML = "",
                                isCheckedHTML = "",
                                isDisabledHTML = "",
                                checkId = id + "_" + index + "_" + (i + currentDataNum);
                                checkAllId = id + "_" + index;

                                if (data[i][index].value) {
                                    isCheckedHTML = "checked='checked'";
                                    trHTML = trHTML.replace("$CLASS", styleClass.highlightClass
                                        + " " + rowClass);
                                    checkedArray.push(i + currentDataNum);
                                }

                                if (data[i][index].disabled) {
                                    isDisabledHTML = "disabled='disabled'";
                                }

                                checkboxHTML = "<input id='" + checkId + "' type='"
                                + colModel[j].inputType + "' onclick=\"DP_jQuery_" + dpuuid
                                + ".table._selectCheckbox(this, '" + styleClass.highlightClass + "');\" "
                                + isCheckedHTML + " " + isDisabledHTML + "/>";
                                dataElement = checkboxHTML;
                            }


                            // When this column has float layer, add this icon to trigger event.
                            if (colModel[j].floatLayer) {
                                var floatLayerIconHTML = "",
                                floatLayerEventHTML = colModel[j].floatLayerEvent ? colModel[j].floatLayerEvent + "();" : "";
                                // TODO: id exposed, very unsafe.
                                floatLayerIconHTML = "<div class='" + styleClass.floatLayerIconClass + "'"
                                + ' onmouseover="DP_jQuery_' + dpuuid + '.table._bindShowData(\''
                                + colModel[j].floatLayer + '\', \'' + id + '\',\'' + (i + currentDataNum)
                                + '\');' + floatLayerEventHTML + 'DP_jQuery_' + dpuuid
                                + '.table._show(this, \'' + colModel[j].floatLayer + '\');" '
                                + ' onmouseout="DP_jQuery_' + dpuuid + '.table._hide(\''
                                + colModel[j].floatLayer + '\');"></div>';

                                dataElement = floatLayerIconHTML + dataElement;
                                if ((i + currentDataNum) === 0) {
                                    var element = document.getElementById(colModel[j].floatLayer);
                                    var floatLayerHTML = '<' + element.tagName + " class='"
                                    + element.className + "' id='" + colModel[j].floatLayer
                                    + "Table'>" + $("#" + colModel[j].floatLayer).html()
                                    + "</" + element.tagName + ">";
                                    $("#" + id + "Table").append(floatLayerHTML);
                                    $("#" + colModel[j].floatLayer + "Table").mouseover(function () {
                                        $(this).show();
                                    }).mouseout(function () {
                                        $(this).hide();
                                    });

                                }
                            }

                            if (colModel[j].style) {
                                dataElement = "<div style='" + colModel[j].style + "'>" + dataElement + "</div>";
                            }

                            tdHTML += dataElement + "</td>";
                        }
                    }
                    j++;    // Counting for column.
                }
                bodyHTML += trHTML.replace("$CLASS", rowClass) + tdHTML + "</tr>";
            }

            return {
                "bodyHTML": bodyHTML + "</table>",
                "checkAllId": checkAllId,
                "checkedArray": checkedArray
            };
        },

        _getTableWidth: function (colModel) {
            var tableWidth = {
                width: 1,
                minWidth: 0
            },
            tag = false;
            for (var i = 0; i < colModel.length; i++) {
                if (colModel[i].visible !== false) {
                    if (colModel[i].minWidth) {
                        tableWidth.minWidth += colModel[i].minWidth + 1;
                        tableWidth.width = "100%";
                        tag = true;
                    } else if (colModel[i].width){
                        tableWidth.minWidth += colModel[i].width + 1;
                        if (tag) {
                            tableWidth.width = "100%";
                        } else {
                            tableWidth.width += colModel[i].width + 1;
                        }
                    }
                }
            }
            return tableWidth;
        },

        // TODO: this method judgement should be pull up, must be refactor.
        _bindEvent: function (target) {
            var inst = $.table._getInst(target);
            var id = inst.id,
            settings = inst.settings,
            colModel = inst.settings.colModel,
            data = [];

            if (settings.data) {
                data = settings.data
            } else {
                data = $.table._buildSubData(settings.subData);
            }

            for (var i = 0; i < colModel.length; i++) {
                if (colModel[i].bindEvent) {
                    for (var j = 0; j < data.length; j++) {
                        var bindElement = $($($($("#" + id + "TableMain tr")
                            .get(j)).find("td")).get(i));
                        var keys = $.table._getInvisibleData(colModel, data, [j]);
                        for (var k = 0; k < colModel[i].bindEvent.length; k++) {
                            if (colModel[i].inputType) {
                                bindElement.find("input").bind(colModel[i].bindEvent[k].eventName,
                                    keys, eval(colModel[i].bindEvent[k].functionName));
                            } else {
                                bindElement.bind(colModel[i].bindEvent[k].eventName,
                                    keys, eval(colModel[i].bindEvent[k].functionName));
                            }
                        }
                    }
                }
            }
        },

        _buildSubData: function (subData) {
            var data = [];
            for (var j = 0; j < subData.length; j++) {
                for (var m = 0; m < subData[j].data.length; m++) {
                    data.push(subData[j].data[m]);
                }
            }
            return data;
        },

        _bindRowEvent: function (target) {
            var settings = $.table._getInst(target).settings,
            id = $.table._getInst(target).id;
            var bindRowEvent = settings.bindRowEvent;
            if (bindRowEvent) {
                var colModel = settings.colModel,
                data = [];

                if (settings.data) {
                    data = settings.data
                } else {
                    data = $.table._buildSubData(settings.subData);
                }

                for (var i = 0; i < data.length; i++) {
                    var bindElement = $($("#" + id + "TableMain tr").get(i));
                    var keys = $.table._getInvisibleData(colModel, data, [i]);
                    for (var j = 0; j < bindRowEvent.length; j++) {
                        if (typeof(bindRowEvent[j].action) === "function") {
                            bindElement.bind(bindRowEvent[j].eventName, keys, bindRowEvent[j].action);
                        } else {
                            bindElement.bind(bindRowEvent[j].eventName, keys, eval(bindRowEvent[j].functionName));
                        }
                    }
                }
            }
        },

        _getInvisibleData: function (colModel, data, indexNumArray) {
            var invisibleData = {};
            for (var i = 0; i < colModel.length; i++) {
                if (colModel[i].visible === false) {
                    var keyArray = [];
                    for (var j = 0; j < indexNumArray.length; j++) {
                        keyArray.push(data[indexNumArray[j]][colModel[i].index]);
                    }
                    invisibleData[colModel[i].index] = keyArray;
                }
            }
            return invisibleData;
        },

        // TODO: Unuse, should be remove.
        _selectRow: function (it, id, highlightClass) {
        //$("#" + id + "TableMain tr").removeClass(highlightClass);
        //$(it).addClass(highlightClass);
        },

        _mouseoverRow: function (it, lineHoverClass, highlightClass) {
            if (!$(it).hasClass(highlightClass)) {
                $(it).addClass(lineHoverClass);
            }
        },

        _mouseoutRow: function (it, lineHoverClass) {
            $(it).removeClass(lineHoverClass);
        },

        _sort: function (event) {
            var index = event.data.index,
            target = event.data.target;
            var settings = $.table._getInst(target).settings,
            id = this.id.split("_")[0];
            var data = settings.data,
            colModel = settings.colModel,
            styleClass = $.table._getDefaults($.table._defaults, settings, "styleClass");
            var  sortType = "",
            divs = "#" + this.id + " .",
            currentColModel = undefined;

            // sort style
            for (var p = 0; p < colModel.length; p++) {
                if (colModel[p].index === index) {
                    sortType = colModel[p].sortType;
                    currentColModel = colModel[p];
                }else {
                    $("#" + id + "_" + colModel[p].index + "TableSort ." + styleClass.sortASCClass).addClass(styleClass.sortUnASCClass);
                    $("#" + id + "_" + colModel[p].index + "TableSort ." + styleClass.sortDESCClass).addClass(styleClass.sortUnDESCClass);
                }
            }

            if (($(divs + styleClass.sortASCClass).hasClass(styleClass.sortUnASCClass)
                &&  $(divs + styleClass.sortDESCClass).hasClass(styleClass.sortUnDESCClass))
            || ($(divs + styleClass.sortASCClass).hasClass(styleClass.sortUnASCClass)
                && !$(divs + styleClass.sortDESCClass).hasClass(styleClass.sortUnDESCClass))) {
                if (currentColModel.sortEvent) {
                    eval(currentColModel.sortEvent)("ASC");
                } else {
                    for (var i = 1; i <= data.length; i++) {
                        for (var j = 0; j < data.length - i; j++) {
                            var temp = data[j],
                            tempIndex = $.table._getsortType(temp[index], sortType),
                            dataIndex = $.table._getsortType(data[j + 1][index], sortType);
                            if (tempIndex > dataIndex) {
                                data[j] = data[j + 1];
                                data[j + 1] = temp;
                            }
                        }
                    }
                }
                $(divs + styleClass.sortASCClass).removeClass(styleClass.sortUnASCClass);
                $(divs + styleClass.sortDESCClass).addClass(styleClass.sortUnDESCClass);
            } else {
                if (currentColModel.sortEvent) {
                    eval(currentColModel.sortEvent)("DESC");
                } else {
                    for (var k = 1; k <= data.length; k++) {
                        for (var l = 0; l < data.length - k; l++) {
                            var tempAsc = data[l],
                            tempIndexAsc = $.table._getsortType(tempAsc[index], sortType),
                            dataIndexAsc = $.table._getsortType(data[l + 1][index], sortType);

                            if (tempIndexAsc < dataIndexAsc) {
                                data[l] = data[l + 1];
                                data[l + 1] = tempAsc;
                            }
                        }
                    }
                }

                $(divs + styleClass.sortASCClass).addClass(styleClass.sortUnASCClass);
                $(divs + styleClass.sortDESCClass).removeClass(styleClass.sortUnDESCClass);
            }
            var height = $.table._getDefaults($.table._defaults, settings,"height");
            if (settings.data && !currentColModel.sortEvent) {
                $.table._buildBody(target, $.table._strToInt(height));
                $.table._bindEvent(target);
                $.table._bindRowEvent(target);
            }
        },

        _getsortType: function (src, sortType) {
            if (sortType === "int") {
                return parseInt(src);
            } else if (sortType === "float") {
                return parseFloat(src);
            }
            return src;
        },

        _mousemoveTabel: function (event) {
            if (window.attachEvent) {
                event.preventDefault(); // to prevent highlighting text in table cells
            }

            var target = event.data.target;
            var inst = $.table._getInst(target);
            var id = inst.id,
            colModel = inst.settings.colModel;
            var positionX = event.clientX - document.getElementById(id).offsetLeft - $.table._getPadding(id) + $("#" + id + "Table").scrollLeft(),
            isAtColumnSide = $.table._isAtColumnSide(positionX, target),
            i = 0,
            minWidth = 0;

            $("#" + id + "VerticalLine").css("left", positionX);

            for (; i < colModel.length; i++) {
                if ($.table._defaults.currentIndex !== "") {
                    if (colModel[i].index === $.table._defaults.currentIndex) {
                        minWidth += $("#" + id + "_" + colModel[i].index).width() + 16;
                        break;
                    }
                    minWidth += colModel[i].width  + 1;
                } else {
                    break;
                }
            }

            if (positionX < minWidth) {
                $("#" + id + "VerticalLine").css("left", minWidth);
            }

            if (isAtColumnSide.show) {
                $("#" + id + "Table").css("cursor", "col-resize");
            } else {
                $("#" + id + "Table").css("cursor", "default");
            }
        },

        _mousedownVerticalLine: function (event) {
            var target = event.data.target;
            var id = $.table._getInst(target).id;
            var positionX = event.clientX - document.getElementById(id).offsetLeft - $.table._getPadding(id) + $("#" + id + "Table").scrollLeft(),
            isAtColumnSide = $.table._isAtColumnSide(positionX, target);

            $.table._defaults.currentIndex = isAtColumnSide.index;

            $("#" + id + "Table").unbind("mouseup", $.table._mouseupVerticalLine);
            if (isAtColumnSide.show) {
                if (window.addEventListener) {
                    event.preventDefault(); // to prevent highlighting text in table cells
                }

                $("#" + id + "Table").css("cursor", "col-resize").bind("mouseup", {
                    "target": target,
                    "index": isAtColumnSide.index
                }, $.table._mouseupVerticalLine);
                $("#" + id + "VerticalLine").show();
            } else {
                $("#" + id + "Table").unbind("mouseup", $.table._mouseupVerticalLine);
            }
        },

        _mouseupVerticalLine: function (event) {
            var target = event.data.target,
            index = event.data.index;
            var id = $.table._getInst(target).id,
            settings = $.table._getInst(target).settings,
            verticalLineLeft = $("#" + id + "VerticalLine").css("left");
            var colModel = settings.colModel,
            indexWidth = $.table._strToInt(verticalLineLeft),
            i = 0,
            tableWidth = 0;

            $("#" + id + "VerticalLine").hide();
            $("#" + id + "Table").css("cursor", "default");

            for (; i < colModel.length; i++) {
                if (colModel[i].index === index) {
                    colModel[i].width = indexWidth;
                    break;
                }
                indexWidth = indexWidth - 1 - colModel[i].width;
            }

            if ($("#" + id + "TableMain").attr("scrollHeight")
                !== $("#" + id + "TableMain").attr("clientHeight")) {
                tableWidth = $.table._getTableWidth(colModel).width + SCROLLBAR_WIDTH;
            } else {
                tableWidth = $.table._getTableWidth(colModel).width;
            }

            $($("#" + id + "TableHeader th").get(i)).width(indexWidth);
            var subTables = $("#" + id + "TableMain table");
            for (var j = 0; j < subTables.length; j++) {
                $($($(subTables[j]).find("tr").get(0)).find("td").get(i)).width(indexWidth);
            }
            $("#" + id + "TableHeader").width(tableWidth);
            $("#" + id + "TableMain").width(tableWidth);
        },

        _isAtColumnSide: function (positionX, target) {
            var id = $.table._getInst(target).id,
            colModel = $.table._getInst(target).settings.colModel,
            isColumnSide = {
                "show": false,
                "index": ""
            },
            columnWidth = 0;

            for (var i = 0; i < colModel.length; i++) {
                columnWidth += $($("#" + id + "TableMain tr").first().find("td").get(i)).width() + 1;
                isColumnSide.show = isColumnSide.show
                || positionX === columnWidth
                || positionX === columnWidth + 1
                || positionX === columnWidth - 1;
                if (isColumnSide.show) {
                    isColumnSide.index = colModel[i].index;
                    return isColumnSide;
                }
            }
            return isColumnSide;
        },

        _bindShowData: function (floatLayerId, id, num) {
            var settings = $("#" + id).data(PROP_NAME).settings,
            data = [];
            if (settings.data) {
                data = settings.data
            } else {
                data = $.table._buildSubData(settings.subData);
            }
            var invisibleDatas = $.table._getInvisibleData(settings.colModel, data, [num]);
            for (var element in invisibleDatas) {
                $("#" + floatLayerId).data(element, invisibleDatas[element]);
            }
        },

        _show: function (it, floatLayerId) {
            var position = $(it).position();
            $("#" + floatLayerId + "Table").show().html($("#" + floatLayerId).html()).css({
                "left": position.left + 22,
                "top": position.top + 6
            });
        },

        _hide: function (floatLayerId) {
            $("#" + floatLayerId + "Table").hide();
        },

        _selectHeaderCheckbox: function (it, highlightClass) {
            var arrayIt = it.id.split("_");
            var id = arrayIt[0],
            index = arrayIt[1];
            var settings = $("#" + id).data(PROP_NAME).settings;
            var data = settings.data,
            colModel = settings.colModel,
            temp = [];

            if (settings.data) {
                data = settings.data
            } else {
                data = $.table._buildSubData(settings.subData);
            }

            for (var i = 0; i < colModel.length; i ++) {
                if (colModel[i].index === index) {
                    for (var j = 0; j < data.length; j++) {
                        var checkBoxId = id + "_" + index + "_" + j;
                        var checkBox = document.getElementById(checkBoxId);
                        if (it.checked) {
                            if ((data[j][index].disabled && data[j][index].value) || !data[j][index].disabled) {
                                data[j][index].value = true;
                                $("#" + checkBoxId).attr("checked","checked");
                                temp.push(j);
                                if (checkBox.parentNode.parentNode.className.indexOf(highlightClass) < 0) {
                                    checkBox.parentNode.parentNode.className = checkBox.parentNode.parentNode.className + " " + highlightClass;
                                }
                            }
                        } else {
                            if (data[j][index].disabled && data[j][index].value) {
                                temp.push(j);
                            } else {
                                data[j][index].value = false;
                                $("#" + checkBoxId).removeAttr("checked");
                                checkBox.parentNode.parentNode.className = checkBox.parentNode.parentNode.className.replace(highlightClass, "");
                            }
                        }
                    }
                }
            }

            var invisibleDatas = $.table._getInvisibleData(settings.colModel, data, temp);
            for (var element in invisibleDatas) {
                $(it).data(element, invisibleDatas[element]);
            }
        },

        _selectCheckbox: function (it, highlightClass) {
            var keys = it.id.split("_");
            var id = keys[0],
            index = keys[1],
            order = keys[2];
            var checkboxId = id + "_" + index;
            var settings = $("#" + id).data(PROP_NAME).settings;
            var colModel = settings.colModel,
            data = [],
            className = it.parentNode.parentNode.className,
            checkedArray = [];

            if (settings.data) {
                data = settings.data
            } else {
                data = $.table._buildSubData(settings.subData);
            }

            data[order][index].value = it.checked;

            for (var i = 0; i < data.length; i++) {
                if (data[i][index].value) {
                    checkedArray.push(i);
                }
            }

            var invisibleDatas = $.table._getInvisibleData(colModel, data, checkedArray);

            for (var element in invisibleDatas) {
                $("#" + checkboxId).data(element, invisibleDatas[element]);
            }

            // style
            if (it.checked) {
                it.parentNode.parentNode.className = className + " " + highlightClass;
            } else {
                it.parentNode.parentNode.className = className.replace(highlightClass, "");
            }

            // all checked state
            if (checkedArray.length === data.length) {
                $("#" + checkboxId).attr("checked", "checked");
            } else {
                $("#" + checkboxId).removeAttr("checked");
            }

        },

        _getMarginPadding: function (id) {
            var marginLeft = $.table._strToInt(document.getElementById(id).style.marginLeft),
            paddingLeft = $.table._strToInt(document.getElementById(id).style.paddingLeft);
            if (document.getElementById(id).style.marginLeft === "") {
                marginLeft = 0;
            }
            if (document.getElementById(id).style.paddingLeft === "") {
                paddingLeft = 0;
            }
            return marginLeft + paddingLeft;
        },

        _getPadding: function (id) {
            var paddingLeft = $.table._strToInt(document.getElementById(id).style.paddingLeft);
            if (document.getElementById(id).style.paddingLeft === "") {
                paddingLeft = 0;
            }
            return paddingLeft;
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
                    if (defaults[key] !== "auto") {
                        return defaults[key] + "px";
                    } else {
                        return defaults[key];
                    }
                } else {
                    if (settings[key] !== "auto") {
                        return settings[key] + "px";
                    }
                }
            } else {
                if (settings[key] === null || settings[key] === undefined) {
                    return defaults[key];
                }
            }
            return settings[key];
        },

        _strToInt: function (str) {
            if(!str){
                return false;
            }
            return parseInt(str.substring(0, str.length - 2));
        },

        _optionTable: function(target, name, value) {
            // TODO: sub table
            var inst = this._getInst(target);
            return inst.settings[value];
        },

        _getCellsTable: function (target, name, options) {
            // TODO: sub table
            var inst = this._getInst(target),
            data = inst.settings.data,
            colModel = inst.settings.colModel,
            cells = [],
            indexNum = 0;
            for (var j = 0; j < colModel.length; j++) {
                if (colModel[j].index === options.index) {
                    indexNum = j;
                }
            }
            for (var i = 0; i < data.length; i++) {
                if (data[i][options.index] === options.value) {
                    if (options.col) {
                        cells.push($("#" + inst.id + "_" + options.col + "_" + i));
                    } else {
                        cells.push($($($("#" + inst.id + "subTable-1 tr").get(i)).find("td").get(indexNum)));
                    }
                }
            }
            return cells;
        }
    });

    $.fn.table = function (options) {
        var otherArgs = Array.prototype.slice.call(arguments);
        if ((options === 'option' || options === "getCells")
            && arguments.length == 2) {
            return $.table['_' + options + 'Table'].
            apply($.table, [this[0]].concat(otherArgs));
        }
        return this.each(function () {
            if (options.update) {
                return $.table._updateTable(this, options.update);
            } else {
                return typeof options === "string" ?
                $.table["_" + options + "Table"].
                apply($.table, [this].concat(otherArgs)) :
                $.table._attach(this, options);
            }
        });
    };

    $.table = new Table();

    // Add another global to avoid noConflict issues with inline event handlers
    window["DP_jQuery_" + dpuuid] = $;
})(jQuery);